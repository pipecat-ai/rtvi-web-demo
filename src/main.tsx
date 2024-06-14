import React from "react";
import ReactDOM from "react-dom/client";
import { DailyProvider } from "@daily-co/daily-react";

import Header from "./components/ui/header.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import App from "./App.tsx";

import "./global.css"; // Note: Core app layout can be found here

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
