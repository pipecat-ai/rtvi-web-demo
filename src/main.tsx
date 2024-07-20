import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { VoiceClient } from "@realtime-ai/voice-sdk";
import {
  VoiceClientAudio,
  VoiceClientProvider,
} from "@realtime-ai/voice-sdk-react";

import Header from "./components/ui/header.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import App from "./App.tsx";
import Splash from "./Splash.tsx";

import "./global.css"; // Note: Core app layout can be found here

// Show marketing splash page
const showSplashPage = import.meta.env.VITE_SHOW_SPLASH ? true : false;

// Show warning on Firefox
// @ts-expect-error - Firefox is not supported
const isFirefox: boolean = typeof InstallTrigger !== "undefined";

// Voice client (realtime-ai)
const voiceClient = new VoiceClient({
  baseUrl: import.meta.env.VITE_BASE_URL,
  enableMic: true,

  config: {
    llm: {
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant named Gary. Keep responses short and legible.",
        },
      ],
    },
    tts: {
      voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
    },
  },
});

export const Layout = () => {
  const [showSplash, setShowSplash] = useState<boolean>(showSplashPage);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <VoiceClientProvider voiceClient={voiceClient}>
      <TooltipProvider>
        <main>
          <Header />
          <div id="app">
            <App />
          </div>
        </main>
        <aside id="tray" />
        <VoiceClientAudio />
      </TooltipProvider>
    </VoiceClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isFirefox && (
      <div className="bg-red-500 text-white text-sm font-bold text-center p-2 fixed t-0 w-full">
        Clientside voice activity detection temporamental in Firefox. For best
        results, please use Chrome or Edge.
      </div>
    )}
    <Layout />
  </React.StrictMode>
);
