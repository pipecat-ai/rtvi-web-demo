import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LineChart, LogOut, Settings, StopCircle, ListChecks } from "lucide-react";

import { TransportState, VoiceEvent } from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";

import StatsAggregator from "../../utils/stats_aggregator";
import Configuration from "../Configuration";
import Stats from "../Stats";
import { Button } from "../ui/button";
import * as Card from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import UserMicBubble from "../UserMicBubble";

import Agent from "./Agent";
import Checklist from "../Checklist";

let stats_aggregator: StatsAggregator;

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
    const [muted, setMuted] = useState(startAudioOff);
    const [checklist, setChecklist] = useState([
      { title: "Verify identity", completed: false, notes: "" },
      { title: "List prescriptions", completed: false, notes: "" },
      { title: "List allergies", completed: false, notes: "" },
      { title: "List medical conditions", completed: false, notes: "" },
      { title: "List reasons for visit", completed: false, notes: "" },
    ]);
    const [showChecklist, setShowChecklist] = useState(true);
    const modalRef = useRef<HTMLDialogElement>(null);

    // ---- Voice Client Events

    // Wait for the bot to enter a ready state and trigger it to say hello
    useVoiceClientEvent(
      VoiceEvent.BotReady,
      useCallback(() => {
        setHasStarted(true);
        voiceClient.appendLLMContext({
          role: "system",
          content:
            'You are Jamie, an agent for a company called Tri-County Health Services. Your job is to collect important information from me before my doctor visit. My name is Chad Bailey. You should address me by my first name and be polite, friendly, and charming. You\'re not a medical professional, so you shouldn\'t provide any advice. I\'m busy, so keep your responses very short. If you can answer in only one or two words, do that. Your job is to collect information to give to a doctor. Don\'t make assumptions about what values to plug into functions. Ask for clarification if my response is ambiguous or if I forget any required parameters. Here is a list of functions in JSON format that you can invoke: { "type": "function", "function": { "name": "verify_birthday", "description": "Use this function to verify the user has provided their correct birthday.", "parameters": { "type": "object", "properties": { "birthday": { "type": "string", "description": "The user\'s birthdate, including the year. The user can provide it in any format, but convert it to YYYY-MM-DD format to call this function.", }}, }, }, }, If you decide to use a function, wrap your entire response in a JSON object, with the name of the function in the "function_name" property, and the parameters in a "parameters" property. DO NOT include any other text in a function call response. Start by introducing yourself. Then, ask me to confirm my identity by telling you my birthday, including the year. When I answer with my birthday, call the verify_birthday function.',
        });
      }, [voiceClient])
    );

    useVoiceClientEvent(
      VoiceEvent.Metrics,
      useCallback((metrics) => {
        metrics?.ttfb?.map((m: { processor: string; value: number }) => {
          stats_aggregator.addStat([m.processor, "ttfb", m.value, Date.now()]);
        });
      }, [])
    );

    useVoiceClientEvent(
      VoiceEvent.JSONCompletion,
      useCallback(
        (jsonString: string) => {
          console.log("json string received:", jsonString);
          const fnData = JSON.parse(jsonString.data);

          if (fnData && fnData.function_name) {
            const args = fnData.parameters;
            let notes: string, newChecklist: any;

            switch (fnData.function_name) {
              case "verify_birthday":
                if (args["birthday"] == "1983-01-01") {
                  const newChecklist = checklist.map((item, i) => {
                    if (i == 0) {
                      return {
                        title: item.title,
                        completed: true,
                        notes: "January 1, 1983",
                      };
                    } else {
                      return item;
                    }
                  });
                  setChecklist(newChecklist);
                  console.log("checklist set");
                  voiceClient.appendLLMContext([
                    { role: "user", content: '{"identity": "confirmed"}' },
                    {
                      role: "user",
                      content:
                        'Here is another function you can invoke: { "type": "function", "function": { "name": "list_prescriptions", "description": "Once the user has provided a list of their prescription medications, call this function.", "parameters": { "type": "object", "properties": { "prescriptions": { "type": "array", "items": { "type": "object", "properties": { "medication": { "type": "string", "description": "The medication\'s name", }, "dosage": { "type": "string", "description": "The prescription\'s dosage", }, }, }, }}, }, }, } ask me to list my prescriptions. Make sure I include dosage information for each medicine. When I\'ve answered completely, call the list_prescriptions function.',
                    },
                  ]);
                } else {
                  voiceClient.appendLLMContext([
                    { role: "user", content: '{"birthday": "incorrect"}' },
                    {
                      role: "user",
                      content: "Ask me to try again.",
                    },
                  ]);
                }
                break;
              case "list_prescriptions":
                const rx = args["prescriptions"].map(
                  (p) => `${p["medication"]}, ${p["dosage"]}`
                );
                notes = rx.join("<br />");
                newChecklist = checklist.map((item, i) => {
                  if (i == 1) {
                    return {
                      title: item.title,
                      completed: true,
                      notes,
                    };
                  } else {
                    return item;
                  }
                });
                setChecklist(newChecklist);
                voiceClient.appendLLMContext([
                  { role: "user", content: '{"prescriptions": "saved"}' },
                  {
                    role: "user",
                    content:
                      'Here is another function you can use: { "type": "function", "function": { "name": "list_allergies", "description": "Once the user has provided a list of their allergies, call this function.", "parameters": { "type": "object", "properties": { "allergies": { "type": "array", "items": { "type": "object", "properties": { "name": { "type": "string", "description": "What the user is allergic to", }}, }, }}, }, }, } Now, ask me to list any allergies I have. You don\'t need to address me by name for the rest of the conversation. When I\'ve listed my allergies, call the list_allergies function.',
                  },
                ]);
                break;
              case "list_allergies":
                notes = args["allergies"].map((a) => a["name"]).join(", ");
                newChecklist = checklist.map((item, i) => {
                  if (i == 2) {
                    return {
                      title: item.title,
                      completed: true,
                      notes,
                    };
                  } else {
                    return item;
                  }
                });
                setChecklist(newChecklist);
                voiceClient.appendLLMContext([
                  { role: "user", content: '{"allergies": "saved"}' },
                  {
                    role: "user",
                    content:
                      'Here is another function you can use: { "type": "function", "function": { "name": "list_conditions", "description": "Once the user has provided a list of their medical conditions, call this function.", "parameters": { "type": "object", "properties": { "conditions": { "type": "array", "items": { "type": "object", "properties": { "name": { "type": "string", "description": "The user\'s medical condition", }}, }, }}, }, }, } Now, ask me if I have any existing medical conditions the doctor should know about. Once I\'ve listed them, call the list_conditions function.',
                  },
                ]);
                break;
              case "list_conditions":
                notes = args["conditions"].map((a) => a["name"]).join(", ");
                newChecklist = checklist.map((item, i) => {
                  if (i == 3) {
                    return {
                      title: item.title,
                      completed: true,
                      notes,
                    };
                  } else {
                    return item;
                  }
                });
                setChecklist(newChecklist);
                voiceClient.appendLLMContext([
                  { role: "user", content: '{"medical_conditions": "saved"}' },
                  {
                    role: "user",
                    content:
                      'Here is another function you can use: { "type": "function", "function": { "name": "list_visit_reasons", "description": "Once the user has provided a list of the reasons they are visiting a doctor today, call this function.", "parameters": { "type": "object", "properties": { "visit_reasons": { "type": "array", "items": { "type": "object", "properties": { "name": { "type": "string", "description": "The user\'s reason for visiting the doctor", }}, }, }}, }, }, } Now, ask me the reason for visiting the doctor today. Once I\'ve answered, call the list_visit_reasons function.',
                  },
                ]);
                break;
              case "list_visit_reasons":
                notes = args["visit_reasons"].map((a) => a["name"]).join(", ");
                newChecklist = checklist.map((item, i) => {
                  if (i == 4) {
                    return {
                      title: item.title,
                      completed: true,
                      notes,
                    };
                  } else {
                    return item;
                  }
                });
                setChecklist(newChecklist);
                voiceClient.appendLLMContext([
                  { role: "user", content: '{"visit_reasons": "saved"}' },
                  {
                    role: "user",
                    content: "Now thank me and end the call.",
                  },
                ]);
                break;
            }
          }
        },
        [checklist]
      )
    );

    // ---- Effects

    useEffect(() => {
      // Reset started state on mount
      setHasStarted(false);
    }, []);

    useEffect(() => {
      // If we joined unmuted, enable the mic once the
      // active speaker event has triggered once
      if (!hasStarted || startAudioOff) return;
      voiceClient.enableMic(true);
    }, [voiceClient, startAudioOff, hasStarted]);

    useEffect(() => {
      // Create new stats aggregator on mount (removes stats from previous session)
      stats_aggregator = new StatsAggregator();
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
              <Configuration showAllOptions={true} />
            </Card.CardContent>
            <Card.CardFooter>
              <Button onClick={() => setShowDevices(false)}>Close</Button>
            </Card.CardFooter>
          </Card.Card>
        </dialog>

        {showStats &&
          createPortal(
            <Stats
              statsAggregator={stats_aggregator}
              handleClose={() => setShowStats(false)}
            />,
            document.getElementById("right-tray")!
          )}
        {showChecklist &&
          createPortal(
            <Checklist
              checklist={checklist}
              handleClose={() => setShowChecklist(false)}
            />,
            document.getElementById("left-tray")!
          )}

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <Card.Card
            fullWidthMobile={false}
            className="w-full max-w-[320px] sm:max-w-[420px] mt-auto shadow-long"
          >
            <Agent
              isReady={state === "ready"}
              statsAggregator={stats_aggregator}
            />
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
              <TooltipContent>Show patient intake checklist</TooltipContent>
              <TooltipTrigger asChild>
                <Button
                  variant={showChecklist ? "light" : "ghost"}
                  size="icon"
                  onClick={() => setShowChecklist(!showChecklist)}
                >
                  <ListChecks />
                </Button>
              </TooltipTrigger>
            </Tooltip>
            <Tooltip>
              <TooltipContent>Interrupt bot</TooltipContent>
              <TooltipTrigger asChild>
                <Button
                  variant={showStats ? "light" : "ghost"}
                  size="icon"
                  onClick={() => voiceClient.interrupt()}
                >
                  <StopCircle />
                </Button>
              </TooltipTrigger>
            </Tooltip>
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
              <TooltipContent>Configure</TooltipContent>
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
