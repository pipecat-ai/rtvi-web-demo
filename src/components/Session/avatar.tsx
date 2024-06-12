import { useCallback, useRef } from "react";
import {
  useAudioLevel,
  useAudioTrack,
  useParticipantIds,
} from "@daily-co/daily-react";

export const Avatar: React.FC = () => {
  const remoteParticipantId = useParticipantIds({ filter: "remote" })[0];
  const audioTrack = useAudioTrack(remoteParticipantId);
  const volRef = useRef<HTMLDivElement>(null);

  useAudioLevel(
    audioTrack?.persistentTrack,
    useCallback((volume) => {
      if (!volRef.current) return;
      volRef.current.style.transform = `scale(${Math.max(0.15, volume)})`;
    }, [])
  );

  return (
    <div>
      <div className="vol" ref={volRef} />
      <style>{`
        .vol {
          border: 2px solid black;
          border-radius: 100%;
          height: 64px;
          transition: transform 0.1s ease;
          transform: scale(0.15);
          width: 64px;
        }
      `}</style>
    </div>
  );
};

export default Avatar;
