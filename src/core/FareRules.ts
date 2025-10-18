import { PeakHours, PeakRange, FareTables, CapTables } from '../types/FareTypes';
import { isWeekend, isTimeInRange } from '../utils/date';

/**
 * FareRules encapsulates all fare pricing, peak hour logic, and fare cap rules.
 * This class follows the Single Responsibility Principle by focusing solely on
 * fare rule definitions and lookups.
 */
export class FareRules {
  private static readonly PEAK_HOURS: PeakHours = {
    weekdays: [
      { start: '07:00', end: '10:30' },
      { start: '17:00', end: '20:00' },
    ],
    weekends: [
      { start: '09:00', end: '11:00' },
      { start: '18:00', end: '22:00' },
    ],
  };

  private static readonly FARES: FareTables = {
    '1-1': { peak: 30, off_peak: 25 },
    '1-2': { peak: 35, off_peak: 30 },
    '2-1': { peak: 35, off_peak: 30 },
    '2-2': { peak: 25, off_peak: 20 },
  };

  private static readonly CAPS: CapTables = {
    daily: {
      '1-1': 100,
      '1-2': 120,
      '2-1': 120,
      '2-2': 80,
    },
    weekly: {
      '1-1': 500,
      '1-2': 600,
      '2-1': 600,
      '2-2': 400,
    },
  };

  /**
   * Determines if a given datetime falls within peak hours (UTC)
   */
  public isPeak(datetime: Date | string): boolean {
    const peakRanges = this.getPeakRangesForDate(datetime);
    return this.isTimeInAnyRange(datetime, peakRanges);
  }

  /**
   * Helper method to get the appropriate peak ranges based on date
   */
  private getPeakRangesForDate(datetime: Date | string): PeakRange[] {
    return isWeekend(datetime) ? FareRules.PEAK_HOURS.weekends : FareRules.PEAK_HOURS.weekdays;
  }

  /**
   * Checks if a time falls within any of the provided time ranges
   */
  private isTimeInAnyRange(datetime: Date | string, ranges: PeakRange[]): boolean {
    return ranges.some(({ start, end }) => isTimeInRange(datetime, start, end));
  }

  /**
   * Calculates the fare for a journey based on zones and time
   */
  public getFare(fromZone: number, toZone: number, datetime: Date | string): number {
    const zonePair = FareRules.getZonePair(fromZone, toZone);
    const fareTable = FareRules.FARES[zonePair];

    if (!fareTable) {
      throw new Error(`Invalid zone combination: ${zonePair}`);
    }

    const isPeakTime = this.isPeak(datetime);
    return isPeakTime ? fareTable.peak : fareTable.off_peak;
  }

  /**
   * Creates a normalized zone pair string (e.g., "1-2")
   */
  public static getZonePair(fromZone: number, toZone: number): string {
    return `${fromZone}-${toZone}`;
  }

  /**
   * Retrieves the daily cap for a specific zone pair
   */
  public getDailyCap(zonePair: string): number {
    const cap = FareRules.CAPS.daily[zonePair];

    if (cap === undefined) {
      throw new Error(`No daily cap defined for zone pair: ${zonePair}`);
    }

    return cap;
  }

  /**
   * Finds the highest daily cap among a set of zone pairs
   */
  public getHighestDailyCap(zonePairs: Set<string>): number {
    let maxCap = 0;

    for (const zonePair of zonePairs) {
      const cap = this.getDailyCap(zonePair);
      if (cap > maxCap) {
        maxCap = cap;
      }
    }

    return maxCap;
  }
}
