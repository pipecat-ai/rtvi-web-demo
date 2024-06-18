import { Message } from "./messages";
import { Resampler } from "./resampler";

interface WorkletOptions {
  frameSamples: number;
}

class Processor extends AudioWorkletProcessor {
  resampler: Resampler | null = null;
  _initialized = false;
  _stopProcessing = false;
  options: WorkletOptions;

  constructor(options: AudioWorkletNodeOptions) {
    super();

    this.options = options.processorOptions as WorkletOptions;

    this.port.onmessage = (ev) => {
      if (ev.data.message === Message.SpeechStop) {
        this._stopProcessing = true;
      }
    };

    this.init();
  }

  init = async () => {
    this.resampler = new Resampler({
      nativeSampleRate: sampleRate,
      targetSampleRate: 16000,
      targetFrameSize: this.options.frameSamples,
    });
    this._initialized = true;
  };

  process(inputs: Float32Array[][]): boolean {
    if (this._stopProcessing || !this.resampler) {
      return false;
    }

    const arr = inputs[0][0];

    if (this._initialized && arr instanceof Float32Array) {
      const frames = this.resampler.process(arr);
      for (const frame of frames) {
        this.port.postMessage(
          { message: Message.AudioFrame, data: frame.buffer },
          [frame.buffer]
        );
      }
    }

    return true;
  }
}

registerProcessor("vad-helper-worklet", Processor);
