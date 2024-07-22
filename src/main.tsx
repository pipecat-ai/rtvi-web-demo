import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { VoiceClient } from "realtime-ai";
import { VoiceClientAudio, VoiceClientProvider } from "realtime-ai-react";

import Header from "./components/ui/header";
import { TooltipProvider } from "./components/ui/tooltip";
import App from "./App";
import { defaultConfig } from "./config";
import Splash from "./Splash";

import "./global.css"; // Note: Core app layout can be found here

// Show marketing splash page
const showSplashPage = import.meta.env.VITE_SHOW_SPLASH ? true : false;

// Show warning on Firefox
// @ts-expect-error - Firefox is not supported
const isFirefox: boolean = typeof InstallTrigger !== "undefined";

export const Layout = () => {
  const [showSplash, setShowSplash] = useState<boolean>(showSplashPage);
  const voiceClientRef = useRef<VoiceClient | null>(null);

  const startDemo = () => {
    // We create the client in an effect to prevent audio context errors
    // from showing before we get user intent. This is because the VoiceClient
    // will attempt to retrieve local devices on creation.
    voiceClientRef.current = new VoiceClient({
      baseUrl: import.meta.env.VITE_BASE_URL,
      enableMic: true,
      config: defaultConfig,
    });

    setShowSplash(false);
  };

  if (showSplash) {
    return <Splash handleReady={() => startDemo()} />;
  }

  return (
    <VoiceClientProvider voiceClient={voiceClientRef.current!}>
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
