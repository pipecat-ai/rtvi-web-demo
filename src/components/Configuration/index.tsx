import React from "react";
import { useVoiceClient } from "@realtime-ai/voice-sdk-react";

import { composeSystemPrompt, Language } from "@/config";

import LanguageSelect from "./LanguageSelect";

const Configuration: React.FC = () => {
  const voiceClient = useVoiceClient()!;

  const handleLanguageChange = (lang: Language) => {
    voiceClient.updateConfig(
      {
        tts: { voice: lang.voice },
      },
      { sendPartial: true }
    );
    voiceClient.llmContext = {
      messages: [
        {
          role: "system",
          content: composeSystemPrompt(lang.language),
        },
      ],
    };
  };

  return (
    <div>
      <LanguageSelect onSelect={handleLanguageChange} />
    </div>
  );
};

export default Configuration;
