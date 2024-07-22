import React from "react";
import { useVoiceClient } from "realtime-ai-react";

import { Voice } from "@/config";

import LanguageSelect from "./LanguageSelect";
import ModelSelect from "./ModelSelect";

const Configuration: React.FC = () => {
  const voiceClient = useVoiceClient()!;

  const handleLanguageChange = (voice: Voice) => {
    voiceClient.updateConfig(
      {
        tts: { voice: voice.id },
      },
      { sendPartial: true }
    );
    voiceClient.appendLLMContext({
      role: "assistant",
      content: "Ask if the user prefers the new voice you have been given.",
    });
  };

  const handleModelChange = (model: string) => {
    voiceClient.updateConfig(
      {
        llm: { model: model },
      },
      { sendPartial: true }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <ModelSelect onSelect={(model) => handleModelChange(model)} />
      <LanguageSelect
        onSelect={(voice: Voice) => handleLanguageChange(voice)}
      />
    </div>
  );
};

export default Configuration;
