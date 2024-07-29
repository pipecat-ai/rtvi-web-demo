import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientMediaTrack } from "realtime-ai-react";
import { useVoiceClientEvent } from "realtime-ai-react";
import { VAD, VADState } from "web-vad";
import AudioWorkletURL from "web-vad/dist/worklet?worker&url";

import {
  LATENCY_MAX,
  LATENCY_MIN,
  VAD_MIN_SPEECH_FRAMES,
  VAD_NEGATIVE_SPEECH_THRESHOLD,
  VAD_POSITIVE_SPEECH_THRESHOLD,
  VAD_PRESPEECH_PAD_FRAMES,
  VAD_REDEMPTION_FRAMES,
} from "@/config";

import { calculateMedian } from "./utils";

import styles from "./styles.module.css";

enum State {
  SPEAKING = "Speaking",
  SILENT = "Silent",
}

const REMOTE_AUDIO_THRESHOLD = 0;

const Latency: React.FC<{
  started: boolean;
  botStatus: string;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ started = false, botStatus, statsAggregator }) => {
    const localMediaTrack = useVoiceClientMediaTrack("audio", "local");
    const [vadInstance, setVadInstance] = useState<VAD | null>(null);
    const [currentState, setCurrentState] = useState<State>(State.SILENT);
    const [botTalkingState, setBotTalkingState] = useState<State | undefined>(
      undefined
    );
    const [lastDelta, setLastDelta] = useState<number | null>(null);
    const [median, setMedian] = useState<number | null>(null);
    const [hasSpokenOnce, setHasSpokenOnce] = useState<boolean>(false);

    const deltaRef = useRef<number>(0);
    const deltaArrayRef = useRef<number[]>([]);
    const startTimeRef = useRef<Date | null>(null);
    const mountedRef = useRef<boolean>(false);

    /* ---- Timer actions ---- */
    const startTimer = useCallback(() => {
      startTimeRef.current = new Date();
    }, []);

    const stopTimer = useCallback(() => {
      if (!startTimeRef.current) {
        return;
      }

      const now = new Date();
      const diff = now.getTime() - startTimeRef.current.getTime();

      // Ignore any values that are obviously wrong
      // These may be triggered by small noises such as coughs etc
      if (diff < LATENCY_MIN || diff > LATENCY_MAX) {
        startTimeRef.current = null;
        return;
      }

      deltaArrayRef.current = [...deltaArrayRef.current, diff];
      setMedian(calculateMedian(deltaArrayRef.current));
      setLastDelta(diff);
      startTimeRef.current = null;

      // Increment turns
      if (statsAggregator) {
        statsAggregator.turns++;
      }
    }, [statsAggregator]);

    // Stop timer when bot starts talking
    useVoiceClientEvent(
      VoiceEvent.RemoteAudioLevel,
      useCallback(
        (volume) => {
          if (volume > REMOTE_AUDIO_THRESHOLD && startTimeRef.current) {
            stopTimer();
          }
        },
        [stopTimer]
      )
    );

    useVoiceClientEvent(
      VoiceEvent.BotStoppedTalking,
      useCallback(() => {
        setBotTalkingState(State.SILENT);
      }, [])
    );

    useVoiceClientEvent(
      VoiceEvent.BotStartedTalking,
      useCallback(() => {
        setBotTalkingState(State.SPEAKING);
      }, [])
    );

    useVoiceClientEvent(
      VoiceEvent.LocalStartedTalking,
      useCallback(() => {
        if (!hasSpokenOnce) {
          setHasSpokenOnce(true);
        }
      }, [hasSpokenOnce])
    );

    /* ---- Effects ---- */

    // Reset state on mount
    useEffect(() => {
      startTimeRef.current = null;
      deltaRef.current = 0;
      deltaArrayRef.current = [];
      setVadInstance(null);
      setHasSpokenOnce(false);
    }, []);

    // Start timer after user has spoken once
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
      if (mountedRef.current || !localMediaTrack) {
        return;
      }

      async function loadVad() {
        const stream = new MediaStream([localMediaTrack!]);

        const vad = new VAD({
          workletURL: AudioWorkletURL,
          stream,
          positiveSpeechThreshold: VAD_POSITIVE_SPEECH_THRESHOLD,
          negativeSpeechThreshold: VAD_NEGATIVE_SPEECH_THRESHOLD,
          minSpeechFrames: VAD_MIN_SPEECH_FRAMES,
          redemptionFrames: VAD_REDEMPTION_FRAMES,
          preSpeechPadFrames: VAD_PRESPEECH_PAD_FRAMES,
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

      // Load VAD
      loadVad();

      mountedRef.current = true;
    }, [localMediaTrack]);

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

    const userCx = clsx(
      styles.statusColumn,
      currentState === State.SPEAKING && styles.speaking
    );

    const botCx = clsx(
      styles.statusColumn,
      botTalkingState === State.SPEAKING && styles.speaking
    );

    const userStatusCx = clsx(
      styles.status,
      currentState === State.SPEAKING && styles.statusSpeaking
    );

    const boxStatusCx = clsx(
      styles.status,
      botStatus === "initializing" && styles.statusLoading,
      botStatus === "disconnected" && styles.statusDisconnected,
      botTalkingState === State.SPEAKING && styles.statusSpeaking
    );

    return (
      <>
        <div className={styles.statusContainer}>
          <div className={started ? userCx : styles.statusColumn}>
            <span className={styles.header}>
              User <span>status</span>
            </span>
            <span className={started ? userStatusCx : styles.status}>
              {started && currentState === State.SPEAKING
                ? "Speaking"
                : "Connected"}
            </span>
          </div>
          <div className={styles.latencyColumn}>
            <span className={styles.header}>Latency</span>
            <span className={styles.lastDelta}>
              {lastDelta || "---"}
              <sub>ms</sub>
            </span>
            <span className={styles.medianDelta}>
              avg {median?.toFixed() || "0"}
              <sub>ms</sub>
            </span>
          </div>
          <div className={botCx}>
            <span className={styles.header}>
              Bot <span>status</span>
            </span>
            <span className={boxStatusCx}>
              {botStatus === "disconnected"
                ? "Disconnected"
                : botTalkingState === State.SPEAKING
                ? "Speaking"
                : botStatus}
            </span>
          </div>
        </div>
      </>
    );
  },
  (prevState, nextState) =>
    prevState.started === nextState.started &&
    prevState.botStatus === nextState.botStatus
);

export default Latency;
