import React from "react";
import { Book, Info, Rocket } from "lucide-react";

import CerebriumLogo from "@/assets/logos/cerebrium.png";
import DailyLogo from "@/assets/logos/daily.png";
import DeepgramLogo from "@/assets/logos/deepgram.png";
import L3Logo from "@/assets/logos/llama3.png";

import { Button } from "./components/ui/button";

type SplashProps = {
  handleReady: () => void;
};

const Splash: React.FC<SplashProps> = ({ handleReady }) => {
  return (
    <main className="w-full h-full flex items-center justify-center bg-primary-200 p-4 bg-[length:auto_50%] lg:bg-auto bg-colorWash bg-no-repeat bg-right-top">
      <div className="flex flex-col gap-8 lg:gap-12 items-center max-w-full lg:max-w-3xl">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance">
          The World&apos;s Fastest Voice Bot Demo
        </h1>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-primary-400">Brought to you by:</span>
          <div className="flex flex-row gap-6 bg-white rounded-full py-4 px-8 items-center">
            <a href="https://www.daily.co/" target="_blank">
              <img src={DailyLogo} alt="Daily.co" className="max-h-[22px]" />
            </a>
            <a href="https://www.cerebrium.ai/" target="_blank">
              <img
                src={CerebriumLogo}
                alt="Daily.co"
                className="max-h-[22px]"
              />
            </a>
            <a href="https://deepgram.com/" target="_blank">
              <img src={DeepgramLogo} alt="Daily.co" className="max-h-[22px]" />
            </a>
            <a href="https://llama.meta.com/llama3/" target="_blank">
              <img src={L3Logo} alt="Daily.co" className="max-h-[22px]" />
            </a>
          </div>
        </div>

        <div className="max-w-full lg:max-w-2xl flex flex-col gap-6">
          <p className="lg:text-lg text-primary-600">
            Speed is important for voice AI interfaces. Humans expect fast
            responses in normal conversation. This demo showcases low-latency
            LLM interaction, aiming to achieve 500ms voice-to-voice response
            times.
          </p>
          <p className="lg:text-lg text-primary-600">
            This bot was built using Pipecat, an open source framework for voice
            and multimodal conversational AI.
          </p>
        </div>

        <Button onClick={handleReady}>Try the demo</Button>

        <div className="h-[1px] bg-primary-300 w-full" />

        <footer className="flex flex-col lg:flex-row lg:gap-2">
          <Button variant="light" asChild>
            <a
              href="https://www.daily.co/blog/the-worlds-fastest-voice-bot/"
              className="text-indigo-600"
            >
              <Info className="size-6" />
              About this demo
            </a>
          </Button>
          <Button variant="light" asChild>
            <a
              href="https://github.com/CerebriumAI/examples/tree/master/18-realtime-voice-agent"
              className="text-indigo-600"
            >
              <Book className="size-6" />
              View source code
            </a>
          </Button>
          <Button variant="light" asChild>
            <a
              href="https://docs.cerebrium.ai/v4/examples/realtime-voice-agents"
              className="text-indigo-600"
            >
              <Rocket className="size-6" />
              Deploy your own
            </a>
          </Button>
        </footer>
      </div>
    </main>
  );
};

export default Splash;
