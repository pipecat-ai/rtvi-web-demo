export function vad(
  type: string,
  track: MediaStreamTrack,
  userStoppedSpeakingTime: number = 0.0
) {
  const audioContext = new AudioContext();

  const stream = new MediaStream([track]);
  const source = audioContext.createMediaStreamSource(stream);

  const bufferSize = 1024; // For 44100 this would be like 10ms
  const scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

  source.connect(scriptProcessor);
  scriptProcessor.connect(audioContext.destination);

  const speechThreshold = 0.03;
  const smoothingFactor = 0.2;
  const vadStartSecs = 0.2;
  const vadStopSecs = 0.8;

  let prevRMS = 0;
  let prevState = "silence";
  let lastTimeSpeaking = 0;
  let lastTimeSilence = Date.now() / 1000;

  // TODO(aleix): We need to stop this when the meeting ends.
  scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
    const inputBuffer = audioProcessingEvent.inputBuffer;
    const inputData = inputBuffer.getChannelData(0); // Assuming mono audio
    let sum = 0;

    // Compute the sum of squares of the samples
    for (let i = 0; i < inputData.length; i++) {
      sum += inputData[i] * inputData[i];
    }

    const rms = Math.sqrt(sum / inputData.length);
    const smoothedRMS = prevRMS + smoothingFactor * (rms - prevRMS);

    const speaking = smoothedRMS >= speechThreshold;

    const currTime = Date.now() / 1000;
    if (speaking) {
      if (prevState === "silence") {
        const speakingTime = currTime - lastTimeSilence;
        if (speakingTime >= vadStartSecs) {
          console.log(`${type} STARTED SPEAKING`, currTime);
          prevState = "speaking";
          if (type === "remote" && userStoppedSpeakingTime > 0.0) {
            const timing = currTime - userStoppedSpeakingTime - vadStartSecs;
            console.log(`TIMING BETWEEN USER AND BOT ${timing}`);
          }
        }
      }
      lastTimeSpeaking = currTime;
    } else {
      if (prevState === "speaking") {
        const silenceTime = currTime - lastTimeSpeaking;
        if (silenceTime >= vadStopSecs) {
          console.log(`${type} STOPPED SPEAKING`, currTime);
          prevState = "silence";
          if (type === "local") {
            userStoppedSpeakingTime = currTime - vadStopSecs;
          }
        }
      }
      lastTimeSilence = currTime;
    }

    prevRMS = smoothedRMS;
  };
}
