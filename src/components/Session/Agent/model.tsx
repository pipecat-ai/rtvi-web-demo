import React, { useCallback } from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";

import styles from "./styles.module.css";

const ModelBadge: React.FC = () => {
  const { config } = useVoiceClient()!;
  const [model, setModel] = React.useState<string | undefined>(
    config?.llm?.model
  );

  useVoiceClientEvent(
    VoiceEvent.ConfigUpdated,
    useCallback((e) => {
      setModel(e?.llm?.model);
    }, [])
  );

  return <div className={styles.modelBadge}>{model}</div>;
};

export default ModelBadge;
