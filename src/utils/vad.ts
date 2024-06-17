import workletUrl from "./vad-worklet?worker&url";

export class VAD {
  context: AudioContext;
  tracks: { [key: string]: null | MediaStreamAudioSourceNode } = {
    local: null,
    remove: null,
  };

  constructor() {
    this.context = new AudioContext();

    this.init();
  }

  init = async () => {
    await this.context.audioWorklet.addModule(workletUrl);
  };

  startAudio = async (type: string, track: MediaStreamTrack) => {
    if (!this.context) {
      return;
    }

    // Disconnect previous tracks of type
    if (this.tracks[type]) {
      this.tracks[type]?.disconnect();
      this.tracks[type] = null;
    }

    const stream = new MediaStream([track]);
    const source = this.context.createMediaStreamSource(stream);

    // Create a audio worklet for this track
    const volumeMeterNode = new AudioWorkletNode(this.context, "volume-meter");
    volumeMeterNode.port.onmessage = ({ data }) => {
      console.log(type);
    };
    source.connect(volumeMeterNode).connect(this.context.destination);

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
