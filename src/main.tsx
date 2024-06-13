import React from "react";
import ReactDOM from "react-dom/client";
import { DailyProvider } from "@daily-co/daily-react";

import Header from "./components/header.tsx";
import App from "./App.tsx";

import "./css/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DailyProvider>
      <div>
        <Header />
        <main>
          <App />
        </main>
      </div>
      <aside id="tray" />
    </DailyProvider>
  </React.StrictMode>
);
