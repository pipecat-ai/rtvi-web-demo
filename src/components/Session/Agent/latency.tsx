import React from "react";
//import { useDailyEvent } from "@daily-co/daily-react";

//import { VAD } from "@/utils/vad";

const Latency: React.FC = () => {
  /*const vadRef = React.useRef<VAD | null>(null);

  useEffect(() => {
    if (vadRef.current) return;
    vadRef.current = new VAD();
  });

  useDailyEvent(
    "track-started",
    useCallback((ev) => {
      vadRef.current?.startAudio(
        ev.participant?.local ? "local" : "remote",
        ev.track
      );
    }, [])
  );

  useDailyEvent(
    "track-stopped",
    useCallback((ev) => {
      vadRef.current?.stopAudio(ev.participant?.local ? "local" : "remote");
    }, [])
  );
*/
  return <div />;
};

export default Latency;
