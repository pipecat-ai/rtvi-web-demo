import React, { useEffect, useState } from "react";
import { useRoom } from "@daily-co/daily-react";

import styles from "./styles.module.css";

const ExpiryTimer: React.FC = () => {
  const room = useRoom();
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });

  const noExpiry = !room || !room.config.exp || room.config.exp === 0;

  useEffect(() => {
    if (noExpiry) return;

    const futureTimestamp = room.config.exp;

    // Function to update time
    const updateTime = () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const differenceInSeconds = futureTimestamp! - currentTimestamp;
      const minutes = Math.floor(differenceInSeconds / 60);
      const seconds = differenceInSeconds % 60;
      setTime({ minutes, seconds });
    };

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    // Initial update
    updateTime();

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [noExpiry, room]); // Dependency array includes room to re-run effect if room changes

  if (noExpiry) return null;

  const isExpired = time.minutes <= 0 && time.seconds <= 0;

  return (
    <div className={styles.expiry}>
      {isExpired ? (
        <>Session expired</>
      ) : (
        <>
          <span className={styles.header}>Time remaining</span>
          <span className={styles.time}>
            {time.minutes}m {time.seconds.toString().padStart(2, "0")}s
          </span>
        </>
      )}
    </div>
  );
};

export default ExpiryTimer;
