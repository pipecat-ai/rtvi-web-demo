import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Sparklines,
  SparklinesBars,
  SparklinesLine,
  SparklinesReferenceLine,
} from "react-sparklines";
import { DailyEventObjectAppMessage } from "@daily-co/daily-js";
import { useAppMessage } from "@daily-co/daily-react";

import { Button } from "../button";

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
    const [ping, setPing] = useState<number | null>(null);
    const intervalRef = useRef(0);

    const sendAppMessage = useAppMessage({
      onAppMessage: useCallback((ev: DailyEventObjectAppMessage) => {
        // Aggregate metrics from pipecat
        if (ev.data?.type === "latency-pong-pipeline-delivery") {
          setPing(Date.now() - ev.data.ts);
        }
      }, []),
    });

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

    function sendPingRequest() {
      // Send ping to get latency
      sendAppMessage({ "latency-ping": { ts: Date.now() } }, "*");
    }

    const sumOfServices = Object.values(currentStats).reduce(
      (acc, service) => acc + (service.ttfb.latest || 0),
      0
    );

    // Calculate delta between ping and pong ts in milliseconds

    return (
      <div className={styles.container}>
        <StatsHeader title="Network Stats" />
        <Button onClick={sendPingRequest}>Send Ping</Button>
        {ping} ms
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
