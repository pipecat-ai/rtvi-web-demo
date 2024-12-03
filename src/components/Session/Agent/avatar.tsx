import { useCallback, useRef } from "react";
import { RTVIEvent } from "realtime-ai";
import { useRTVIClientEvent } from "realtime-ai-react";

import FaceSVG from "./face.svg";

import styles from "./styles.module.css";

export const Avatar: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useRTVIClientEvent(
    RTVIEvent.RemoteAudioLevel,
    useCallback((volume: number) => {
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
