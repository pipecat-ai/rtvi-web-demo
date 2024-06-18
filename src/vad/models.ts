import * as ort from "onnxruntime-web";

export interface SpeechProbabilities {
  notSpeech: number;
  isSpeech: number;
}

export interface Model {
  reset_state: () => void;
  process: (arr: Float32Array) => Promise<SpeechProbabilities>;
}

export class Silero {
  private _session: ort.InferenceSession | null;
  private _sr: ort.Tensor;
  private _h: ort.Tensor;
  private _c: ort.Tensor;
  private zeroes = Array(2 * 64).fill(0);

  constructor() {
    this._session = null;
    this._sr = new ort.Tensor("int64", [16000n]);
    this._h = new ort.Tensor("float32", this.zeroes, [2, 1, 64]);
    this._c = new ort.Tensor("float32", this.zeroes, [2, 1, 64]);
  }

  async init(modelURL: string) {
    const modelArrayBuffer = await fetch(modelURL).then((m) => m.arrayBuffer());
    this._session = await ort.InferenceSession.create(modelArrayBuffer);
    this.reset_state();
  }

  reset_state = () => {
    this._h = new ort.Tensor("float32", this.zeroes, [2, 1, 64]);
    this._c = new ort.Tensor("float32", this.zeroes, [2, 1, 64]);
  };

  process = async (audioFrame: Float32Array): Promise<SpeechProbabilities> => {
    if (!this._session) {
      throw new Error("Model not loaded");
    }

    const t = new ort.Tensor("float32", audioFrame, [1, audioFrame.length]);
    const inputs = {
      input: t,
      h: this._h,
      c: this._c,
      sr: this._sr,
    };
    const out = await this._session.run(inputs);
    this._h = out.hn;
    this._c = out.cn;
    const isSpeech: number = out.output.data[0] as number;
    const notSpeech = 1 - isSpeech;
    return { notSpeech, isSpeech };
  };
}
