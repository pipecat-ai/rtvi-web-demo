import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  useAudioLevel,
  useAudioTrack,
  useLocalSessionId,
  useParticipantIds,
  useParticipantProperty,
} from "@daily-co/daily-react";

import { VAD, VADState } from "@/vad";
import AudioWorkletURL from "@/vad/worklet.ts?worker&url";

enum State {
  SPEAKING = "Speaking",
  SILENT = "Silent",
}

const REMOTE_AUDIO_THRESHOLD = 0.1;

const Latency: React.FC<{ started: boolean }> = memo(
  ({ started = false }) => {
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
    const [hasSpokenOnce, setHasSpokenOnce] = useState<boolean>(false);
    const mountedRef = useRef<boolean>(false);

    /* ---- Timer actions ---- */
    const startTimer = useCallback(() => {
      const t = setInterval(() => {
        setDelta((prev) => prev + 1);
      }, 1);
      setTimer(t);
    }, []);

    const stopTimer = useCallback(() => {
      clearInterval(timer!);
      setTimer(null);
      setDelta(0);
    }, [timer]);

    // Stop timer when bot starts talking
    useAudioLevel(
      remoteAudioTrack?.persistentTrack,
      useCallback(
        (volume) => {
          if (volume > REMOTE_AUDIO_THRESHOLD && timer) {
            stopTimer();
          }
        },
        [stopTimer, timer]
      )
    );

    /* ---- Effects ---- */

    // Reset state on mount
    useEffect(() => {
      setDelta(0);
      setTimer(null);
      setVadInstance(null);
      setHasSpokenOnce(false);
    }, []);

    // Start timer after user has spoken once
    // Note: we use 'hasSpokenOnce' to avoid starting the timer
    // as soon as the experience loads (if for some reason VAD is triggered)
    useEffect(() => {
      if (
        !started ||
        !hasSpokenOnce ||
        !vadInstance ||
        vadInstance.state !== VADState.listening ||
        currentState !== State.SILENT
      ) {
        return;
      }
      startTimer();
    }, [started, vadInstance, currentState, startTimer, hasSpokenOnce]);

    useEffect(() => {
      if (mountedRef.current || !localAudioTrack) {
        return;
      }

      console.log("Loading VAD");

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
            setHasSpokenOnce(true);
            setCurrentState(State.SILENT);
          },
        });
        await vad.init();
        vad.start();
        setVadInstance(vad);
      }

      // Load VAD
      loadVad();

      mountedRef.current = true;
    }, [localAudioTrack]);

    // Cleanup timer
    useEffect(
      () => () => {
        if (timer) {
          clearInterval(timer!);
          setTimer(null);
        }
      },
      [timer]
    );

    // Cleanup VAD
    useEffect(
      () => () => {
        if (vadInstance && vadInstance.state !== VADState.destroyed) {
          setVadInstance(null);
          vadInstance?.destroy();
        }
      },
      [vadInstance]
    );

    /* ---- Render ---- */

    return (
      <div className="w-full">
        <span className="font-bold">{delta}ms</span>
        <div className="flex flex-row gap-3 w-full">
          <span>current state: {currentState}</span>
          <span>frames: {frames}</span>
        </div>
      </div>
    );
  },
  (prevState, nextState) => prevState.started === nextState.started
);

export default Latency;
