import { DistanceUnit, TemperatureUnit } from '../models';

export class UnitConverter {
  private static readonly distanceToMeters = new Map<DistanceUnit, (value: number) => number>([
    [DistanceUnit.METER, (value) => value],
    [DistanceUnit.CENTIMETER, (value) => value / 100],
    [DistanceUnit.INCH, (value) => value * 0.0254],
    [DistanceUnit.FEET, (value) => value * 0.3048],
    [DistanceUnit.YARD, (value) => value * 0.9144]
  ]);

  private static readonly metersToDistance = new Map<DistanceUnit, (meters: number) => number>([
    [DistanceUnit.METER, (meters) => meters],
    [DistanceUnit.CENTIMETER, (meters) => meters * 100],
    [DistanceUnit.INCH, (meters) => meters / 0.0254],
    [DistanceUnit.FEET, (meters) => meters / 0.3048],
    [DistanceUnit.YARD, (meters) => meters / 0.9144]
  ]);

  private static readonly temperatureToCelsius = new Map<TemperatureUnit, (value: number) => number>([
    [TemperatureUnit.CELSIUS, (value) => value],
    [TemperatureUnit.FAHRENHEIT, (value) => (value - 32) * 5/9],
    [TemperatureUnit.KELVIN, (value) => value - 273.15]
  ]);

  private static readonly celsiusToTemperature = new Map<TemperatureUnit, (celsius: number) => number>([
    [TemperatureUnit.CELSIUS, (celsius) => celsius],
    [TemperatureUnit.FAHRENHEIT, (celsius) => (celsius * 9/5) + 32],
    [TemperatureUnit.KELVIN, (celsius) => celsius + 273.15]
  ]);

  static convertDistance(value: number, fromUnit: DistanceUnit, toUnit: DistanceUnit): number {
    const toMeters = this.distanceToMeters.get(fromUnit);
    const fromMeters = this.metersToDistance.get(toUnit);

    if (!toMeters || !fromMeters) {
      throw new Error(`Invalid distance unit conversion: ${fromUnit} to ${toUnit}`);
    }

    const meters = toMeters(value);
    return fromMeters(meters);
  }

  static convertTemperature(value: number, fromUnit: TemperatureUnit, toUnit: TemperatureUnit): number {
    const toCelsius = this.temperatureToCelsius.get(fromUnit);
    const fromCelsius = this.celsiusToTemperature.get(toUnit);

    if (!toCelsius || !fromCelsius) {
      throw new Error(`Invalid temperature unit conversion: ${fromUnit} to ${toUnit}`);
    }

    const celsius = toCelsius(value);
    return fromCelsius(celsius);
  }

  static convert(value: number, fromUnit: DistanceUnit | TemperatureUnit, toUnit: DistanceUnit | TemperatureUnit): number {
    if (Object.values(DistanceUnit).includes(fromUnit as DistanceUnit) && 
        Object.values(DistanceUnit).includes(toUnit as DistanceUnit)) {
      return this.convertDistance(value, fromUnit as DistanceUnit, toUnit as DistanceUnit);
    }
    
    if (Object.values(TemperatureUnit).includes(fromUnit as TemperatureUnit) && 
        Object.values(TemperatureUnit).includes(toUnit as TemperatureUnit)) {
      return this.convertTemperature(value, fromUnit as TemperatureUnit, toUnit as TemperatureUnit);
    }

    throw new Error('Invalid unit conversion');
  }
} 