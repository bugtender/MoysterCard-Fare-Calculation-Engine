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
