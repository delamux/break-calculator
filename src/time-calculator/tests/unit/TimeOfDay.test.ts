import { describe, it, expect } from 'vitest';
import { TimeOfDay } from '../../domain/value-objects/TimeOfDay';
import { DomainError } from '../../../shared/domain/DomainError';

describe('The TimeOfDay', () => {
  it('creates a valid time', () => {
    const time = TimeOfDay.create(9, 23);

    expect(time.hours).toBe(9);
    expect(time.minutes).toBe(23);
  });

  it('rejects hours below 0', () => {
    expect(() => TimeOfDay.create(-1, 0)).toThrow(DomainError);
  });

  it('rejects hours above 23', () => {
    expect(() => TimeOfDay.create(24, 0)).toThrow(DomainError);
  });

  it('rejects minutes below 0', () => {
    expect(() => TimeOfDay.create(9, -1)).toThrow(DomainError);
  });

  it('rejects minutes above 59', () => {
    expect(() => TimeOfDay.create(9, 60)).toThrow(DomainError);
  });

  it('converts to total minutes since midnight', () => {
    const time = TimeOfDay.create(9, 23);

    expect(time.toMinutes()).toBe(563);
  });

  it('handles midnight correctly', () => {
    const midnight = TimeOfDay.create(0, 0);

    expect(midnight.toMinutes()).toBe(0);
  });

  it('handles end of day correctly', () => {
    const endOfDay = TimeOfDay.create(23, 59);

    expect(endOfDay.toMinutes()).toBe(1439);
  });
});
