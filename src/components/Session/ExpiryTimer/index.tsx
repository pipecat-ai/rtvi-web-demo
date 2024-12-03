import React, { useCallback, useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { RTVIEvent } from "realtime-ai";
import { useRTVIClient, useRTVIClientEvent } from "realtime-ai-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/tailwind";

import styles from "./styles.module.css";

type TimeState = {
  minutes: number;
  seconds: number;
};

const ExpiryTimer: React.FC = () => {
  const rtviClient = useRTVIClient();
  const [exp, setExp] = useState<number | undefined>(undefined);
  const [time, setTime] = useState<TimeState>({ minutes: 0, seconds: 0 });

  useRTVIClientEvent(
    RTVIEvent.Connected,
    useCallback(() => {
      if (rtviClient) {
        setExp(rtviClient.transportExpiry);
      }
    }, [rtviClient])
  );

  const noExpiry = !exp || exp === 0;

  useEffect(() => {
    if (noExpiry) return;

    const futureTimestamp = exp;

    const updateTime = () => {
      try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const differenceInSeconds = Math.max(
          0,
          futureTimestamp! - currentTimestamp
        );
        const minutes = Math.floor(differenceInSeconds / 60);
        const seconds = differenceInSeconds % 60;
        setTime({ minutes, seconds });
      } catch (error) {
        console.error("Error updating expiry time:", error);
        setTime({ minutes: 0, seconds: 0 });
      }
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(interval);
  }, [noExpiry, exp]);

  if (noExpiry) return null;

  const isExpired = time.minutes <= 0 && time.seconds <= 0;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={styles.expiry}>
          <Timer size={20} />
          <span className={cn(styles.time, isExpired && styles.expired)}>
            {isExpired
              ? "--:--"
              : `${time.minutes}m ${time.seconds.toString().padStart(2, "0")}s`}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Remaining session time before expiry</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ExpiryTimer;
