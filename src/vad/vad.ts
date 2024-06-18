import type { FrameProcessorOptions } from "./frame-processor";
import {
  defaultFrameProcessorOptions,
  RECOMMENDED_FRAME_SAMPLES,
} from "./frame-processor";
import { SpeechProbabilities } from "./models";
import { AudioVADNode } from "./node";

const defaultVADOptions: VADOptions = {
  ...defaultFrameProcessorOptions,
  workletURL: "./worklet.ts",
  modelURL: "./silero_vad.onnx",
  stream: null,
  onVADMisfire: () => {
    console.log("[VAD] VAD misfire");
  },
  onSpeechStart: () => {
    console.log("[VAD] Speech start detected");
  },
  onSpeechEnd: () => {
    console.log("[VAD] Speech end detected");
  },
  onFrameProcessed: () => {},
  additionalAudioConstraints: {
    channelCount: 1,
    echoCancellation: true,
    autoGainControl: true,
    noiseSuppression: true,
  },
};

export interface VADOptions extends FrameProcessorOptions {
  workletURL: string;
  modelURL: string;
  onSpeechStart: () => void;
  onSpeechEnd: (audio: Float32Array) => void;
  onFrameProcessed: (probabilities: SpeechProbabilities) => void;
  onVADMisfire: () => void;
  stream: MediaStream | null;
  additionalAudioConstraints: MediaTrackConstraints;
}

export enum VADState {
  initializing = "initializing",
  loading = "loading",
  ready = "ready",
  listening = "listening",
  paused = "paused",
  destroyed = "destroyed",
  errored = "errored",
}

interface VADCallbacks {
  onSpeechStart: () => void;
  onSpeechEnd: (audio: Float32Array) => void;
  onFrameProcessed: (probabilities: SpeechProbabilities) => void;
  onVADMisfire: () => void;
}

export interface VADInterface extends VADCallbacks {
  state: VADState;
  init(): Promise<AudioVADNode>;
  validateOptions(): boolean;
  audioContext: AudioContext | null;
  stream: MediaStream | null;
  sourceNode: MediaStreamAudioSourceNode | null;
}

export class VAD implements VADInterface {
  public options: VADOptions;
  public state: VADState;
  public audioContext: AudioContext | null = null;
  public stream: MediaStream | null = null;
  public sourceNode: MediaStreamAudioSourceNode | null = null;
  public audioVADNode: AudioVADNode | null = null;

  constructor(options: Partial<VADOptions>) {
    this.options = {
      ...defaultVADOptions,
      ...options,
      additionalAudioConstraints: {
        ...defaultVADOptions.additionalAudioConstraints,
        ...options.additionalAudioConstraints,
      },
    };
    this.state = VADState.initializing;

    if (!this.validateOptions()) {
      return;
    }
  }
  async init(): Promise<AudioVADNode> {
    let stream: MediaStream = this.options.stream!;

    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          ...this.options.additionalAudioConstraints,
          channelCount: 1,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
        },
      });
    }

    // Create a new audio context
    const audioContext = new AudioContext();
    const sourceNode = new MediaStreamAudioSourceNode(audioContext, {
      mediaStream: stream,
    });

    this.state = VADState.loading;

    // Create a new Audio VAD node to load models and process frames
    const audioNodeVAD = new AudioVADNode(audioContext, this.options);
    await audioNodeVAD.load();
    audioNodeVAD.receive(sourceNode);

    // Update references
    this.audioContext = audioContext;
    this.sourceNode = sourceNode;
    this.audioVADNode = audioNodeVAD;

    this.state = VADState.ready;

    return audioNodeVAD;
  }

  validateOptions(): boolean {
    const options = this.options;
    if (!RECOMMENDED_FRAME_SAMPLES.includes(options.frameSamples)) {
      console.warn("You are using an unusual frame size");
    }
    if (
      options.positiveSpeechThreshold < 0 ||
      options.positiveSpeechThreshold > 1
    ) {
      console.error(
        "postiveSpeechThreshold should be a number between 0 and 1"
      );
    }
    if (
      options.negativeSpeechThreshold < 0 ||
      options.negativeSpeechThreshold > options.positiveSpeechThreshold
    ) {
      console.error(
        "negativeSpeechThreshold should be between 0 and postiveSpeechThreshold"
      );
    }
    if (options.preSpeechPadFrames < 0) {
      console.error("preSpeechPadFrames should be positive");
    }
    if (options.redemptionFrames < 0) {
      console.error("preSpeechPadFrames should be positive");
    }

    return true;
  }

  onFrameProcessed() {}
  onVADMisfire() {}
  onSpeechStart() {}
  onSpeechEnd() {}

  pause = () => {
    this.audioVADNode?.pause();
    this.state = VADState.paused;
  };

  start = () => {
    if (this.state !== VADState.ready) {
      this.state = VADState.errored;
      throw Error(
        "Attempt to start VAD without initializing. Please await init() first."
      );
    }
    this.audioVADNode?.start();
    this.state = VADState.listening;
  };

  destroy = () => {
    if (this.state === VADState.listening) {
      this.pause();
    }
    if (this.options.stream === undefined) {
      this.stream?.getTracks().forEach((track) => track.stop());
    }
    this.sourceNode?.disconnect();
    this.audioVADNode?.destroy();
    this.audioContext?.close();

    this.state = VADState.destroyed;
  };
}

export default VAD;
