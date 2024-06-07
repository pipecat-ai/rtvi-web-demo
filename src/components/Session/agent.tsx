import React from "react";
import { useParticipantIds } from "@daily-co/daily-react";
import { Loader2 } from "lucide-react";

import Transcript from "../Transcript";

import Status from "./status";

import styles from "./styles.module.css";

export const Agent: React.FC = () => {
  const participantIds = useParticipantIds({ filter: "remote" });

  const status = participantIds.length > 0 ? "connected" : "connecting";
  return (
    <div className={styles.agent}>
      <div className={styles.agentWindow}>
        {status === "connecting" && (
          <span className={styles.loader}>
            <Loader2 size={32} className="animate-spin" />
          </span>
        )}
        <Transcript />
      </div>
      <footer className={styles.agentFooter}>
        <Status variant="connected">User status</Status>
        <Status variant={status}>Agent status</Status>
      </footer>
    </div>
  );
};

export default Agent;
