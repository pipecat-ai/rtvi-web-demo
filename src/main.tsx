import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { VoiceClient } from "realtime-ai";
import { VoiceClientAudio, VoiceClientProvider } from "realtime-ai-react";

import { Header } from "./components/ui/header";
import { TooltipProvider } from "./components/ui/tooltip";
import App from "./App";
import { defaultConfig } from "./config";
import { Splash } from "./Splash";

import "./global.css"; // Note: Core app layout can be found here

// Show warning on Firefox
// @ts-expect-error - Firefox is not well support
const isFirefox: boolean = typeof InstallTrigger !== "undefined";

const voiceClient = new VoiceClient({
  baseUrl: import.meta.env.VITE_BASE_URL,
  enableMic: true,
  config: defaultConfig,
});

export const Layout = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

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
        Latency readings can be inaccurate in Firefox. For best results, please
        use Chrome.
      </div>
    )}
    <Layout />
  </React.StrictMode>
);
