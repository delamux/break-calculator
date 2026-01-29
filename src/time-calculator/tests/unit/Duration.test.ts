import { describe, it, expect } from 'vitest';
import { Duration } from '../../domain/value-objects/Duration';
import { TimeOfDay } from '../../domain/value-objects/TimeOfDay';
import { DomainError } from '../../../shared/domain/DomainError';

describe('The Duration', () => {
  it('creates a duration from minutes', () => {
    const duration = Duration.create(150);

    expect(duration.totalMinutes).toBe(150);
  });

  it('rejects negative minutes', () => {
    expect(() => Duration.create(-1)).toThrow(DomainError);
  });

  it('creates duration from time range', () => {
    const start = TimeOfDay.create(9, 0);
    const end = TimeOfDay.create(17, 30);

    const duration = Duration.fromTimeRange(start, end);

    expect(duration.totalMinutes).toBe(510);
  });

  it('converts to hours and minutes', () => {
    const duration = Duration.create(150);

    const result = duration.toHoursAndMinutes();

    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(30);
  });

  it('handles zero duration', () => {
    const duration = Duration.create(0);

    const result = duration.toHoursAndMinutes();

    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
  });

  it('formats as readable string', () => {
    const duration = Duration.create(150);

    expect(duration.formatAsString()).toBe('2h 30min (150 min totales)');
  });

  it('formats single hour correctly', () => {
    const duration = Duration.create(60);

    expect(duration.formatAsString()).toBe('1h 0min (60 min totales)');
  });

  it('formats only minutes correctly', () => {
    const duration = Duration.create(45);

    expect(duration.formatAsString()).toBe('0h 45min (45 min totales)');
  });

  it('subtracts another duration', () => {
    const duration1 = Duration.create(150);
    const duration2 = Duration.create(30);

    const result = duration1.subtract(duration2);

    expect(result.totalMinutes).toBe(120);
  });

  it('allows subtraction to zero', () => {
    const duration1 = Duration.create(30);
    const duration2 = Duration.create(30);

    const result = duration1.subtract(duration2);

    expect(result.totalMinutes).toBe(0);
  });

  it('prevents negative result from subtraction', () => {
    const duration1 = Duration.create(30);
    const duration2 = Duration.create(50);

    expect(() => duration1.subtract(duration2)).toThrow(DomainError);
  });
});
