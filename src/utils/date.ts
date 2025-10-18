import dayjs, { Dayjs } from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(utcPlugin);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

/**
 * Checks if a datetime falls within a time range (inclusive boundaries)
 */
export function isTimeInRange(
  datetime: Date | string,
  startTime: string,
  endTime: string
): boolean {
  const date = toUtcDayjs(datetime);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const start = date.hour(startHour).minute(startMinute).second(0).millisecond(0);
  const end = date.hour(endHour).minute(endMinute).second(0).millisecond(0);

  return date.isBetween(start, end, null, '[]');
}

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(datetime: Date | string): boolean {
  const dayOfWeek = toUtcDayjs(datetime).day();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * Converts a Date or string to a UTC dayjs instance
 */
export function toUtcDayjs(datetime: Date | string): Dayjs {
  return dayjs(datetime).utc();
}

/**
 * Formats a date as YYYY-MM-DD
 */
export function formatDate(datetime: Date | string): string {
  return dayjs(datetime).format('YYYY-MM-DD');
}
