import { FareRules } from './FareRules';
import { JourneyInput } from '../types/JourneyInput';

/**
 * Journey represents an instance of a single trip.
 * It validates inputs and provides computed properties for fare and zone information.
 */
export class Journey {
  public readonly datetime: Date;
  public readonly fromZone: number;
  public readonly toZone: number;
  private readonly fareRules: FareRules;

  constructor(input: JourneyInput, fareRules?: FareRules) {
    this.validateZone(input.fromZone, 'fromZone');
    this.validateZone(input.toZone, 'toZone');

    this.datetime = this.parseDateTime(input.datetime);
    this.fromZone = input.fromZone;
    this.toZone = input.toZone;
    this.fareRules = fareRules || new FareRules();
  }

  /**
   * Validates that a zone number is a positive integer
   */
  private validateZone(zone: number, fieldName: string): void {
    if (!Number.isInteger(zone) || zone < 1) {
      throw new Error(`${fieldName} must be a positive integer, got: ${zone}`);
    }
  }

  /**
   * Parses and validates the datetime input
   */
  private parseDateTime(datetime: Date | string): Date {
    const parsedDate = datetime instanceof Date ? datetime : new Date(datetime);

    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid datetime provided');
    }

    return parsedDate;
  }

  /**
   * Returns the fare for this journey
   */
  public get fare(): number {
    return this.fareRules.getFare(this.fromZone, this.toZone, this.datetime);
  }
}
