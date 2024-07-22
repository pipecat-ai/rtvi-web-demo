import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";

import { VAD, VADState } from "@/vad";
import AudioWorkletURL from "@/vad/worklet.ts?worker&url";

import { calculateMedian } from "./utils";

import styles from "./styles.module.css";

enum State {
  SPEAKING = "Speaking",
  SILENT = "Silent",
}

const REMOTE_AUDIO_THRESHOLD = 0.1;
const LATENCY_MIN = 100;

const Latency: React.FC<{
  started: boolean;
  botStatus: string;
  //statsAggregator: StatsAggregator;
}> = memo(
  ({ started = false, botStatus }) => {
    //statsAggregator
    const voiceClient = useVoiceClient()!;
    const { local } = voiceClient.tracks();
    const localAudioTrack = local.audio;

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
      if (diff < LATENCY_MIN) {
        return;
      }

      deltaArrayRef.current = [...deltaArrayRef.current, diff];
      setMedian(calculateMedian(deltaArrayRef.current));
      setLastDelta(diff);
      startTimeRef.current = null;

      // Increment turns
      /*if (statsAggregator) {
        statsAggregator.turns++;
      }*/
    }, []);

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

      async function loadVad() {
        const stream = new MediaStream([localAudioTrack]);

        const vad = new VAD({
          workletURL: AudioWorkletURL,
          stream,
          positiveSpeechThreshold: 0.8,
          negativeSpeechThreshold: 0.8 - 0.15,
          minSpeechFrames: 8,
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
      botStatus === "loading" && styles.statusLoading,
      botStatus === "connecting" && styles.statusConnecting,
      botStatus === "disconnected" && styles.statusDisconnected,
      botTalkingState === State.SPEAKING && styles.statusSpeaking
    );

    return (
      <>
        <div className={styles.statusContainer}>
          <div className={userCx}>
            <span className={styles.header}>
              User <span>status</span>
            </span>
            <span className={userStatusCx}>
              {currentState === State.SPEAKING ? "Speaking" : "Connected"}
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
                : "Connecting"}
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
