import React from "react";

import { Button } from "./components/ui/button";

type SplashProps = {
  handleReady: () => void;
};

const Splash: React.FC<SplashProps> = ({ handleReady }) => {
  return (
    <main className="w-full h-full flex items-center justify-center bg-primary-200">
      <div className="flex flex-col gap-8 items-center max-w-xl p-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-pretty">
          Very Fast Voice AI Agents - Demo
        </h1>
        <p>
          A demo showcasing the potential capabilities of voice-driven AI
          chatbots when optimized and deployed to minimize network and model
          latency.
        </p>
        <p>
          Our goal was to demonstrate human-level interaction with an LLM by
          situating the core technologies alongside each other. In
          voice-to-voice interaction, every millisecond counts for fluid
          conversation.
        </p>
        <footer className="flex flex-row gap-2">
          <Button onClick={handleReady}>Try Demo</Button>
          <Button variant="light" asChild>
            <a href="#">Read blog post</a>
          </Button>
        </footer>
      </div>
    </main>
  );
};

export default Splash;
