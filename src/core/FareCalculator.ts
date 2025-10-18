import { Journey } from './Journey';
import { FareRules } from './FareRules';
import { JourneyInput } from '../types/JourneyInput';

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
}
