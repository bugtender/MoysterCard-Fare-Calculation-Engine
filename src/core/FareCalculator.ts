import { Journey } from './Journey';
import { FareRules } from './FareRules';
import { JourneyInput } from '../types/JourneyInput';
import { formatDate } from '../utils/date';
import { DailyFareData } from '../types/DailyFareData';
/**
 * FareCalculator is the entry point for computing daily journey fares.
 */
export class FareCalculator {
  private readonly fareRules: FareRules;

  constructor(fareRules?: FareRules) {
    this.fareRules = fareRules || new FareRules();
  }

  /**
   * Calculates total fare for journeys within a single day, applying daily cap
   */
  public calculateDaily(journeyInputs: JourneyInput[]): number {
    if (journeyInputs.length === 0) {
      return 0;
    }

    const journeys = this.createJourneys(journeyInputs);
    const { totalFare, zonePairs } = this.sumJourneyFares(journeys);
    const dailyCap = this.fareRules.getHighestDailyCap(zonePairs);

    return Math.min(totalFare, dailyCap);
  }

  /**
   * Calculates total fare for journeys across a week (Monday-Sunday),
   * applying daily and weekly caps.
   */
  public calculateWeekly(journeyInputs: JourneyInput[]): number {
    if (journeyInputs.length === 0) {
      return 0;
    }

    const journeys = this.createJourneys(journeyInputs);
    const dailyData = this.groupAndCapByDay(journeys);
    const allZonePairs = this.collectAllZonePairs(dailyData);
    const weeklyCap = this.fareRules.getHighestWeeklyCap(allZonePairs);

    return this.applyWeeklyCap(dailyData, weeklyCap);
  }

  /**
   * Creates Journey instances from inputs, reusing fareRules
   */
  private createJourneys(journeyInputs: JourneyInput[]): Journey[] {
    return journeyInputs.map((input) => new Journey(input, this.fareRules));
  }

  /**
   * Sums total fares and collects unique zone pairs
   */
  private sumJourneyFares(journeys: Journey[]): { totalFare: number; zonePairs: Set<string> } {
    const zonePairs = new Set<string>();
    let totalFare = 0;

    for (const journey of journeys) {
      totalFare += journey.fare;
      zonePairs.add(journey.zonePair);
    }

    return { totalFare, zonePairs };
  }

  /**
   * Groups journeys by day and applies daily caps
   */
  private groupAndCapByDay(journeys: Journey[]): Map<string, DailyFareData> {
    const dailyMap = new Map<string, DailyFareData>();

    for (const journey of journeys) {
      const dateKey = formatDate(journey.datetime);

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          journeys: [],
          zonePairs: new Set<string>(),
          uncappedTotal: 0,
          cappedTotal: 0,
        });
      }

      const dayData = dailyMap.get(dateKey)!;
      dayData.journeys.push(journey);
      dayData.zonePairs.add(journey.zonePair);
      dayData.uncappedTotal += journey.fare;
    }

    // Apply daily caps
    for (const dayData of dailyMap.values()) {
      const dailyCap = this.fareRules.getHighestDailyCap(dayData.zonePairs);
      dayData.cappedTotal = Math.min(dayData.uncappedTotal, dailyCap);
    }

    return dailyMap;
  }

  /**
   * Collects all unique zone pairs from daily data
   */
  private collectAllZonePairs(dailyData: Map<string, DailyFareData>): Set<string> {
    const allZonePairs = new Set<string>();

    for (const dayData of dailyData.values()) {
      dayData.zonePairs.forEach((zonePair) => allZonePairs.add(zonePair));
    }

    return allZonePairs;
  }

  /**
   * Applies progressive weekly capping: accumulates daily totals until weekly cap is reached
   */
  private applyWeeklyCap(dailyData: Map<string, DailyFareData>, weeklyCap: number): number {
    const sortedDays = Array.from(dailyData.keys()).sort();
    let weeklyTotal = 0;

    for (const dayKey of sortedDays) {
      const dayData = dailyData.get(dayKey)!;
      const remainingCap = Math.max(weeklyCap - weeklyTotal, 0);
      const dailyCharge = Math.min(dayData.cappedTotal, remainingCap);

      weeklyTotal += dailyCharge;
    }

    return weeklyTotal;
  }
}
