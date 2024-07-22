import { useState } from "react";
import { Ear, Loader2 } from "lucide-react";
import { RateLimitError } from "realtime-ai";
import {
  useVoiceClient,
  useVoiceClientTransportState,
} from "realtime-ai-react";

import Session from "./components/Session";
import { Configure } from "./components/Setup";
import { Alert } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import * as Card from "./components/ui/card";

const status_text = {
  idle: "Start",
  disconnected: "Go again",
  handshaking: "Authenticating...",
  requesting_token: "Requesting token...",
  connecting: "Connecting...",
};

export default function App() {
  const voiceClient = useVoiceClient()!;

  const state = useVoiceClientTransportState();
  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);

  async function start() {
    if (!voiceClient) return;

    // Join the session
    try {
      await voiceClient.start();
    } catch (e) {
      if (e instanceof RateLimitError) {
        setError("Demo is currently at capacity. Please try again later.");
      } else {
        setError(
          "Unable to authenticate. Server may be offline or busy. Please try again later."
        );
      }
      return;
    }
  }

  async function leave() {
    await voiceClient.disconnect();
  }

  if (error) {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  if (state === "connected" || state === "ready") {
    return (
      <Session
        state={state}
        onLeave={() => leave()}
        startAudioOff={startAudioOff}
      />
    );
  }

  const isReady = state === "idle" || state === "disconnected";

  return (
    <Card.Card shadow className="animate-appear max-w-lg">
      <Card.CardHeader>
        <Card.CardTitle>Configure your devices</Card.CardTitle>
        <Card.CardDescription>
          Please configure your microphone and speakers below
        </Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent stack>
        <div className="flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm items-center justify-center rounded-md font-medium text-pretty">
          <Ear className="size-7 md:size-5 text-primary-400" />
          Works best in a quiet environment with a good internet.
        </div>
        <Configure
          startAudioOff={startAudioOff}
          handleStartAudioOff={() => setStartAudioOff(!startAudioOff)}
        />
      </Card.CardContent>
      <Card.CardFooter>
        <Button
          key="start"
          fullWidthMobile
          onClick={() => start()}
          disabled={!isReady}
        >
          {!isReady && <Loader2 className="animate-spin" />}
          {status_text[state as keyof typeof status_text]}
        </Button>
      </Card.CardFooter>
    </Card.Card>
  );
}
