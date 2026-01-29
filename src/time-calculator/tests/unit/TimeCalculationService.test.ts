import { describe, it, expect } from 'vitest';
import { TimeCalculationService } from '../../domain/services/TimeCalculationService';
import { TimeOfDay } from '../../domain/value-objects/TimeOfDay';
import { DomainError } from '../../../shared/domain/DomainError';

describe('The TimeCalculationService', () => {
  describe('parseTimeInput', () => {
    it('parses single digit hour', () => {
      const result = TimeCalculationService.parseTimeInput('9');

      expect(result.hours).toBe(9);
      expect(result.minutes).toBe(0);
    });

    it('parses two digit hour', () => {
      const result = TimeCalculationService.parseTimeInput('11');

      expect(result.hours).toBe(11);
      expect(result.minutes).toBe(0);
    });

    it('parses three digit time', () => {
      const result = TimeCalculationService.parseTimeInput('923');

      expect(result.hours).toBe(9);
      expect(result.minutes).toBe(23);
    });

    it('parses four digit time', () => {
      const result = TimeCalculationService.parseTimeInput('1547');

      expect(result.hours).toBe(3);
      expect(result.minutes).toBe(47);
    });

    it('parses time with colon format', () => {
      const result = TimeCalculationService.parseTimeInput('9:23');

      expect(result.hours).toBe(9);
      expect(result.minutes).toBe(23);
    });

    it('parses four digit time with colon', () => {
      const result = TimeCalculationService.parseTimeInput('15:47');

      expect(result.hours).toBe(3);
      expect(result.minutes).toBe(47);
    });

    it('handles leading zeros in time', () => {
      const result = TimeCalculationService.parseTimeInput('0923');

      expect(result.hours).toBe(9);
      expect(result.minutes).toBe(23);
    });

    it('rejects empty string', () => {
      expect(() => TimeCalculationService.parseTimeInput('')).toThrow(DomainError);
    });

    it('rejects invalid characters', () => {
      expect(() => TimeCalculationService.parseTimeInput('abc')).toThrow(DomainError);
    });
  });

  describe('convertTo24Hour', () => {
    it('converts AM time correctly', () => {
      const time = TimeOfDay.create(9, 23);

      const result = TimeCalculationService.convertTo24Hour(time, 'AM');

      expect(result.hours).toBe(9);
      expect(result.minutes).toBe(23);
    });

    it('converts 12 AM to midnight', () => {
      const time = TimeOfDay.create(12, 0);

      const result = TimeCalculationService.convertTo24Hour(time, 'AM');

      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
    });

    it('converts PM time correctly', () => {
      const time = TimeOfDay.create(3, 45);

      const result = TimeCalculationService.convertTo24Hour(time, 'PM');

      expect(result.hours).toBe(15);
      expect(result.minutes).toBe(45);
    });

    it('keeps 12 PM as noon', () => {
      const time = TimeOfDay.create(12, 0);

      const result = TimeCalculationService.convertTo24Hour(time, 'PM');

      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(0);
    });
  });
});
