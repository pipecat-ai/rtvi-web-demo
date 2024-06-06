import { useState } from "react";
import { useDaily } from "@daily-co/daily-react";

import { Alert } from "./components/alert";
import { Button } from "./components/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { DeviceSelect } from "./components/DeviceSelect";
import Session from "./components/Session";
import { RoomInput } from "./components/RoomInput";
import { SettingList } from "./components/SettingList/SettingList";

type State =
  | "idle"
  | "configuring"
  | "requesting_agent"
  | "connecting"
  | "connected"
  | "started"
  | "finished"
  | "error";

// Server URL (ensure trailing slash)
let serverUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.BASE_URL;
if (!serverUrl.endsWith("/")) serverUrl += "/";

// Query string for room URL
const roomQs = new URLSearchParams(window.location.search).get("room_url");
const checkRoomUrl = (url: string | null): boolean =>
  !!(url && /^(https?:\/\/[^.]+\.daily\.co\/[^/]+)$/.test(url));

export default function App() {
  // Use Daily as our agent transport
  const daily = useDaily();

  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<{ open_mic?: boolean }>({});
  const [roomUrl, setRoomUrl] = useState<string | null>(roomQs || null);
  const [roomError, setRoomError] = useState<boolean>(
    (roomQs && checkRoomUrl(roomQs)) || false
  );

  function handleRoomUrl() {
    if (checkRoomUrl(roomUrl)) {
      setRoomError(false);
      setState("configuring");
    } else {
      setRoomError(true);
    }
  }

  async function start() {
    if (!daily) return;

    setState("requesting_agent");

    // Request a bot to join your session
    let data;

    try {
      const res = await fetch(`${serverUrl}start_bot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_url: roomUrl }),
      });

      data = await res.json();
      setConfig(data.config || {});

      if (!res.ok) {
        setError(data.detail);
        setState("error");
        return;
      }
    } catch (e) {
      setError(
        `Unable to connect to the server at '${serverUrl}' - is it running?`
      );
      setState("error");
      return;
    }

    setState("connecting");

    // Join the daily session, passing through the url and token
    await daily.join({
      url: data.room_url,
      token: data.token,
      videoSource: false,
      startAudioOff: true,
    });

    setState("connected");
  }

  async function leave() {
    await daily?.leave();
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
    return <Session onLeave={() => leave()} openMic={config?.open_mic} />;
  }

  const status_text = {
    configuring: "Start",
    requesting_agent: "Requesting agent...",
    connecting: "Connecting to agent...",
  };

  if (state !== "idle") {
    return (
      <div className="card card-appear">
        <div className="card-inner">
          <div className="card-header">
            <h1>Configure your devices</h1>
            <p> Please configure your microphone and speakers below</p>
          </div>
          <DeviceSelect />
          <div className="card-footer">
            <Button
              key="start"
              onClick={() => start()}
              disabled={state !== "configuring"}
            >
              {state !== "configuring" && <Loader2 className="animate-spin" />}
              {status_text[state as keyof typeof status_text]}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-appear">
      <div className="card-inner">
        <div className="card-header">
          <h1>Pipecat {import.meta.env.VITE_APP_TITLE}</h1>
          <p>Review and configure your bot experience</p>
        </div>

        {import.meta.env.DEV && !import.meta.env.VITE_SERVER_URL && (
          <Alert title="Missing server URL environment" intent="danger">
            <p>
              You have not set a server URL for local development. Please set{" "}
              <samp>VITE_SERVER_URL</samp> in{" "}
              <samp>.env.development.local</samp>.
            </p>
            <p>
              Without this, the client will attempt to start the bot by calling
              localhost on the same port.
            </p>
          </Alert>
        )}
        <SettingList
          serverUrl={serverUrl}
          roomQueryString={roomQs}
          roomQueryStringValid={checkRoomUrl(roomQs)}
        />

        {import.meta.env.VITE_MANUAL_ROOM_ENTRY && !roomQs && (
          <RoomInput onChange={(url) => setRoomUrl(url)} error={roomError} />
        )}
        <div className="card-footer">
          <Button
            key="next"
            disabled={!!(roomQs && !roomError)}
            onClick={() => handleRoomUrl()}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
