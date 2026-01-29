import { StoragePort } from '../../application/ports/StoragePort';
import { WorkSessionRepository } from '../../domain/repositories/WorkSessionRepository';
import { WorkSession } from '../../domain/entities/WorkSession';
import { Break } from '../../domain/entities/Break';
import { TimeOfDay } from '../../domain/value-objects/TimeOfDay';
import { BreakType } from '../../domain/value-objects/BreakType';
import { Id } from '../../../shared/domain/Id';

const STORAGE_KEY = 'work-calculator-session';

interface StoredWorkSession {
  id: string;
  startTime: { hours: number; minutes: number };
  startPeriod: 'AM' | 'PM';
  endTime: { hours: number; minutes: number };
  endPeriod: 'AM' | 'PM';
  breaks: StoredBreak[];
}

interface StoredBreak {
  id: string;
  type: 'TIME_RANGE' | 'DIRECT_MINUTES';
  startTime?: { hours: number; minutes: number };
  endTime?: { hours: number; minutes: number };
  minutes?: number;
}

export class LocalStorageWorkSessionRepository implements WorkSessionRepository {
  constructor(private readonly storage: StoragePort) {}

  async save(session: WorkSession): Promise<void> {
    const stored: StoredWorkSession = {
      id: session.id.value,
      startTime: { hours: session.startTime.hours, minutes: session.startTime.minutes },
      startPeriod: session.startPeriod,
      endTime: { hours: session.endTime.hours, minutes: session.endTime.minutes },
      endPeriod: session.endPeriod,
      breaks: session.breaks.map((b) => this.serializeBreak(b)),
    };

    await this.storage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }

  async findCurrent(): Promise<WorkSession | undefined> {
    const data = await this.storage.getItem(STORAGE_KEY);
    if (!data) {
      return undefined;
    }

    try {
      const stored: StoredWorkSession = JSON.parse(data);
      return this.deserializeWorkSession(stored);
    } catch {
      return undefined;
    }
  }

  async clear(): Promise<void> {
    await this.storage.removeItem(STORAGE_KEY);
  }

  private serializeBreak(breakItem: Break): StoredBreak {
    return {
      id: breakItem.id.value,
      type: breakItem.type,
      startTime: breakItem.startTime
        ? { hours: breakItem.startTime.hours, minutes: breakItem.startTime.minutes }
        : undefined,
      endTime: breakItem.endTime
        ? { hours: breakItem.endTime.hours, minutes: breakItem.endTime.minutes }
        : undefined,
      minutes: breakItem.minutes,
    };
  }

  private deserializeWorkSession(stored: StoredWorkSession): WorkSession {
    const startTime = TimeOfDay.create(stored.startTime.hours, stored.startTime.minutes);
    const endTime = TimeOfDay.create(stored.endTime.hours, stored.endTime.minutes);
    const id = Id.create(stored.id);

    const session = WorkSession.create(startTime, stored.startPeriod, endTime, stored.endPeriod, id);

    for (const storedBreak of stored.breaks) {
      const breakId = Id.create(storedBreak.id);

      if (storedBreak.type === BreakType.TIME_RANGE && storedBreak.startTime && storedBreak.endTime) {
        const breakStart = TimeOfDay.create(storedBreak.startTime.hours, storedBreak.startTime.minutes);
        const breakEnd = TimeOfDay.create(storedBreak.endTime.hours, storedBreak.endTime.minutes);
        const breakItem = Break.createFromTimeRange(breakStart, breakEnd, breakId);
        session.addBreak(breakItem);
      } else if (storedBreak.type === BreakType.DIRECT_MINUTES && storedBreak.minutes !== undefined) {
        const breakItem = Break.createFromMinutes(storedBreak.minutes, breakId);
        session.addBreak(breakItem);
      }
    }

    return session;
  }
}
