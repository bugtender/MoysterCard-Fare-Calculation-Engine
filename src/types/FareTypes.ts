/**
 * Represents a time range for peak hours
 */
export interface PeakRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

/**
 * Peak hour definitions for weekdays and weekends
 */
export interface PeakHours {
  weekdays: PeakRange[];
  weekends: PeakRange[];
}

/**
 * Fare pricing for a specific zone pair
 */
export interface FareTable {
  peak: number;
  off_peak: number;
}

/**
 * Collection of fare tables indexed by zone pair
 */
export interface FareTables {
  [zonePair: string]: FareTable;
}

/**
 * Daily and weekly fare cap tables
 */
export interface CapTables {
  daily: { [zonePair: string]: number };
  weekly: { [zonePair: string]: number };
}
