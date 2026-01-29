import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageWorkSessionRepository } from '../../infrastructure/adapters/LocalStorageWorkSessionRepository';
import { LocalStorageAdapter } from '../../infrastructure/adapters/LocalStorageAdapter';
import { WorkSession } from '../../domain/entities/WorkSession';
import { Break } from '../../domain/entities/Break';
import { TimeOfDay } from '../../domain/value-objects/TimeOfDay';

describe('The LocalStorageWorkSessionRepository', () => {
  let storage: LocalStorageAdapter;
  let repository: LocalStorageWorkSessionRepository;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageAdapter();
    repository = new LocalStorageWorkSessionRepository(storage);
  });

  it('saves and retrieves a work session', async () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(5, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');

    await repository.save(session);

    const retrieved = await repository.findCurrent();
    expect(retrieved).toBeDefined();
    expect(retrieved?.id.value).toBe(session.id.value);
    expect(retrieved?.startTime.hours).toBe(9);
    expect(retrieved?.endTime.hours).toBe(5);
  });

  it('saves session with breaks', async () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(5, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');
    const breakItem = Break.createFromMinutes(30);
    session.addBreak(breakItem);

    await repository.save(session);

    const retrieved = await repository.findCurrent();
    expect(retrieved?.breaks).toHaveLength(1);
    expect(retrieved?.breaks[0].calculateDuration().totalMinutes).toBe(30);
  });

  it('returns undefined when no session exists', async () => {
    const retrieved = await repository.findCurrent();

    expect(retrieved).toBeUndefined();
  });

  it('clears the stored session', async () => {
    const startTime = TimeOfDay.create(9, 0);
    const endTime = TimeOfDay.create(5, 0);
    const session = WorkSession.create(startTime, 'AM', endTime, 'PM');
    await repository.save(session);

    await repository.clear();

    const retrieved = await repository.findCurrent();
    expect(retrieved).toBeUndefined();
  });

  it('overwrites previous session', async () => {
    const session1 = WorkSession.create(TimeOfDay.create(9, 0), 'AM', TimeOfDay.create(5, 0), 'PM');
    const session2 = WorkSession.create(TimeOfDay.create(10, 0), 'AM', TimeOfDay.create(6, 0), 'PM');

    await repository.save(session1);
    await repository.save(session2);

    const retrieved = await repository.findCurrent();
    expect(retrieved?.id.value).toBe(session2.id.value);
  });
});
