import { PeakHours, PeakRange, FareTables } from '../types/FareTypes';
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
}
