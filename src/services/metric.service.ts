import { TimeInterval } from "../models";
import { Moment } from "moment";

export const getIntervalMapped = (date: Moment, interval: TimeInterval) => {
  const intervalMapped = new Map<TimeInterval, string>([
    [TimeInterval.HOUR, date.format('YYYY-MM-DD HH')],
    [TimeInterval.DAY, date.format('YYYY-MM-DD')],
    [TimeInterval.WEEK, date.startOf('week').format('YYYY-MM-DD')],
    [TimeInterval.MONTH, date.format('YYYY-MM')],
  ]);

  return intervalMapped.get(interval) ?? date.format('YYYY-MM-DD');
};