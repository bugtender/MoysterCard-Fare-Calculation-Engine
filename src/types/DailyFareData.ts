import { Journey } from '../core/Journey';

/**
 * Per-day summary used by weekly fare calculator
 */
export interface DailyFareData {
  date: string;
  journeys: Journey[];
  zonePairs: Set<string>;
  uncappedTotal: number;
  cappedTotal: number;
}
