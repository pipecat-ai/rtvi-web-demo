type Stat = [string, string, number, number];

interface MetricValue {
  latest: number;
  timeseries: number[];
  median: number | null;
  high: number | null;
  low: number | null;
}

interface Metric {
  [metric: string]: MetricValue;
}

interface StatsMap {
  [service: string]: Metric;
}

interface IStatsAggregator {
  statsMap: StatsMap;
  hasNewStats: boolean;

  addStat(stat: Stat): void;
  getStats(): StatsMap | null;
}

declare class StatsAggregator implements IStatsAggregator {
  statsMap: StatsMap;
  hasNewStats: boolean;

  constructor();
  addStat(stat: Stat): void;
  getStats(): StatsMap | null;
}
