import React, { useCallback, useEffect, useRef, useState } from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

import styles from "./styles.module.css";

const TranscriptOverlay: React.FC = () => {
  const [sentences, setSentences] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    clearInterval(intervalRef.current!);

    intervalRef.current = setInterval(() => {
      if (sentences.length > 2) {
        setSentences((s) => s.slice(1));
      }
    }, 2500);

    return () => clearInterval(intervalRef.current!);
  }, [sentences]);

  useVoiceClientEvent(
    VoiceEvent.BotTranscript,
    useCallback((transcript) => {
      setSentences((s) => [...s, transcript]);
    }, [])
  );

  return (
    <div className={styles.container}>
      {sentences.map((sentence, index) => (
        <abbr key={index} className={`${styles.transcript} ${styles.sentence}`}>
          <span>{sentence}</span>
        </abbr>
      ))}
    </div>
  );
};

export default TranscriptOverlay;
