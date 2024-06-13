import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DailyAudio,
  useActiveSpeakerId,
  useAppMessage,
  useDaily,
  useMeetingState,
} from "@daily-co/daily-react";
import { LineChart, LogOut, Settings } from "lucide-react";

import StatsAggregator from "../../utils/stats_aggregator";
import { Button } from "../button";
import DeviceSelect from "../DeviceSelect";
import Stats from "../Stats";
import UserMicBubble from "../UserMicBubble";

import Agent from "./agent";

import styles from "./styles.module.css";

interface SessionProps {
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
}

const stats_aggregator: StatsAggregator = new StatsAggregator();

export const Session: React.FC<SessionProps> = ({
  onLeave,
  startAudioOff = false,
  openMic = false,
}) => {
  const daily = useDaily();
  const [hasStarted, setHasStarted] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [talkState, setTalkState] = useState<"user" | "assistant" | "open">(
    openMic ? "open" : "assistant"
  );
  const [muted, setMuted] = useState(startAudioOff);
  const activeSpeakerId = useActiveSpeakerId({ ignoreLocal: true });
  const meetingState = useMeetingState();

  function toggleMute() {
    if (!daily) return;

    if (!muted) {
      daily.setLocalAudio(false);
    } else {
      daily.setLocalAudio(true);
    }

    setMuted(!muted);
  }

  useEffect(() => {
    if (meetingState === "error") {
      onLeave();
    }
  }, [meetingState, onLeave]);

  useEffect(() => {
    if (hasStarted || activeSpeakerId === null) {
      return;
    }
    setHasStarted(true);
  }, [hasStarted, activeSpeakerId]);

  useAppMessage({
    onAppMessage: (e) => {
      // Aggregate metrics from pipecat
      if (e.data?.type === "pipecat-metrics") {
        e.data.metrics.ttfb.map((m: { name: string; time: number }) => {
          stats_aggregator.addStat([m.name, "ttfb", m.time, Date.now()]);
        });
        return;
      }

      if (!daily || !e.data?.cue) return;

      // Determine the UI state from the cue sent by the bot
      if (e.data?.cue === "user_turn") {
        // Delay enabling local mic input to avoid feedback from LLM
        setTimeout(() => daily.setLocalAudio(true), 500);
        setTalkState("user");
      } else {
        daily.setLocalAudio(false);
        setTalkState("assistant");
      }
    },
  });

  useEffect(() => {
    const current = modalRef.current;
    // Backdrop doesn't currently work with dialog open, so we use setModal instead
    if (current && showDevices) {
      current.inert = true;
      current.showModal();
      current.inert = false;
    }
    return () => current?.close();
  }, [showDevices]);

  return (
    <>
      <dialog ref={modalRef}>
        <h2>Configure devices</h2>
        <DeviceSelect />
        <Button onClick={() => setShowDevices(false)}>Close</Button>
      </dialog>

      {showStats &&
        createPortal(
          <Stats statsAggregator={stats_aggregator} />,
          document.getElementById("tray")!
        )}

      <div className={styles.agentContainer}>
        <Agent />
        <UserMicBubble
          openMic={openMic}
          active={hasStarted && talkState !== "assistant"}
          muted={muted}
          handleMute={() => toggleMute()}
        />
        <DailyAudio />
      </div>

      <footer className={styles.footer}>
        <div className={styles.controls}>
          <Button
            variant={showStats ? "light" : "ghost"}
            size="icon"
            onClick={() => setShowStats(!showStats)}
          >
            <LineChart />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDevices(true)}
          >
            <Settings />
          </Button>
          <Button onClick={() => onLeave()}>
            <LogOut size={16} />
            End
          </Button>
        </div>
      </footer>
    </>
  );
};

export default Session;
