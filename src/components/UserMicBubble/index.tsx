import React, { useCallback, useRef } from "react";
import {
  useAudioLevel,
  useAudioTrack,
  useLocalSessionId,
} from "@daily-co/daily-react";
import clsx from "clsx";
import { Mic, MicOff, Pause } from "lucide-react";

//import { TypewriterEffect } from "./typewriter";
import styles from "./styles.module.css";

const AudioIndicatorBubble: React.FC = () => {
  const localSessionId = useLocalSessionId();
  const audioTrack = useAudioTrack(localSessionId);
  const volRef = useRef<HTMLDivElement>(null);

  useAudioLevel(
    audioTrack?.persistentTrack,
    useCallback((volume) => {
      // this volume number will be between 0 and 1
      // give it a minimum scale of 0.15 to not completely disappear 👻
      if (volRef.current) {
        const v = volume * 1.75;
        volRef.current.style.transform = `scale(${Math.max(0.1, v)})`;
      }
    }, [])
  );

  // Your audio track's audio volume visualized in a small circle,
  // whose size changes depending on the volume level
  return <div ref={volRef} className={styles.volume} />;
};

interface Props {
  active: boolean;
  openMic: boolean;
  muted: boolean;
  handleMute: () => void;
}

export default function UserMicBubble({
  active,
  //openMic = false,
  muted = false,
  handleMute,
}: Props) {
  //const [transcription, setTranscription] = useState<string[]>([]);

  //@TODO: wait for track started, incase initial transcription is missed
  /*useAppMessage({
    onAppMessage: (e) => {
      if (!muted && e.fromId && e.fromId === "transcription") {
        if (e.data.user_id === "" && e.data.is_final) {
          setTranscription((t) => [...t, ...e.data.text.split(" ")]);
        }
      }
    },
  });*/

  /*useEffect(() => {
    //if (active) return;
    const t = setTimeout(() => setTranscription([]), 4000);
    //return () => clearTimeout(t);
  }, []);*/

  const canTalk = !muted && active;

  /*const cx = muted
    ? styles.muted
    : canTalk
    ? styles.micIconOpen
    : active && styles.micIconActive;*/

  const cx = clsx(
    muted && active && styles.muted,
    !active && styles.blocked,
    canTalk && styles.canTalk
  );

  return (
    <div className={`${styles.bubbleContainer}`}>
      <div className={`${styles.bubble} ${cx}`} onClick={() => handleMute()}>
        <div className={styles.icon}>
          {!active ? (
            <Pause size={42} className="size-8 md:size-10" />
          ) : canTalk ? (
            <Mic size={42} className="size-8 md:size-10" />
          ) : (
            <MicOff size={42} className="size-8 md:size-10" />
          )}
        </div>
        {canTalk && <AudioIndicatorBubble />}
      </div>
      {/*!muted && (
        <footer className={`${styles.transcript} ${active ? "active" : ""}`}>
          <TypewriterEffect words={transcription} />
        </footer>
      )}*/}
    </div>
  );
}
