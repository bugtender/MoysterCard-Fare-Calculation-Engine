import { FareCalculator } from './core/FareCalculator';
import { JourneyInput } from './types/JourneyInput';

describe('FareCalculator —— Official Assignment Examples', () => {
  let calculator: FareCalculator;

  beforeEach(() => {
    calculator = new FareCalculator();
  });

  describe('1.Daily Cap', () => {
    it('should apply daily cap correctly when total fare exceeds the limit', () => {
      const journeys: JourneyInput[] = [
        // Monday
        { datetime: '2025-10-13T10:20:00Z', fromZone: 2, toZone: 1 }, // 35
        { datetime: '2025-10-13T10:45:00Z', fromZone: 1, toZone: 1 }, // 25
        { datetime: '2025-10-13T16:15:00Z', fromZone: 1, toZone: 1 }, // 25
        { datetime: '2025-10-13T18:15:00Z', fromZone: 1, toZone: 1 }, // 30
        { datetime: '2025-10-13T19:00:00Z', fromZone: 1, toZone: 2 }, // 35
        /// Total: 140, capped at 120
      ];

      expect(calculator.calculate(journeys)).toBe(120);
    });
  });

  describe('2. Weekly Cap', () => {
    it('should correctly apply daily and weekly caps across multiple days and weeks', () => {
      const journeys: JourneyInput[] = [
        // Week 1 (Oct 13-19, 2025): Monday to Sunday, hitting weekly cap
        { datetime: '2025-10-13T08:00:00Z', fromZone: 1, toZone: 2 }, // Mon, 35
        { datetime: '2025-10-13T09:00:00Z', fromZone: 1, toZone: 2 }, // Mon, 35
        { datetime: '2025-10-13T18:00:00Z', fromZone: 1, toZone: 2 }, // Mon, 35
        { datetime: '2025-10-13T19:00:00Z', fromZone: 1, toZone: 2 }, // Mon, 35
        // Day 1: 140, capped at 120

        { datetime: '2025-10-14T08:00:00Z', fromZone: 1, toZone: 2 }, // Tue, 35
        { datetime: '2025-10-14T09:00:00Z', fromZone: 1, toZone: 2 }, // Tue, 35
        { datetime: '2025-10-14T18:00:00Z', fromZone: 1, toZone: 2 }, // Tue, 35
        { datetime: '2025-10-14T19:00:00Z', fromZone: 1, toZone: 2 }, // Tue, 35
        // Day 2: 140, capped at 120

        { datetime: '2025-10-15T08:00:00Z', fromZone: 1, toZone: 2 }, // Wed, 35
        { datetime: '2025-10-15T09:00:00Z', fromZone: 1, toZone: 2 }, // Wed, 35
        { datetime: '2025-10-15T18:00:00Z', fromZone: 1, toZone: 2 }, // Wed, 35
        { datetime: '2025-10-15T19:00:00Z', fromZone: 1, toZone: 2 }, // Wed, 35
        // Day 3: 140, capped at 120

        { datetime: '2025-10-16T08:00:00Z', fromZone: 1, toZone: 2 }, // Thu, 35
        { datetime: '2025-10-16T09:00:00Z', fromZone: 1, toZone: 2 }, // Thu, 35
        { datetime: '2025-10-16T18:00:00Z', fromZone: 1, toZone: 2 }, // Thu, 35
        { datetime: '2025-10-16T19:00:00Z', fromZone: 1, toZone: 2 }, // Thu, 35
        // Day 4: 140, capped at 120

        { datetime: '2025-10-17T06:00:00Z', fromZone: 1, toZone: 1 }, // Fri, 25
        { datetime: '2025-10-17T04:00:00Z', fromZone: 1, toZone: 1 }, // Fri, 25
        { datetime: '2025-10-17T18:00:00Z', fromZone: 1, toZone: 1 }, // Fri, 30
        // Day 5: 80

        { datetime: '2025-10-18T08:00:00Z', fromZone: 1, toZone: 2 }, // Sat, 35
        { datetime: '2025-10-18T09:00:00Z', fromZone: 1, toZone: 2 }, // Sat, 35
        // Day 6: 70, capped at 40 (weekly cap reached)

        { datetime: '2025-10-19T08:00:00Z', fromZone: 2, toZone: 1 }, // Sun, 35
        { datetime: '2025-10-19T09:00:00Z', fromZone: 1, toZone: 2 }, // Sun, 35
        // Day 7: 70, capped at 0 (weekly cap reached)
        // Week 1 total: 120 + 120 + 120 + 120 + 80 + 40 + 0 = 600

        // Week 2 (Oct 20, 2025): Monday
        { datetime: '2025-10-20T08:00:00Z', fromZone: 1, toZone: 2 }, // Mon, 35
        { datetime: '2025-10-20T09:00:00Z', fromZone: 2, toZone: 1 }, // Mon, 35
        { datetime: '2025-10-20T21:00:00Z', fromZone: 2, toZone: 1 }, // Mon, 30
        // Day 1: 100
        // Week 2 total: 100
      ];

      // Total: Week 1 (600) + Week 2 (100) = 700
      expect(calculator.calculate(journeys)).toBe(700);
    });
  });
});
