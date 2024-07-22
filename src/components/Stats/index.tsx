import React, { useEffect, useRef, useState } from "react";
import {
  Sparklines,
  SparklinesBars,
  SparklinesLine,
  SparklinesReferenceLine,
} from "react-sparklines";
import { X } from "lucide-react";

import { Button } from "../ui/button";
import HelpTip from "../ui/helptip";

import styles from "./styles.module.css";

const StatsHeader: React.FC<{ title: string }> = ({ title }) => {
  return <header className={styles.statsHeader}>{title}</header>;
};

interface StatsProps {
  statsAggregator: StatsAggregator;
  handleClose: () => void;
}

export const Stats = React.memo(
  ({ statsAggregator, handleClose }: StatsProps) => {
    const [currentStats, setCurrentStats] = useState<StatsMap>(
      statsAggregator.statsMap
    );
    //const [ping, setPing] = useState<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    /*
    const sendAppMessage = useAppMessage({
      onAppMessage: useCallback((ev: DailyEventObjectAppMessage) => {
        // Aggregate metrics from pipecat
        if (ev.data?.type === "latency-pong-pipeline-delivery") {
          setPing(Date.now() - ev.data.ts);
        }
      }, []),
    });*/

    useEffect(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current!);
      }

      intervalRef.current = setInterval(async () => {
        // Get latest stats from aggregator
        const newStats = statsAggregator.getStats();
        if (newStats) {
          setCurrentStats({ ...newStats });
        }
      }, 2500);

      return () => clearInterval(intervalRef.current!);
    }, [statsAggregator]);

    const numTurns = statsAggregator.turns;

    /*
    function sendPingRequest() {
      // Send ping to get latency
      sendAppMessage({ "latency-ping": { ts: Date.now() } }, "*");
    }

    const sumOfServices = Object.values(currentStats).reduce(
      (acc, service) => acc + (service.ttfb.latest || 0),
      0
    );*/

    return (
      <div className={styles.container}>
        <div className={styles.close}>
          <Button
            variant="icon"
            size="iconSm"
            onClick={handleClose}
            className="m-3"
          >
            <X />
          </Button>
        </div>
        <div className={styles.inner}>
          <section className={styles.section}>
            <StatsHeader title="Session" />
            <div className={styles.networkStats}>
              <div>
                <h4 className={styles.monoHeader}>Turns</h4>
                <span className="truncate">{numTurns}</span>
              </div>
            </div>
          </section>

          <section className={styles.sectionServices}>
            <StatsHeader title="Services" />
            {currentStats &&
              Object.entries(currentStats).map(([service, data]) => {
                return (
                  <div key={service} className={styles.serviceStat}>
                    <header>
                      <div className={styles.serviceName}>
                        {service} TTFB <HelpTip text="Time to first byte" />
                      </div>
                      <div className={styles.latest}>
                        <span>Latest</span>
                        <span className="font-medium">
                          {data.ttfb?.latest?.toFixed(3)}
                          <sub>s</sub>
                        </span>
                      </div>
                    </header>
                    <div className={styles.chart}>
                      <Sparklines
                        data={data.ttfb?.timeseries}
                        limit={20}
                        height={80}
                        svgHeight={80}
                      >
                        <SparklinesBars
                          style={{ fill: "#41c3f9", fillOpacity: ".25" }}
                        />
                        <SparklinesLine
                          style={{ stroke: "#41c3f9", fill: "none" }}
                        />
                        <SparklinesReferenceLine type="mean" />
                      </Sparklines>
                    </div>
                    <footer>
                      <div className={styles.statValue}>
                        H:
                        <span>
                          {data.ttfb?.high?.toFixed(3)}
                          <sub>s</sub>
                        </span>
                      </div>
                      <div className={styles.statValue}>
                        M:
                        <span>
                          {data.ttfb?.median?.toFixed(3)}
                          <sub>s</sub>
                        </span>
                      </div>
                      <div className={styles.statValue}>
                        L:
                        <span>
                          {data.ttfb?.low?.toFixed(3)}
                          <sub>s</sub>
                        </span>
                      </div>
                    </footer>
                  </div>
                );
              })}
          </section>
        </div>
      </div>
    );
  },
  () => true
);

export default Stats;
