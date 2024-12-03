import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { DailyTransport } from "@daily-co/realtime-ai-daily";
import { LLMHelper, RTVIClient, RTVIClientConfigOption } from "realtime-ai";
import { RTVIClientAudio, RTVIClientProvider } from "realtime-ai-react";

import { Header } from "./components/ui/header";
import { TooltipProvider } from "./components/ui/tooltip";
import App from "./App";
import { defaultConfig } from "./config";
import { Splash } from "./Splash";

import "./global.css"; // Note: Core app layout can be found here

// Show warning on Firefox
// @ts-expect-error - Firefox is not well support
const isFirefox: boolean = typeof InstallTrigger !== "undefined";

const rtviClient = new RTVIClient({
  transport: new DailyTransport(),
  params: {
    baseUrl: import.meta.env.VITE_BASE_URL,
    endpoints: {
      connect: "/start-bot",
      action: "/bot-action",
    },
    config: defaultConfig as RTVIClientConfigOption[],
  },
  enableMic: true,
  enableCam: false,
});

const llmHelper = new LLMHelper({
  callbacks: {
    // ...
  },
});

// Register the helper
rtviClient.registerHelper("llm", llmHelper);

export const Layout = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <RTVIClientProvider client={rtviClient}>
      <TooltipProvider>
        <main>
          <Header />
          <div id="app">
            <App />
          </div>
        </main>
        <aside id="tray" />
        <RTVIClientAudio />
      </TooltipProvider>
    </RTVIClientProvider>
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
