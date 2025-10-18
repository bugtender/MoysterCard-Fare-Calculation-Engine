import { Journey } from './Journey';

describe('Journey', () => {
  describe('constructor', () => {
    it('should create journey with Date object', () => {
      const datetime = new Date('2025-10-13T08:00:00Z');
      const journey = new Journey({
        datetime,
        fromZone: 1,
        toZone: 2,
      });

      expect(journey.datetime).toEqual(datetime);
      expect(journey.fromZone).toBe(1);
      expect(journey.toZone).toBe(2);
    });

    it('should create journey with ISO string', () => {
      const isoString = '2025-10-13T08:00:00Z';
      const journey = new Journey({
        datetime: isoString,
        fromZone: 2,
        toZone: 1,
      });

      expect(journey.datetime).toEqual(new Date(isoString));
      expect(journey.fromZone).toBe(2);
      expect(journey.toZone).toBe(1);
    });

    it('should throw error for invalid datetime string', () => {
      expect(
        () =>
          new Journey({
            datetime: 'invalid-date',
            fromZone: 1,
            toZone: 2,
          })
      ).toThrow('Invalid datetime provided');
    });

    it('should throw error for negative fromZone', () => {
      expect(
        () =>
          new Journey({
            datetime: new Date('2025-10-13T08:00:00Z'),
            fromZone: -1,
            toZone: 2,
          })
      ).toThrow('fromZone must be a positive integer, got: -1');
    });

    it('should throw error for zero fromZone', () => {
      expect(
        () =>
          new Journey({
            datetime: new Date('2025-10-13T08:00:00Z'),
            fromZone: 0,
            toZone: 2,
          })
      ).toThrow('fromZone must be a positive integer, got: 0');
    });

    it('should throw error for negative toZone', () => {
      expect(
        () =>
          new Journey({
            datetime: new Date('2025-10-13T08:00:00Z'),
            fromZone: 1,
            toZone: -2,
          })
      ).toThrow('toZone must be a positive integer, got: -2');
    });

    it('should throw error for non-integer zone', () => {
      expect(
        () =>
          new Journey({
            datetime: new Date('2025-10-13T08:00:00Z'),
            fromZone: 1.5,
            toZone: 2,
          })
      ).toThrow('fromZone must be a positive integer, got: 1.5');
    });
  });

  describe('fare getter', () => {
    it('should return correct peak fare for zone 1-2', () => {
      const journey = new Journey({
        datetime: new Date('2025-10-13T08:00:00Z'), // Peak time
        fromZone: 1,
        toZone: 2,
      });

      expect(journey.fare).toBe(35);
    });

    it('should return correct off-peak fare for zone 1-2', () => {
      const journey = new Journey({
        datetime: new Date('2025-10-13T12:00:00Z'), // Off-peak time
        fromZone: 1,
        toZone: 2,
      });

      expect(journey.fare).toBe(30);
    });

    it('should return correct peak fare for zone 1-1', () => {
      const journey = new Journey({
        datetime: new Date('2025-10-13T08:00:00Z'), // Peak time
        fromZone: 1,
        toZone: 1,
      });

      expect(journey.fare).toBe(30);
    });

    it('should return correct off-peak fare for zone 2-2', () => {
      const journey = new Journey({
        datetime: new Date('2025-10-13T12:00:00Z'), // Off-peak time
        fromZone: 2,
        toZone: 2,
      });

      expect(journey.fare).toBe(20);
    });
  });
});
