import React, { useCallback, useEffect } from "react";
import { useDailyEvent } from "@daily-co/daily-react";

import { VAD } from "@/utils/vad";

const Latency: React.FC = () => {
  const vadRef = React.useRef<VAD | null>(null);

  useEffect(() => {
    if (vadRef.current) return;

    console.log("A");

    vadRef.current = new VAD();
  });

  useDailyEvent(
    "track-started",
    useCallback((ev) => {
      if (ev.participant?.local) {
        console.log("LOCAL");
        vadRef.current?.startAudio(ev.track);
      } else {
        console.log("REMOTE");
        vadRef.current?.startAudio(ev.track);
      }
    }, [])
  );

  return <div>Latency</div>;
};

export default Latency;
