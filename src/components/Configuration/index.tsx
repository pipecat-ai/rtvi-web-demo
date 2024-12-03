import React from "react";
import { LLMHelper, RTVIClientConfigOption } from "realtime-ai";
import { useRTVIClient } from "realtime-ai-react";

import { Voice } from "@/config";

import ModelSelect from "./ModelSelect";
import VoiceSelect from "./VoiceSelect";

const Configuration: React.FC<{ showAllOptions: boolean }> = ({
  showAllOptions = false,
}) => {
  const rtviClient = useRTVIClient()!;
  const llmHelper = rtviClient.getHelper<LLMHelper>("llm");

  const updateConfig = async (serviceConfig: RTVIClientConfigOption[]) => {
    const shouldInterrupt = rtviClient.state === "ready";
    try {
      await rtviClient.updateConfig(serviceConfig, shouldInterrupt);
    } catch (error) {
      console.error("Error updating config:", error);
    }
  };

  const handleVoiceChange = async (voice: Voice) => {
    await updateConfig([
      {
        service: "tts",
        options: [{ name: "voice", value: voice.id }],
      },
    ]);

    // Prompt the LLM to speak
    await llmHelper?.appendToMessages(
      {
        role: "assistant",
        content: "Ask if the user prefers the new voice you have been given.",
      },
      true
    ); // runImmediately = true
  };

  const handleModelChange = async (model: string) => {
    await updateConfig([
      {
        service: "llm",
        options: [{ name: "model", value: model }],
      },
    ]);

    if (rtviClient.state === "ready") {
      // Instead of separate interrupt call, we'll use the interrupt parameter in appendToMessages
      await llmHelper?.appendToMessages(
        {
          role: "user",
          content: `I just changed your model to use ${model}! Thank me for the change.`,
        },
        true
      ); // runImmediately = true
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <ModelSelect onSelect={(model) => handleModelChange(model)} />
      {showAllOptions && (
        <VoiceSelect onSelect={(voice: Voice) => handleVoiceChange(voice)} />
      )}
    </div>
  );
};

export default Configuration;
