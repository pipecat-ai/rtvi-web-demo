import React, { memo, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { VoiceEvent } from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

import Latency from "@/components/Latency";

//import TranscriptOverlay from "../TranscriptOverlay";
import Avatar from "./avatar";
import ModelBadge from "./model";

import styles from "./styles.module.css";

export const Agent: React.FC<{
  isReady: boolean;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ isReady, statsAggregator }) => {
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [botStatus, setBotStatus] = useState<
      "initializing" | "connected" | "disconnected"
    >("initializing");

    useEffect(() => {
      // Update the started state when the transport enters the ready state
      if (!isReady) return;
      setHasStarted(true);
      setBotStatus("connected");
    }, [isReady]);

    useVoiceClientEvent(
      VoiceEvent.BotDisconnected,
      useCallback(() => {
        setHasStarted(false);
        setBotStatus("disconnected");
      }, [])
    );

    // Cleanup
    useEffect(() => () => setHasStarted(false), []);

    const cx = clsx(styles.agentWindow, hasStarted && styles.ready);

    return (
      <div className={styles.agent}>
        <div className={cx}>
          <ModelBadge />
          {!hasStarted ? (
            <span className={styles.loader}>
              <Loader2 size={32} className="animate-spin" />
            </span>
          ) : (
            <Avatar />
          )}
          {/*<TranscriptOverlay />*/}
        </div>
        <footer className={styles.agentFooter}>
          <Latency
            started={hasStarted}
            botStatus={botStatus}
            statsAggregator={statsAggregator}
          />
        </footer>
      </div>
    );
  },
  (p, n) => p.isReady === n.isReady
);

export default Agent;
