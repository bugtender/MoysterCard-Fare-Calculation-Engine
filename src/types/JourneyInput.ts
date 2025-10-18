/**
 * Input interface for creating a Journey instance
 */
export interface JourneyInput {
  datetime: Date | string;
  fromZone: number;
  toZone: number;
}
