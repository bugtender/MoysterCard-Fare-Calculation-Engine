import { FareCalculator } from './FareCalculator';
import { JourneyInput } from '../types/JourneyInput';

describe('FareCalculator', () => {
  let calculator: FareCalculator;

  beforeEach(() => {
    calculator = new FareCalculator();
  });

  describe('calculateDaily', () => {
    it('should return 0 for empty journey list', () => {
      expect(calculator.calculateDaily([])).toBe(0);
    });

    it('should calculate fare for single journey', () => {
      const journeys: JourneyInput[] = [
        { datetime: '2025-10-13T08:00:00Z', fromZone: 1, toZone: 2 }, // Peak, 35
      ];

      expect(calculator.calculateDaily(journeys)).toBe(35);
    });

    it('should calculate total fare for multiple journeys without hitting cap', () => {
      const journeys: JourneyInput[] = [
        { datetime: '2025-10-13T08:00:00Z', fromZone: 1, toZone: 1 }, // Peak, 30
        { datetime: '2025-10-13T12:00:00Z', fromZone: 1, toZone: 1 }, // Off-peak, 25
      ];

      expect(calculator.calculateDaily(journeys)).toBe(55); // 30 + 25 = 55
    });

    it('should apply daily cap when exceeded', () => {
      const journeys: JourneyInput[] = [
        { datetime: '2025-10-13T08:00:00Z', fromZone: 1, toZone: 1 }, // Peak, 30
        { datetime: '2025-10-13T09:00:00Z', fromZone: 1, toZone: 1 }, // Peak, 30
        { datetime: '2025-10-13T18:00:00Z', fromZone: 1, toZone: 1 }, // Peak, 30
        { datetime: '2025-10-13T19:00:00Z', fromZone: 1, toZone: 1 }, // Peak, 30
      ];

      // Total would be 120, but cap is 100 for zone 1-1
      expect(calculator.calculateDaily(journeys)).toBe(100);
    });

    it('should use highest cap when multiple zone pairs are used', () => {
      const journeys: JourneyInput[] = [
        { datetime: '2025-10-13T10:20:00Z', fromZone: 2, toZone: 1 }, // Peak, 35
        { datetime: '2025-10-13T10:45:00Z', fromZone: 1, toZone: 1 }, // Peak, 30
        { datetime: '2025-10-13T16:15:00Z', fromZone: 1, toZone: 1 }, // Off-peak, 25
        { datetime: '2025-10-13T18:15:00Z', fromZone: 1, toZone: 1 }, // Peak, 30
        { datetime: '2025-10-13T19:00:00Z', fromZone: 1, toZone: 2 }, // Peak, 35
      ];

      // Total: 35 + 30 + 25 + 30 + 35 = 155
      // Zones used: 2-1 (cap 120), 1-1 (cap 100), 1-2 (cap 120)
      // Should apply highest cap: 120
      expect(calculator.calculateDaily(journeys)).toBe(120);
    });

    it('should handle zone 2-2 journeys with correct cap', () => {
      const journeys: JourneyInput[] = [
        { datetime: '2025-10-13T08:00:00Z', fromZone: 2, toZone: 2 }, // Peak, 25
        { datetime: '2025-10-13T09:00:00Z', fromZone: 2, toZone: 2 }, // Peak, 25
        { datetime: '2025-10-13T18:00:00Z', fromZone: 2, toZone: 2 }, // Peak, 25
        { datetime: '2025-10-13T19:00:00Z', fromZone: 2, toZone: 2 }, // Peak, 25
      ];

      // Total would be 100, cap is 80 for zone 2-2
      expect(calculator.calculateDaily(journeys)).toBe(80);
    });
  });

  describe('calculateWeekly', () => {
    it('should return 0 for empty journey list', () => {
      expect(calculator.calculateWeekly([])).toBe(0);
    });

    it('should calculate fare for single day without hitting any cap', () => {
      const journeys: JourneyInput[] = [
        { datetime: '2025-10-13T08:00:00Z', fromZone: 1, toZone: 2 }, // Peak, 35
        { datetime: '2025-10-13T18:00:00Z', fromZone: 2, toZone: 1 }, // Peak, 35
      ];

      expect(calculator.calculateWeekly(journeys)).toBe(70);
    });

    it('should apply daily caps but not weekly cap', () => {
      const journeys: JourneyInput[] = [
        // Monday - will hit daily cap of 120
        { datetime: '2025-10-13T08:00:00Z', fromZone: 1, toZone: 2 }, // Peak, 35
        { datetime: '2025-10-13T09:00:00Z', fromZone: 1, toZone: 2 }, // Peak, 35
        { datetime: '2025-10-13T18:00:00Z', fromZone: 1, toZone: 2 }, // Peak, 35
        { datetime: '2025-10-13T19:00:00Z', fromZone: 1, toZone: 2 }, // Peak, 35
        // Total: 140, capped at 120

        // Tuesday - small fare
        { datetime: '2025-10-14T12:00:00Z', fromZone: 1, toZone: 2 }, // Off-peak, 30
      ];

      // Monday: capped at 120, Tuesday: 30
      // Total: 150 (under weekly cap of 600)
      expect(calculator.calculateWeekly(journeys)).toBe(150);
    });

    it('should apply weekly cap when exceeded', () => {
      const journeys: JourneyInput[] = [
        // Monday
        { datetime: '2025-10-13T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-13T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-13T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-13T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Total: 140, capped at 120

        // Tuesday
        { datetime: '2025-10-14T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-14T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-14T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-14T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Total: 140, capped at 120

        // Wednesday
        { datetime: '2025-10-15T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-15T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-15T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-15T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Total: 140, capped at 120

        // Thursday
        { datetime: '2025-10-16T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-16T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-16T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-16T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Total: 140, capped at 120

        // Friday
        { datetime: '2025-10-17T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-17T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-17T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-17T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Total: 140, capped at 120

        // Saturday
        { datetime: '2025-10-18T10:00:00Z', fromZone: 1, toZone: 2 }, // Peak (weekend), 35
        { datetime: '2025-10-18T14:00:00Z', fromZone: 1, toZone: 2 }, // Off-peak, 30
        // Total: 65

        // Sunday
        { datetime: '2025-10-19T12:00:00Z', fromZone: 1, toZone: 2 }, // Off-peak, 30
        // Total: 30
      ];

      // Daily totals: 120 + 120 + 120 + 120 + 120 + 65 + 30 = 695
      // Weekly cap for 1-2: 600
      expect(calculator.calculateWeekly(journeys)).toBe(600);
    });

    it('should use highest weekly cap when multiple zones are used', () => {
      const journeys: JourneyInput[] = [
        // Use mostly 1-2 to get close to that cap
        { datetime: '2025-10-13T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-13T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-13T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-13T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Day 1: 140, capped at 120

        { datetime: '2025-10-14T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-14T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-14T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-14T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Day 2: 140, capped at 120

        { datetime: '2025-10-15T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-15T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-15T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-15T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Day 3: 140, capped at 120

        { datetime: '2025-10-16T08:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-16T09:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-16T18:00:00Z', fromZone: 1, toZone: 2 }, // 35
        { datetime: '2025-10-16T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Day 4: 140, capped at 120

        // Friday: mix with 1-1 travel
        { datetime: '2025-10-17T08:00:00Z', fromZone: 1, toZone: 1 }, // 30
        { datetime: '2025-10-17T09:00:00Z', fromZone: 1, toZone: 1 }, // 30
        { datetime: '2025-10-17T18:00:00Z', fromZone: 1, toZone: 1 }, // 30
        // Day 5: 90

        // Saturday
        { datetime: '2025-10-18T10:00:00Z', fromZone: 1, toZone: 2 }, // 35
        // Day 6: 35

        // Sunday - no travel
      ];

      // Daily totals: 120 + 120 + 120 + 120 + 90 + 35 = 605
      // Zones used: 1-2 (cap 600), 1-1 (cap 500)
      // Should apply highest weekly cap: 600
      expect(calculator.calculateWeekly(journeys)).toBe(600);
    });

    it('should handle week with zone 2-2 only', () => {
      const journeys: JourneyInput[] = [
        // Each day with enough journeys to hit daily cap
        ...Array(5)
          .fill(null)
          .flatMap((_, dayOffset) =>
            Array(4)
              .fill(null)
              .map((_, i) => {
                const hour = String(8 + i * 3).padStart(2, '0');
                return {
                  datetime: `2025-10-${13 + dayOffset}T${hour}:00:00Z`,
                  fromZone: 2,
                  toZone: 2,
                };
              })
          ),
      ];

      // Each day: 4 journeys * 25 (peak) = 100, capped at 80
      // 5 days: 80 * 5 = 400
      // Weekly cap for 2-2: 400
      expect(calculator.calculateWeekly(journeys)).toBe(400);
    });
  });
});
