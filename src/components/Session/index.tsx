import React, { useCallback, useEffect, useRef, useState } from "react";
//import { createPortal } from "react-dom";
import {
  Participant,
  TransportState,
  VoiceEvent,
} from "@realtime-ai/voice-sdk";
import {
  useVoiceClient,
  useVoiceClientEvent,
} from "@realtime-ai/voice-sdk-react";
import { LineChart, LogOut, Settings } from "lucide-react";

import Configuration from "../Configuration";
//import StatsAggregator from "../../utils/stats_aggregator";
import { Button } from "../ui/button";
import * as Card from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import UserMicBubble from "../UserMicBubble";

import Agent from "./Agent";

//let stats_aggregator: StatsAggregator;

interface SessionProps {
  state: TransportState;
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
}

export const Session = React.memo(
  ({ state, onLeave, startAudioOff = false }: SessionProps) => {
    const voiceClient = useVoiceClient()!;
    const [hasStarted, setHasStarted] = useState(false);
    const [showDevices, setShowDevices] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const [muted, setMuted] = useState(startAudioOff);

    // ---- Events

    // Wait for the bot to join the session, and trigger it to say hello
    useVoiceClientEvent(
      VoiceEvent.ParticipantConnected,
      useCallback(
        (p: Participant) => {
          if (p.local) return;
          // Trigger the bot to say hello
          setTimeout(() => {
            setHasStarted(true);
            voiceClient.appendLLMContext({
              role: "assistant",
              content: "Greet the user",
            });
          }, 2000);
        },
        [voiceClient]
      )
    );

    // ---- Effects

    useEffect(() => {
      // Initialize the voice client
      setHasStarted(false);

      // A bit of a hack, but temporarily muting the mic
      // avoids immediately triggering an interruption on load
      // if the user is talking. We reactive the mic
      // after the session has started.
      //voiceClient.enableMic(false);
    }, [voiceClient, startAudioOff]);

    useEffect(() => {
      // If we joined unmuted, enable the mic once the
      // active speaker event has triggered once
      if (!hasStarted || startAudioOff) return;
      voiceClient.enableMic(true);
    }, [voiceClient, startAudioOff, hasStarted]);

    useEffect(() => {
      // Create new stats aggregator on mount (removes stats from previous session)
      //stats_aggregator = new StatsAggregator();
    }, []);

    useEffect(() => {
      // Leave the meeting if there is an error
      if (state === "error") {
        onLeave();
      }
    }, [state, onLeave]);

    useEffect(() => {
      // Modal effect
      // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
      const current = modalRef.current;

      if (current && showDevices) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showDevices]);

    /*
    useAppMessage({
      onAppMessage: (e) => {
        // Aggregate metrics from pipecat
        if (e.data?.type === "pipecat-metrics") {
          e.data.metrics?.ttfb?.map(
            (m: { processor: string; value: number }) => {
              stats_aggregator.addStat([
                m.processor,
                "ttfb",
                m.value,
                Date.now(),
              ]);
            }
          );
          return;
        }
      },
    });*/

    function toggleMute() {
      voiceClient.enableMic(muted);
      setMuted(!muted);
    }

    return (
      <>
        <dialog ref={modalRef}>
          <Card.Card className="w-svw max-w-full md:max-w-md">
            <Card.CardHeader>
              <Card.CardTitle>Configuration</Card.CardTitle>
            </Card.CardHeader>
            <Card.CardContent>
              <Configuration />
            </Card.CardContent>
            <Card.CardFooter>
              <Button onClick={() => setShowDevices(false)}>Close</Button>
            </Card.CardFooter>
          </Card.Card>
        </dialog>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <Card.Card
            fullWidthMobile={false}
            className="w-full max-w-[320px] sm:max-w-[420px] mt-auto shadow-long"
          >
            <Agent hasStarted={hasStarted} />
          </Card.Card>
          <UserMicBubble
            active={hasStarted}
            muted={muted}
            handleMute={() => toggleMute()}
          />
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
  (p, n) => p.state === n.state
);

export default Session;
