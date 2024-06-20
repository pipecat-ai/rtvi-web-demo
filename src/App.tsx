import { useState } from "react";
import { useDaily } from "@daily-co/daily-react";
import { ArrowRight, Ear, Loader2 } from "lucide-react";

import Session from "./components/Session";
import { Configure, RoomSetup } from "./components/Setup";
import { Alert } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { fetch_start_agent } from "./actions";

type State =
  | "idle"
  | "configuring"
  | "requesting_agent"
  | "connecting"
  | "connected"
  | "started"
  | "finished"
  | "error";

const status_text = {
  configuring: "Let's go!",
  requesting_agent: "Requesting agent...",
  requesting_token: "Requesting token...",
  connecting: "Connecting to room...",
};

// Server URL (ensure trailing slash)
let serverUrl = import.meta.env.VITE_SERVER_URL;
if (serverUrl && !serverUrl.endsWith("/")) serverUrl += "/";

// Auto room creation (requires server URL)
const autoRoomCreation = import.meta.env.VITE_MANUAL_ROOM_ENTRY ? false : true;

// Query string for room URL
const roomQs = new URLSearchParams(window.location.search).get("room_url");
const checkRoomUrl = (url: string | null): boolean =>
  !!(url && /^(https?:\/\/[^.]+(\.staging)?\.daily\.co\/[^/]+)$/.test(url));

// Show config options
const showConfigOptions = import.meta.env.VITE_SHOW_CONFIG;

// Mic mode
const isOpenMic = import.meta.env.VITE_OPEN_MIC ? true : false;

export default function App() {
  const daily = useDaily();

  const [state, setState] = useState<State>(
    showConfigOptions ? "idle" : "configuring"
  );
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(roomQs || null);
  const [roomError, setRoomError] = useState<boolean>(
    (roomQs && checkRoomUrl(roomQs)) || false
  );

  function handleRoomUrl() {
    if ((autoRoomCreation && serverUrl) || checkRoomUrl(roomUrl)) {
      setRoomError(false);
      setState("configuring");
    } else {
      setRoomError(true);
    }
  }

  async function start() {
    if (!daily || (!roomUrl && !autoRoomCreation)) return;

    let data;

    // Request agent to start, or join room directly
    if (import.meta.env.VITE_SERVER_URL) {
      // Request a new agent to join the room
      setState("requesting_agent");

      try {
        data = await fetch_start_agent(roomUrl, serverUrl);

        if (data.error) {
          setError(data.detail);
          setState("error");
          return;
        }
      } catch (e) {
        setError(`Unable to connect to the bot server at '${serverUrl}'`);
        setState("error");
        return;
      }
    }

    // Join the daily session, passing through the url and token
    setState("connecting");

    try {
      await daily.join({
        url: data?.room_url || roomUrl,
        token: data?.token || "",
        videoSource: false,
        startAudioOff: startAudioOff,
      });
    } catch (e) {
      setError(`Unable to join room: '${data?.room_url || roomUrl}'`);
      setState("error");
      return;
    }
    // Away we go...
    setState("connected");
  }

  async function leave() {
    await daily?.leave();
    await daily?.destroy();
    setState("idle");
  }

  if (state === "error") {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  if (state === "connected") {
    return (
      <Session
        onLeave={() => leave()}
        openMic={isOpenMic}
        startAudioOff={startAudioOff}
      />
    );
  }

  if (state !== "idle") {
    return (
      <Card shadow className="animate-appear max-w-lg">
        <CardHeader>
          <CardTitle>Configure your devices</CardTitle>
          <CardDescription>
            Please configure your microphone and speakers below
          </CardDescription>
        </CardHeader>
        <CardContent stack>
          <div className="flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm items-center justify-center rounded-md font-medium text-pretty">
            <Ear className="size-7 md:size-5 text-primary-400" />
            Works best in a quiet environment with a good internet.
          </div>
          <Configure
            startAudioOff={startAudioOff}
            handleStartAudioOff={() => setStartAudioOff(!startAudioOff)}
          />
        </CardContent>
        <CardFooter>
          <Button
            key="start"
            onClick={() => start()}
            disabled={state !== "configuring"}
          >
            {state !== "configuring" && <Loader2 className="animate-spin" />}
            {status_text[state as keyof typeof status_text]}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card shadow className="animate-appear max-w-lg">
      <CardHeader>
        <CardTitle>Pipecat {import.meta.env.VITE_APP_TITLE}</CardTitle>
        <CardDescription>Check configuration below</CardDescription>
      </CardHeader>
      <CardContent stack>
        <RoomSetup
          serverUrl={serverUrl}
          roomQs={roomQs}
          roomQueryStringValid={checkRoomUrl(roomQs)}
          handleCheckRoomUrl={(url) => setRoomUrl(url)}
          roomError={roomError}
        />
      </CardContent>
      <CardFooter>
        <Button
          fullWidthMobile
          key="next"
          disabled={
            !!((roomQs && !roomError) || (autoRoomCreation && !serverUrl))
          }
          onClick={() => handleRoomUrl()}
        >
          Next <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
