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
});
