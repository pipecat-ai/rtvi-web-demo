import workletUrl from "./vad-worklet?worker&url";

export class VAD {
  context: AudioContext;
  source: MediaStreamAudioSourceNode | null;

  constructor() {
    this.source = null;
    this.context = new AudioContext();
  }

  startAudio = async (track: MediaStreamTrack) => {
    // Remove exising source from the context..
    if (this.source) {
      this.context.destination.disconnect();
      this.source.disconnect();
      this.source = null;
    }

    const stream = new MediaStream([track]);
    this.source = this.context.createMediaStreamSource(stream);
    await this.context.audioWorklet.addModule(workletUrl);

    const volumeMeterNode = new AudioWorkletNode(this.context, "volume-meter");
    volumeMeterNode.port.onmessage = ({ data }) => {
      console.log(data * 500);
    };
    this.source.connect(volumeMeterNode).connect(this.context.destination);
  };

  cleanup = () => {
    if (this.context) {
      this.context.close();
    }
  };
}
