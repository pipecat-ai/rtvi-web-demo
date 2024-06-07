type Stats = Stat[];

class StatsAggregator implements IStatsAggregator {
  stats: Stats;

  constructor() {
    this.stats = [];
  }

  addStat(stat: Stat) {
    this.stats.push(stat);
  }

  transformStats(): TransformedStats {
    // Create a mapping unique to each service
    const serviceMap: TransformedStats = this.stats.reduce(
      (acc: TransformedStats, stat: Stat) => {
        acc[stat[0]] = {
          metric: stat[1],
          value: stat[2],
          timeseries: [],
          median: 0,
          high: 0,
          low: 0,
        };
        return acc;
      },
      {} as TransformedStats
    );

    // Sort stats by time
    this.stats.sort((a, b) => a[3] - b[3]);

    // Add the latest value for each service
    this.stats.forEach((stat) => {
      const [service, metric, value] = stat;

      serviceMap[service] = {
        metric,
        value,
        timeseries: [],
        median: 0,
        high: 0,
        low: 0,
      };
    });

    return serviceMap;
  }
}

export default StatsAggregator;
