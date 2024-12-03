import React, { useCallback } from "react";
import { RTVIClientConfigOption, RTVIEvent } from "realtime-ai";
import { useRTVIClient, useRTVIClientEvent } from "realtime-ai-react";

import styles from "./styles.module.css";

const ModelBadge: React.FC = () => {
  const rtviClient = useRTVIClient()!;
  const [model, setModel] = React.useState<string | undefined>();

  React.useEffect(() => {
    const getInitialModel = async () => {
      const modelValue = await rtviClient.getServiceOptionValueFromConfig(
        "llm",
        "model"
      );
      setModel(modelValue as string);
    };
    getInitialModel();
  }, [rtviClient]);

  useRTVIClientEvent(
    RTVIEvent.Config,
    useCallback((config: RTVIClientConfigOption[]) => {
      const llmConfig = config.find((c) => c.service === "llm");
      const modelOption = llmConfig?.options.find(
        (opt) => opt.name === "model"
      );
      setModel(modelOption?.value as string);
    }, [])
  );

  return <div className={styles.modelBadge}>{model}</div>;
};

export default ModelBadge;
