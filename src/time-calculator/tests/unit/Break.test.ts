import { describe, it, expect } from 'vitest';
import { Break } from '../../domain/entities/Break';
import { TimeOfDay } from '../../domain/value-objects/TimeOfDay';
import { BreakType } from '../../domain/value-objects/BreakType';
import { Id } from '../../../shared/domain/Id';

describe('The Break', () => {
  it('creates break from time range', () => {
    const start = TimeOfDay.create(12, 0);
    const end = TimeOfDay.create(13, 0);

    const breakEntity = Break.createFromTimeRange(start, end);

    expect(breakEntity.id).toBeDefined();
    expect(breakEntity.type).toBe(BreakType.TIME_RANGE);
    expect(breakEntity.startTime).toBe(start);
    expect(breakEntity.endTime).toBe(end);
    expect(breakEntity.minutes).toBeUndefined();
  });

  it('creates break from direct minutes', () => {
    const breakEntity = Break.createFromMinutes(30);

    expect(breakEntity.id).toBeDefined();
    expect(breakEntity.type).toBe(BreakType.DIRECT_MINUTES);
    expect(breakEntity.minutes).toBe(30);
    expect(breakEntity.startTime).toBeUndefined();
    expect(breakEntity.endTime).toBeUndefined();
  });

  it('calculates duration for time range break', () => {
    const start = TimeOfDay.create(12, 0);
    const end = TimeOfDay.create(13, 30);
    const breakEntity = Break.createFromTimeRange(start, end);

    const duration = breakEntity.calculateDuration();

    expect(duration.totalMinutes).toBe(90);
  });

  it('calculates duration for direct minutes break', () => {
    const breakEntity = Break.createFromMinutes(45);

    const duration = breakEntity.calculateDuration();

    expect(duration.totalMinutes).toBe(45);
  });

  it('uses provided id when creating from time range', () => {
    const id = Id.create('custom-id');
    const start = TimeOfDay.create(12, 0);
    const end = TimeOfDay.create(13, 0);

    const breakEntity = Break.createFromTimeRange(start, end, id);

    expect(breakEntity.id.equals(id)).toBe(true);
  });

  it('uses provided id when creating from minutes', () => {
    const id = Id.create('custom-id');

    const breakEntity = Break.createFromMinutes(30, id);

    expect(breakEntity.id.equals(id)).toBe(true);
  });
});
