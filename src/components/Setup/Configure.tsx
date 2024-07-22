import React from "react";

// import { useVoiceClient } from "realtime-ai-react";
//import { composeSystemPrompt, Language } from "@/config";
//import LanguageSelect from "../Configuration/LanguageSelect";
import HelpTip from "../ui/helptip";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

import DeviceSelect from "./DeviceSelect";

interface ConfigureProps {
  startAudioOff: boolean;
  handleStartAudioOff: () => void;
}

export const Configure: React.FC<ConfigureProps> = ({
  startAudioOff,
  handleStartAudioOff,
}) => {
  //const voiceClient = useVoiceClient()!;

  /*
  const handleLanguageChange = (lang: Language) => {
    voiceClient.updateConfig(
      {
        llm: {
          messages: [
            {
              role: "system",
              content: composeSystemPrompt(lang.language),
            },
          ],
        },
        tts: { voice: lang.voice },
      },
      { useDeepMerge: true }
    );
  };*/

  return (
    <>
      <section className="flex flex-col flex-wrap gap-4">
        <DeviceSelect hideMeter={true} />
        {/* <LanguageSelect onSelect={handleLanguageChange} /> */}
      </section>

      <section className="flex flex-col gap-4 border-y border-primary-hairline py-4 mt-4">
        <div className="flex flex-row justify-between items-center">
          <Label className="flex flex-row gap-1 items-center">
            Join with mic muted{" "}
            <HelpTip text="Start with microphone muted (click to unmute)" />
          </Label>
          <Switch
            checked={startAudioOff}
            onCheckedChange={handleStartAudioOff}
          />
        </div>
      </section>
    </>
  );
};
