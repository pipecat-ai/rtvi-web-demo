import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { DailyProvider } from "@daily-co/daily-react";

import Header from "./components/ui/header.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import App from "./App.tsx";
import Splash from "./Splash.tsx";

import "./global.css"; // Note: Core app layout can be found here

// Show marketing splash page
const showSplashPage = import.meta.env.VITE_SHOW_SPLASH ? true : false;

export const Layout = () => {
  const [showSplash, setShowSplash] = useState<boolean>(showSplashPage);

  if (showSplash) {
    return <Splash handleReady={() => setShowSplash(false)} />;
  }

  return (
    <DailyProvider>
      <TooltipProvider>
        <main>
          <Header />
          <div id="app">
            <App />
          </div>
        </main>
        <aside id="tray" />
      </TooltipProvider>
    </DailyProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);
