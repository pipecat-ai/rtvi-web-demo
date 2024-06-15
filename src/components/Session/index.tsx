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
import { DeviceSelect } from "../Setup";
import Stats from "../Stats";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import UserMicBubble from "../UserMicBubble";

import Agent from "./Agent";

const stats_aggregator: StatsAggregator = new StatsAggregator();

interface SessionProps {
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
}

export const Session = React.memo(
  ({ onLeave, startAudioOff = false, openMic = false }: SessionProps) => {
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

    useEffect(() => {
      // Mute on join (typically done with token params, but we'll do it here to be sure)
      if (daily && startAudioOff) {
        daily.setLocalAudio(false);
      }
    }, [daily, startAudioOff]);

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

    function toggleMute() {
      if (!daily) return;
      daily.setLocalAudio(muted);
      setMuted(!muted);
    }

    return (
      <>
        <dialog ref={modalRef}>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Change devices</CardTitle>
            </CardHeader>
            <CardContent>
              <DeviceSelect hideMeter={true} />
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShowDevices(false)}>Close</Button>
            </CardFooter>
          </Card>
        </dialog>

        {showStats &&
          createPortal(
            <Stats statsAggregator={stats_aggregator} />,
            document.getElementById("tray")!
          )}

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <Card
            fullWidthMobile={false}
            className="w-full max-w-[320px] sm:max-w-[420px] mt-auto"
          >
            <Agent />
          </Card>

          <UserMicBubble
            openMic={openMic}
            active={hasStarted && talkState !== "assistant"}
            muted={muted}
            handleMute={() => toggleMute()}
          />
          <DailyAudio />
        </div>

        <footer className="w-full flex flex-row mt-auto self-end md:w-auto">
          <div className="flex flex-row justify-between gap-3 w-full md:w-auto">
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
            <Button onClick={() => onLeave()} className="ml-auto">
              <LogOut size={16} />
              End
            </Button>
          </div>
        </footer>
      </>
    );
  },
  () => true
);

export default Session;
