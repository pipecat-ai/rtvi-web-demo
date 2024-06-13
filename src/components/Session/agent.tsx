import React, { useEffect, useState } from "react";
import { useActiveSpeakerId, useParticipantIds } from "@daily-co/daily-react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

import Transcript from "../Transcript";

import Avatar from "./avatar";
import Status from "./status";

import styles from "./styles.module.css";

type AgentState = "connecting" | "loading" | "connected";

export const Agent: React.FC = () => {
  const participantIds = useParticipantIds({ filter: "remote" });
  const activeSpeakerId = useActiveSpeakerId({ ignoreLocal: true });
  const [agentState, setAgentState] = useState<AgentState>("connecting");

  useEffect(() => {
    if (participantIds.length > 0) {
      //@TODO: Set as "loading state" and listen for first audio received before triggering connected state
      // activeSpeakerID seems a little slow, so need to experiment with options here
      setAgentState("connected");
    }
  }, [activeSpeakerId, participantIds.length]);

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
        <Status variant="connected">User status</Status>
        <Status variant={agentState}>Agent status</Status>
      </footer>
    </div>
  );
};

export default Agent;
