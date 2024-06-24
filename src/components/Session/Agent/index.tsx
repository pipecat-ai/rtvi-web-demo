import React, { memo, useEffect, useState } from "react";
import { useActiveSpeakerId, useParticipantIds } from "@daily-co/daily-react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

import Latency from "@/components/Latency";
import Transcript from "@/components/Transcript";

import Avatar from "./avatar";

import styles from "./styles.module.css";

type AgentState = "connecting" | "loading" | "connected";

export const Agent: React.FC<{
  hasStarted: boolean;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ hasStarted = false, statsAggregator }) => {
    const participantIds = useParticipantIds({ filter: "remote" });
    const activeSpeakerId = useActiveSpeakerId({ ignoreLocal: true });
    const [agentState, setAgentState] = useState<AgentState>("connecting");

    useEffect(() => {
      if (participantIds.length > 0) {
        setAgentState("connected");
      } else {
        setAgentState("connecting");
      }
    }, [activeSpeakerId, participantIds.length]);

    // Cleanup
    useEffect(() => () => setAgentState("connecting"), []);

    const cx = clsx(
      styles.agentWindow,
      agentState === "connected" && styles.connected
    );

    return (
      <div className={styles.agent}>
        <div className={cx}>
          {agentState === "connecting" ? (
            <span className={styles.loader}>
              <Loader2 size={32} className="animate-spin" />
            </span>
          ) : (
            <Avatar />
          )}
          <Transcript />
        </div>
        <footer className={styles.agentFooter}>
          <Latency
            started={agentState === "connected" && hasStarted}
            botStatus={agentState}
            statsAggregator={statsAggregator}
          />
        </footer>
      </div>
    );
  },
  (p, n) => p.hasStarted === n.hasStarted
);

export default Agent;
