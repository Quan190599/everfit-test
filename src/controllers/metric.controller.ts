import { Request, Response, NextFunction } from 'express';
import { Metric, DistanceUnit, TemperatureUnit, TimeInterval } from '../models';
import { MetricResponse } from '../dto';
import moment from 'moment';
import { getIntervalMapped, UnitConverter } from '../services';

export const createMetric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, value, unit, date } = req.body;
    const userId = req.user?._id;

    const metric = await Metric.create({
      userId,
      type,
      value,
      unit,
      date: date || new Date(),
    });

    res.status(201).json(new MetricResponse(metric));
  } catch (error) {
    next(error);
  }
};

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type, startDate, endDate, unit: targetUnit } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const metrics = await Metric.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Metric.countDocuments(filter);

    if (targetUnit) {
      metrics.forEach(metric => {
        try {
          const originalValue = metric.value;
          const originalUnit = metric.unit;
          
          if (Object.values(DistanceUnit).includes(originalUnit as DistanceUnit) && 
              Object.values(DistanceUnit).includes(targetUnit as DistanceUnit)) {
            metric.value = UnitConverter.convertDistance(
              originalValue,
              originalUnit as DistanceUnit,
              targetUnit as DistanceUnit
            );
            metric.unit = targetUnit;
          } else if (Object.values(TemperatureUnit).includes(originalUnit as TemperatureUnit) && 
                     Object.values(TemperatureUnit).includes(targetUnit as TemperatureUnit)) {
            metric.value = UnitConverter.convertTemperature(
              originalValue,
              originalUnit as TemperatureUnit,
              targetUnit as TemperatureUnit
            );
            metric.unit = targetUnit;
          }
        } catch (error) {
          console.error('Error converting unit:', error);
        }
      });
    }

    res.json({
      data: metrics,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Error fetching metrics' });
  }
};

export const getChartData = async (req: Request, res: Response) => {
  try {
    const { interval = TimeInterval.DAY, type, startDate, endDate, unit: targetUnit } = req.query;
    const filter: any = { type };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const metrics = await Metric.find(filter).sort({ date: 1 });

    const groupedData = new Map<string, number[]>();
    metrics.forEach(metric => {
      const key = getIntervalMapped(moment(metric.timestamp), interval as TimeInterval);

      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      groupedData.get(key)?.push(metric.value);
    });

    const chartData = Array.from(groupedData.entries()).map(([date, values]) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      let convertedValue = average;
      let unit = metrics[0]?.unit;

      if (targetUnit && metrics.length > 0) {
        try {
          const originalUnit = metrics[0].unit;
          if (Object.values(DistanceUnit).includes(originalUnit as DistanceUnit) && 
              Object.values(DistanceUnit).includes(targetUnit as DistanceUnit)) {
            convertedValue = UnitConverter.convertDistance(
              average,
              originalUnit as DistanceUnit,
              targetUnit as DistanceUnit
            );
            unit = targetUnit;
          } else if (Object.values(TemperatureUnit).includes(originalUnit as TemperatureUnit) && 
                     Object.values(TemperatureUnit).includes(targetUnit as TemperatureUnit)) {
            convertedValue = UnitConverter.convertTemperature(
              average,
              originalUnit as TemperatureUnit,
              targetUnit as TemperatureUnit
            );
            unit = targetUnit;
          }
        } catch (error) {
          console.error('Error converting unit:', error);
        }
      }

      return {
        date,
        value: convertedValue,
        unit
      };
    });

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
}; 