import { PeakHours, PeakRange } from '../types/FareTypes';
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
}
