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
    const [currentState, setCurrentState] = useState<State>(State.SILENT);
    //const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [hasSpokenOnce, setHasSpokenOnce] = useState<boolean>(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const deltaRef = useRef<number>(0);
    const deltaArrayRef = useRef<number[]>([]);
    const mountedRef = useRef<boolean>(false);

    /* ---- Timer actions ---- */
    const startTimer = useCallback(() => {
      const t = setInterval(() => {
        deltaRef.current += 1;
      }, 1);
      timerRef.current = t;
      //setTimer(t);
    }, []);

    const stopTimer = useCallback(() => {
      clearInterval(timerRef.current!);

      deltaArrayRef.current = [...deltaArrayRef.current, deltaRef.current];
      deltaRef.current = 0;

      timerRef.current = null;
    }, []);

    // Stop timer when bot starts talking
    useAudioLevel(
      remoteAudioTrack?.persistentTrack,
      useCallback(
        (volume) => {
          if (volume > REMOTE_AUDIO_THRESHOLD && timerRef.current) {
            stopTimer();
          }
        },
        [stopTimer]
      )
    );

    /* ---- Effects ---- */

    // Reset state on mount
    useEffect(() => {
      timerRef.current = null;
      deltaRef.current = 0;
      deltaArrayRef.current = [];
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
        if (timerRef.current) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
        }
      },
      []
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

    console.log(deltaArrayRef.current);

    return (
      <div className="w-full">
        <div className="flex flex-row gap-3 w-full">
          <span>current state: {currentState}</span>
        </div>
      </div>
    );
  },
  (prevState, nextState) => prevState.started === nextState.started
);

export default Latency;
