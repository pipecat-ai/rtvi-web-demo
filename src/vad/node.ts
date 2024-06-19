import { FrameProcessor } from "./frame-processor";
import { Message } from "./messages";
import { Silero, SpeechProbabilities } from "./models";
import { VADOptions } from "./vad";

export interface AudioVADNodeInterface {
  audioContext: AudioContext;
  options: VADOptions;
  vadNode: AudioWorkletNode | null;
  receive(sourceNode: MediaStreamAudioSourceNode): void;
}

export class AudioVADNode implements AudioVADNodeInterface {
  options: VADOptions;
  audioContext: AudioContext;
  vadNode: AudioWorkletNode | null;
  frameProcessor: FrameProcessor | null;

  constructor(audioContext: AudioContext, options: VADOptions) {
    this.audioContext = audioContext;
    this.options = options;
    this.vadNode = null;
    this.frameProcessor = null;
  }

  async load() {
    // Load worklet
    try {
      await this.audioContext.audioWorklet.addModule(this.options.workletURL);
    } catch (e) {
      console.error(
        `Encountered an error while loading worklet. Please make sure the worklet vad.bundle.min.js included with @ricky0123/vad-web is available at the specified path:
            ${this.options.workletURL}
            If need be, you can customize the worklet file location using the \`workletURL\` option.`
      );
      throw e;
    }
    const vadNode = new AudioWorkletNode(
      this.audioContext,
      "vad-helper-worklet",
      {
        processorOptions: {
          frameSamples: this.options.frameSamples,
        },
      }
    );

    // Load Silero
    const model: Silero = new Silero();
    await model.init(this.options.modelURL);

    // Load frame processor
    const frameProcessor = new FrameProcessor(
      model.process,
      model.reset_state,
      {
        frameSamples: this.options.frameSamples,
        positiveSpeechThreshold: this.options.positiveSpeechThreshold,
        negativeSpeechThreshold: this.options.negativeSpeechThreshold,
        redemptionFrames: this.options.redemptionFrames,
        preSpeechPadFrames: this.options.preSpeechPadFrames,
        minSpeechFrames: this.options.minSpeechFrames,
        submitUserSpeechOnPause: this.options.submitUserSpeechOnPause,
      }
    );

    vadNode.port.onmessage = async (ev: MessageEvent) => {
      switch (ev.data?.message) {
        case Message.AudioFrame: {
          const buffer: ArrayBuffer = ev.data.data;
          const frame = new Float32Array(buffer);
          await this.processFrame(frame);
          break;
        }
        default:
          break;
      }
    };

    this.vadNode = vadNode;
    this.frameProcessor = frameProcessor;

    return this;
  }

  start = () => {
    this.frameProcessor?.resume();
  };

  receive = (node: AudioNode) => {
    node.connect(this.vadNode!);
  };

  pause = () => {
    if (!this.frameProcessor) return;
    const ev = this.frameProcessor.pause();
    this.handleFrameProcessorEvent(ev);
  };

  processFrame = async (frame: Float32Array) => {
    if (!this.frameProcessor) return;
    const ev = await this.frameProcessor.process(frame);
    this.handleFrameProcessorEvent(ev);
  };

  destroy = () => {
    this.vadNode?.port.postMessage({
      message: Message.SpeechStop,
    });
    this.vadNode?.disconnect();
  };

  handleFrameProcessorEvent = (
    ev: Partial<{
      probs: SpeechProbabilities;
      msg: Message;
      audio: Float32Array;
    }>
  ) => {
    if (ev.probs !== undefined) {
      this.options.onFrameProcessed(ev.probs);
    }
    switch (ev.msg) {
      case Message.SpeechStart:
        this.options.onSpeechStart();
        break;

      case Message.VADMisfire:
        this.options.onVADMisfire();
        break;

      case Message.SpeechEnd:
        this.options.onSpeechEnd(ev.audio as Float32Array);
        break;

      default:
        break;
    }
  };
}

export default AudioVADNode;
