import React, { useEffect, useRef, useState } from "react";

import styles from "./styles.module.css";

interface StatsProps {
  statsAggregator: StatsAggregator;
}

const Stats = React.memo(
  ({ statsAggregator }: StatsProps) => {
    const [currentStats, setCurrentStats] = useState<TransformedStats>(
      statsAggregator.transformStats()
    );
    const intervalRef = useRef(0);

    useEffect(() => {
      intervalRef.current = setInterval(() => {
        setCurrentStats(statsAggregator.transformStats());
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [statsAggregator]);

    useEffect(() => () => clearInterval(intervalRef.current), []); // Cleanup

    return (
      <div className={styles.container}>
        {currentStats &&
          Object.entries(currentStats).map(([service, stat]) => (
            <div key={service} className={styles.serviceStat}>
              <div className={styles.serviceName}>{service}</div>
              <div className={styles.value}>
                {stat.metric}: {stat.value.toFixed(2)}s
              </div>
            </div>
          ))}
      </div>
    );
  },
  () => true
);

export default Stats;
