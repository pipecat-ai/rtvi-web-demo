type Metric = "ttfb";

type Stat = [string, Metric, number, number];
type TransformedStats = {
  [key: string]: {
    metric: Metric;
    value: number;
    timeseries: number[] | null;
    median: number | null;
    high: number | null;
    low: number | null;
  };
};

interface IStatsAggregator {
  stats: Stat[];

  addStat(stat: Stat): void;
  transformStats(): TransformedStats;
}

declare class StatsAggregator implements IStatsAggregator {
  stats: Stat[];

  constructor();
  addStat(stat: Stat): void;
  transformStats(): TransformedStats;
}
