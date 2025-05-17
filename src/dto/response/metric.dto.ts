import { MetricType, DistanceUnit, TemperatureUnit } from '../../models/Metric';

export class MetricResponse {
  id: string;
  userId: string;
  type: MetricType;
  value: number;
  unit: DistanceUnit | TemperatureUnit;
  date: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data._id;
    this.userId = data.userId;
    this.type = data.type;
    this.value = data.value;
    this.unit = data.unit;
    this.date = data.date;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class MetricListResponse {
  metrics: MetricResponse[];
  total: number;
  page: number;
  limit: number;

  constructor(metrics: any[], total: number, page: number, limit: number) {
    this.metrics = metrics.map(metric => new MetricResponse(metric));
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

export class ChartDataResponse {
  labels: string[];
  values: number[];
  unit: DistanceUnit | TemperatureUnit;

  constructor(labels: string[], values: number[], unit: DistanceUnit | TemperatureUnit) {
    this.labels = labels;
    this.values = values;
    this.unit = unit;
  }
} 