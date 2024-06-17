import { useEffect, useRef, useState } from "react";
import { useAppMessage } from "@daily-co/daily-react";

import styles from "./styles.module.css";

export default function Transcript() {
  const [partialText, setPartialText] = useState<string>("");
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

  useAppMessage({
    onAppMessage: (e) => {
      if (e.fromId && e.fromId === "transcription") {
        // Check for LLM transcripts only
        if (e.data.user_id !== "") {
          setPartialText(e.data.text);
          if (e.data.is_final) {
            setPartialText("");
            setSentences((s) => [...s, e.data.text]);
          }
        }
      }
    },
  });

  return (
    <div className={styles.container}>
      {sentences.map((sentence, index) => (
        <abbr key={index} className={`${styles.transcript} ${styles.sentence}`}>
          <span>{sentence}</span>
        </abbr>
      ))}
      {partialText && (
        <abbr className={`${styles.transcript}`}>
          <span>{partialText}</span>
        </abbr>
      )}
    </div>
  );
}
