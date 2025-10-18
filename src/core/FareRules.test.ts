import { FareRules } from './FareRules';

describe('FareRules', () => {
  let fareRules: FareRules;

  beforeEach(() => {
    fareRules = new FareRules();
  });

  describe('isPeak', () => {
    describe('weekdays', () => {
      it('should return true for weekday morning peak time (07:00-10:30)', () => {
        const monday0800 = new Date('2025-10-10T08:00:00Z'); // Monday 08:00
        expect(fareRules.isPeak(monday0800)).toBe(true);
      });

      it('should return true for weekday evening peak time (17:00-20:00)', () => {
        const tuesday1830 = new Date('2025-10-14T18:30:00Z'); // Tuesday 18:30
        expect(fareRules.isPeak(tuesday1830)).toBe(true);
      });

      it('should return false for weekday off-peak time', () => {
        const wednesday1220 = new Date('2025-10-15T12:20:00Z'); // Wednesday 12:20
        expect(fareRules.isPeak(wednesday1220)).toBe(false);
      });

      it('should return false for early morning off-peak', () => {
        const thursday0630 = new Date('2025-10-16T06:30:00Z'); // Thursday 06:30
        expect(fareRules.isPeak(thursday0630)).toBe(false);
      });

      it('should return false for late evening off-peak', () => {
        const friday2100 = new Date('2025-10-17T21:00:00Z'); // Friday 21:00
        expect(fareRules.isPeak(friday2100)).toBe(false);
      });

      it('should handle boundary time at start of morning peak', () => {
        const monday0700 = new Date('2025-10-13T07:00:00Z'); // Monday 07:00
        expect(fareRules.isPeak(monday0700)).toBe(true);
      });

      it('should handle boundary time at end of morning peak', () => {
        const monday1030 = new Date('2025-10-13T10:30:00Z'); // Monday 10:30
        expect(fareRules.isPeak(monday1030)).toBe(true);
      });
    });

    describe('weekends', () => {
      it('should return true for Saturday morning peak time (09:00-11:00)', () => {
        const saturday1000 = new Date('2025-10-18T10:00:00Z'); // Saturday 10:00
        expect(fareRules.isPeak(saturday1000)).toBe(true);
      });

      it('should return true for Sunday evening peak time (18:00-22:00)', () => {
        const sunday2000 = new Date('2025-10-19T20:00:00Z'); // Sunday 20:00
        expect(fareRules.isPeak(sunday2000)).toBe(true);
      });

      it('should return false for Saturday off-peak time', () => {
        const saturday1400 = new Date('2025-10-18T14:00:00Z'); // Saturday 14:00
        expect(fareRules.isPeak(saturday1400)).toBe(false);
      });

      it('should return false for Sunday early morning', () => {
        const sunday0800 = new Date('2025-10-19T08:00:00Z'); // Sunday 08:00
        expect(fareRules.isPeak(sunday0800)).toBe(false);
      });
    });

    it('should accept string datetime input', () => {
      const isoString = '2025-10-13T08:00:00Z';
      expect(fareRules.isPeak(isoString)).toBe(true);
    });
  });
});
