import workletUrl from "./vad-worklet?worker&url";

export class VAD {
  context: AudioContext;
  volumeMeterNode: AudioWorkletNode | null;
  tracks: { [key: string]: null | MediaStreamAudioSourceNode } = {
    local: null,
    remove: null,
  };

  constructor() {
    this.context = new AudioContext();
    this.volumeMeterNode = null;

    this.init();
  }

  init = async () => {
    await this.context.audioWorklet.addModule(workletUrl);

    this.volumeMeterNode = new AudioWorkletNode(this.context, "volume-meter");
    this.volumeMeterNode.port.onmessage = ({ data }) => {
      console.log(data * 500);
    };
  };

  startAudio = async (type: string, track: MediaStreamTrack) => {
    if (!this.volumeMeterNode || !this.context) {
      return;
    }

    // Disconnect previous tracks of type
    if (this.tracks[type]) {
      this.tracks[type]?.disconnect();
    }

    const stream = new MediaStream([track]);
    const source = this.context.createMediaStreamSource(stream);
    source.connect(this.volumeMeterNode).connect(this.context.destination);

    this.tracks[type] = source;
  };

  stopAudio = (type: string) => {
    if (this.tracks[type]) {
      this.tracks[type]?.disconnect();
      this.tracks[type] = null;
    }
  };

  cleanup = () => {
    this.context.destination.disconnect();
    this.context.close();
  };
}
