import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DailyAudio,
  useAppMessage,
  useDaily,
  useDailyEvent,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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
    const [hasStarted, setHasStarted] = useState(openMic);
    const [showDevices, setShowDevices] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    /*const [talkState, setTalkState] = useState<"user" | "assistant" | "open">(
      openMic ? "open" : "assistant"
    );*/
    const [muted, setMuted] = useState(startAudioOff);
    const meetingState = useMeetingState();

    // Use active speaker event to trigger the "ready" state
    // so the user can begin talking to the LLM
    // Note: this "air" also avoids a scenario where we immediately
    // trigger interruption on load, causing the LLM to appear silent
    useDailyEvent(
      "active-speaker-change",
      useCallback(() => {
        if (hasStarted) {
          return;
        }
        setHasStarted(true);
      }, [hasStarted])
    );

    // Mute on join
    useEffect(() => {
      // Avoid immediately triggering interruption on load
      // by muting the users mic initially
      if (daily) {
        daily.setLocalAudio(false);
      }
    }, [daily, startAudioOff]);

    // If we joined unmuted, enable the mic once the
    // active speaker event has triggered once
    useEffect(() => {
      if (!daily || startAudioOff) {
        return;
      }
      if (hasStarted) {
        daily.setLocalAudio(true);
      }
    }, [daily, startAudioOff, hasStarted]);

    // Leave the meeting if there is an error
    useEffect(() => {
      if (meetingState === "error") {
        onLeave();
      }
    }, [meetingState, onLeave]);

    // Reset on unmount
    useEffect(
      () => () => {
        setHasStarted(false);
      },
      []
    );

    // Modal effect
    // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
    useEffect(() => {
      const current = modalRef.current;

      if (current && showDevices) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showDevices]);

    useAppMessage({
      onAppMessage: (e) => {
        // Aggregate metrics from pipecat
        if (e.data?.type === "pipecat-metrics") {
          e.data.metrics.ttfb.map((m: { name: string; time: number }) => {
            stats_aggregator.addStat([m.name, "ttfb", m.time, Date.now()]);
          });
          return;
        }

        /*
        Open mic handler (disabled for now)
        if (!daily || !e.data?.cue) return;

        // Determine the UI state from the cue sent by the bot
        if (e.data?.cue === "user_turn") {
          // Delay enabling local mic input to avoid feedback from LLM
          setTimeout(() => daily.setLocalAudio(true), 500);
          setTalkState("user");
        } else {
          daily.setLocalAudio(false);
          setTalkState("assistant");
        }*/
      },
    });

    function toggleMute() {
      if (!daily) return;
      daily.setLocalAudio(muted);
      setMuted(!muted);
    }

    return (
      <>
        <dialog ref={modalRef}>
          <Card className="w-svw max-w-full md:max-w-md">
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
            <Stats
              statsAggregator={stats_aggregator}
              handleClose={() => setShowStats(false)}
            />,
            document.getElementById("tray")!
          )}

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <Card
            fullWidthMobile={false}
            className="w-full max-w-[320px] sm:max-w-[420px] mt-auto shadow-long"
          >
            <Agent hasStarted={hasStarted} statsAggregator={stats_aggregator} />
          </Card>

          <UserMicBubble
            openMic={openMic}
            active={hasStarted} //Open mic: && talkState !== "assistant"}
            muted={muted}
            handleMute={() => toggleMute()}
          />
          <DailyAudio />
        </div>

        <footer className="w-full flex flex-row mt-auto self-end md:w-auto">
          <div className="flex flex-row justify-between gap-3 w-full md:w-auto">
            <Tooltip>
              <TooltipContent>Show bot statistics panel</TooltipContent>
              <TooltipTrigger asChild>
                <Button
                  variant={showStats ? "light" : "ghost"}
                  size="icon"
                  onClick={() => setShowStats(!showStats)}
                >
                  <LineChart />
                </Button>
              </TooltipTrigger>
            </Tooltip>
            <Tooltip>
              <TooltipContent>Configure devices</TooltipContent>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDevices(true)}
                >
                  <Settings />
                </Button>
              </TooltipTrigger>
            </Tooltip>
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
