import mongoose, { Document, Schema } from 'mongoose';

export enum MetricType {
  DISTANCE = 'distance',
  TEMPERATURE = 'temperature',
}

export enum DistanceUnit {
  METER = 'm',
  CENTIMETER = 'cm',
  INCH = 'in',
  FEET = 'ft',
  YARD = 'yd',
}

export enum TemperatureUnit {
  CELSIUS = 'C',
  FAHRENHEIT = 'F',
  KELVIN = 'K',
}

export enum TimeInterval {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export interface IMetric extends Document {
  userId?: mongoose.Types.ObjectId;
  type: MetricType;
  value: number;
  unit: DistanceUnit | TemperatureUnit;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const metricSchema = new Schema<IMetric>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: false
    },
    type: {
      type: String,
      enum: Object.values(MetricType),
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

metricSchema.index({ userId: 1, type: 1, date: -1 });

export const Metric = mongoose.models.Metric || mongoose.model<IMetric>('Metric', metricSchema); 