import { useCallback, useRef } from "react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

import FaceSVG from "./face.svg";

import styles from "./styles.module.css";

export const Avatar: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useVoiceClientEvent(
    VoiceEvent.RemoteAudioLevel,
    useCallback((volume) => {
      if (!volRef.current) return;
      volRef.current.style.transform = `scale(${Math.max(1, 1 + volume)})`;
    }, [])
  );

  return (
    <>
      <img src={FaceSVG} alt="Face" className={styles.face} />
      <div className={styles.faceBubble} ref={volRef} />
    </>
  );
};

export default Avatar;
