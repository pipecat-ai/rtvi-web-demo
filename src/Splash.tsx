import React, { useEffect } from "react";
import { Book, Info } from "lucide-react";
import { VAD } from "web-vad";

import { Button } from "./components/ui/button";

type SplashProps = {
  handleReady: () => void;
};

export const Splash: React.FC<SplashProps> = ({ handleReady }) => {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const cacheVAD = async () => {
      await VAD.precacheModels("silero_vad.onnx");
      setIsReady(true);
    };
    cacheVAD();
  }, []);

  return (
    <main className="w-full h-full flex items-center justify-center bg-primary-200 p-4 bg-[length:auto_50%] lg:bg-auto bg-colorWash bg-no-repeat bg-right-top">
      <div className="flex flex-col gap-8 lg:gap-12 items-center max-w-full lg:max-w-3xl">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance text-left">
          Groq &amp;
          <br />
          Llama 3.1 &amp;
          <br />
          Daily &amp;
          <br />
          RTVI
          <br />
          Voice-to-Voice Demo
        </h1>

        <Button onClick={handleReady} disabled={!isReady}>
          {isReady ? "Try demo" : "Downloading assets..."}
        </Button>

        <div className="h-[1px] bg-primary-300 w-full" />

        <footer className="flex flex-col lg:gap-2">
          <Button variant="light" asChild>
            <a href="https://github.com/rtvi-ai" className="text-indigo-600">
              <Info className="size-6" />
              Learn more about the RTVI standard
            </a>
          </Button>

          <Button variant="light" asChild>
            <a
              href="https://github.com/rtvi-ai/rtvi-web-demo"
              className="text-indigo-600"
            >
              <Book className="size-6" />
              Demo source code
            </a>
          </Button>
        </footer>
      </div>
    </main>
  );
};

export default Splash;
