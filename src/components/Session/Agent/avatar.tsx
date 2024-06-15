import { useCallback, useRef } from "react";
import {
  useAudioLevel,
  useAudioTrack,
  useParticipantIds,
} from "@daily-co/daily-react";

import FaceSVG from "./face.svg";

import styles from "./styles.module.css";

export const Avatar: React.FC = () => {
  const remoteParticipantId = useParticipantIds({ filter: "remote" })[0];
  const audioTrack = useAudioTrack(remoteParticipantId);
  const volRef = useRef<HTMLDivElement>(null);

  useAudioLevel(
    audioTrack?.persistentTrack,
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
