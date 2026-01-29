import { describe, it, expect } from 'vitest';
import { WorkSession } from '../../domain/entities/WorkSession';
import { Break } from '../../domain/entities/Break';
import { TimeOfDay } from '../../domain/value-objects/TimeOfDay';
import { Id } from '../../../shared/domain/Id';
import { DomainError } from '../../../shared/domain/DomainError';

describe('The WorkSession', () => {
  it('creates a work session', () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(17, 0);

    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');

    expect(session.id).toBeDefined();
    expect(session.startTime).toBe(startTime);
    expect(session.startPeriod).toBe('AM');
    expect(session.endTime).toBe(endTime);
    expect(session.endPeriod).toBe('PM');
  });

  it('adds a break to the session', () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(17, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');
    const breakItem = Break.createFromMinutes(30);

    session.addBreak(breakItem);

    expect(session.breaks).toHaveLength(1);
    expect(session.breaks[0]).toBe(breakItem);
  });

  it('removes a break from the session', () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(17, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');
    const breakItem = Break.createFromMinutes(30);
    session.addBreak(breakItem);

    session.removeBreak(breakItem.id);

    expect(session.breaks).toHaveLength(0);
  });

  it('calculates total time in company', () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(5, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');

    const totalTime = session.calculateTotalTime();

    expect(totalTime.totalMinutes).toBe(480);
  });

  it('calculates total time in company for PM to PM shift', () => {
    const startTime = TimeOfDay.create(2, 0);
    const endTime = TimeOfDay.create(10, 0);
    const session = WorkSession.create(startTime, 'PM', endTime, 'PM');

    const totalTime = session.calculateTotalTime();

    expect(totalTime.totalMinutes).toBe(480);
  });

  it('calculates total time with overnight shift', () => {
    const startTime = TimeOfDay.create(11, 0);
    const endTime = TimeOfDay.create(3, 0);
    const session = WorkSession.create(startTime, 'PM', endTime, 'AM');

    const totalTime = session.calculateTotalTime();

    expect(totalTime.totalMinutes).toBe(240);
  });

  it('calculates total break time', () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(17, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');
    session.addBreak(Break.createFromMinutes(30));
    session.addBreak(Break.createFromMinutes(15));

    const breakTime = session.calculateTotalBreakTime();

    expect(breakTime.totalMinutes).toBe(45);
  });

  it('calculates zero break time when no breaks', () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(17, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');

    const breakTime = session.calculateTotalBreakTime();

    expect(breakTime.totalMinutes).toBe(0);
  });

  it('calculates work time', () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(5, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');
    session.addBreak(Break.createFromMinutes(60));

    const workTime = session.calculateWorkTime();

    expect(workTime.totalMinutes).toBe(420);
  });

  it('prevents removing non-existent break', () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(17, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');
    const nonExistentId = Id.generate();

    expect(() => session.removeBreak(nonExistentId)).toThrow(DomainError);
  });
});
