import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  useAudioLevel,
  useAudioTrack,
  useLocalSessionId,
  useParticipantIds,
  useParticipantProperty,
} from "@daily-co/daily-react";
import { clear } from "console";

import { VAD, VADState } from "@/vad";
import AudioWorkletURL from "@/vad/worklet.ts?worker&url";

enum State {
  SPEAKING = "Speaking",
  SILENT = "Silent",
}

const REMOTE_AUDIO_THRESHOLD = 0.1;

const Latency: React.FC = memo(() => {
  const localSessionId = useLocalSessionId();
  const [localAudioTrack] = useParticipantProperty(localSessionId, [
    "tracks.audio.persistentTrack",
  ]);
  const remoteParticipantId = useParticipantIds({ filter: "remote" })[0];
  const remoteAudioTrack = useAudioTrack(remoteParticipantId);

  const [vadInstance, setVadInstance] = useState<VAD | null>(null);
  const [frames, setFrames] = useState<number>(0);
  const [currentState, setCurrentState] = useState<State>(State.SILENT);
  const [delta, setDelta] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  //const [hasStarted, setHasStarted] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(false);

  const startTimer = useCallback(() => {
    //console.log("STARTING TIMER");

    const t = setInterval(() => {
      setDelta((prev) => prev + 1);
    }, 1);
    setTimer(t);
  }, []);

  const stopTimer = useCallback(() => {
    //console.log("STOPPING TIMER");
    clearInterval(timer!);
    setDelta(0);
  }, [timer]);

  useAudioLevel(
    remoteAudioTrack?.persistentTrack,
    useCallback(
      (volume) => {
        if (volume > REMOTE_AUDIO_THRESHOLD) {
          //console.log("REMOTE STARTED SPEAKING");
          stopTimer();
        }
      },
      [stopTimer]
    )
  );

  useEffect(() => {
    if (
      !vadInstance ||
      vadInstance.state !== VADState.listening ||
      currentState !== State.SILENT
    ) {
      return;
    }
    startTimer();
  }, [vadInstance, currentState, startTimer]);

  useEffect(() => {
    if (mountedRef.current || !localAudioTrack) {
      return;
    }

    console.log("Loading VAD");
    console.log(localAudioTrack);

    async function loadVad() {
      const stream = new MediaStream([localAudioTrack!]);

      const vad = new VAD({
        workletURL: AudioWorkletURL,
        stream,
        positiveSpeechThreshold: 0.6,
        minSpeechFrames: 5,
        redemptionFrames: 3,
        preSpeechPadFrames: 1,
        onFrameProcessed: () => {
          setFrames((prev) => prev + 1);
        },
        onSpeechStart: () => {
          setCurrentState(State.SPEAKING);
        },
        onVADMisfire: () => {
          setCurrentState(State.SILENT);
        },
        onSpeechEnd: () => {
          setCurrentState(State.SILENT);
        },
      });
      await vad.init();
      vad.start();
      setVadInstance(vad);
    }
    loadVad();

    mountedRef.current = true;
  }, [localAudioTrack]);

  // Cleanup
  useEffect(
    () => () => {
      if (vadInstance && vadInstance.state === VADState.destroyed) {
        console.log("DESTROYING VAD");
        vadInstance?.destroy();
      }
    },
    [vadInstance]
  );

  return (
    <div className="w-full">
      <span className="font-bold">{delta}ms</span>
      <div className="flex flex-row gap-3 w-full">
        <span>current state: {currentState}</span>
        <span>frames: {frames}</span>
      </div>
    </div>
  );
});

export default Latency;
