import React, { useEffect, useRef, useState } from "react";
import {
  Sparklines,
  SparklinesBars,
  SparklinesLine,
  SparklinesReferenceLine,
} from "react-sparklines";

import styles from "./styles.module.css";

const StatsHeader: React.FC<{ title: string }> = ({ title }) => {
  return <header className={styles.statsHeader}>{title}</header>;
};

interface StatsProps {
  statsAggregator: StatsAggregator;
}

const Stats = React.memo(
  ({ statsAggregator }: StatsProps) => {
    const [currentStats, setCurrentStats] = useState<StatsMap>(
      statsAggregator.statsMap
    );
    const intervalRef = useRef(0);

    useEffect(() => {
      intervalRef.current = setInterval(() => {
        const newStats = statsAggregator.getStats();
        if (newStats) {
          setCurrentStats({ ...newStats });
        }
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [statsAggregator]);

    useEffect(() => () => clearInterval(intervalRef.current), []); // Cleanup

    const sumOfServices = Object.values(currentStats).reduce(
      (acc, service) => acc + (service.ttfb.latest || 0),
      0
    );

    return (
      <div className={styles.container}>
        <StatsHeader title="Network Stats" />
        TBC
        <StatsHeader title="Service Stats" />
        Sum: {sumOfServices?.toFixed(3)}s
        {currentStats &&
          Object.entries(currentStats).map(([service, data]) => {
            return (
              <div key={service}>
                <div className={styles.serviceStat}>
                  <div className={styles.serviceName}>{service}</div>
                  <div className={styles.value}>
                    Latest: {data.ttfb?.latest?.toFixed(3)}
                    <br />
                    High: {data.ttfb?.high?.toFixed(3)}
                    <br />
                    Low: {data.ttfb?.low?.toFixed(3)}
                    <br />
                    Median: {data.ttfb?.median?.toFixed(3)}
                    <br />
                  </div>
                </div>
                <div>
                  <Sparklines data={data.ttfb?.timeseries} limit={20}>
                    <SparklinesBars
                      style={{ fill: "#41c3f9", fillOpacity: ".25" }}
                    />
                    <SparklinesLine
                      style={{ stroke: "#41c3f9", fill: "none" }}
                    />
                    <SparklinesReferenceLine type="mean" />
                  </Sparklines>
                </div>
              </div>
            );
          })}
      </div>
    );
  },
  () => true
);

export default Stats;
