import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsOptional } from "class-validator";
import { DistanceUnit, MetricType, TemperatureUnit, TimeInterval } from "../../models";

export class CreateMetricDto {
  @IsEnum(MetricType)
  @IsNotEmpty()
  type!: string;

  @IsNumber()
  @IsNotEmpty()
  value!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}

export class GetMetricsQueryDto {
  @IsEnum(MetricType)
  @IsOptional()
  type?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsEnum([...Object.values(DistanceUnit), ...Object.values(TemperatureUnit)])
  @IsOptional()
  unit?: string;
}

export class GetChartDataQueryDto {
  @IsEnum(MetricType)
  @IsNotEmpty()
  type!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsEnum(TimeInterval)
  @IsNotEmpty()
  interval!: string;

  @IsEnum([...Object.values(DistanceUnit), ...Object.values(TemperatureUnit)])
  @IsOptional()
  unit?: string;
}
