import { WorkSession } from '../entities/WorkSession';

export interface WorkSessionRepository {
  save(session: WorkSession): Promise<void>;
  findCurrent(): Promise<WorkSession | undefined>;
  clear(): Promise<void>;
}

export class InMemoryWorkSessionRepository implements WorkSessionRepository {
  private session: WorkSession | undefined;

  async save(session: WorkSession): Promise<void> {
    this.session = session;
  }

  async findCurrent(): Promise<WorkSession | undefined> {
    return this.session;
  }

  async clear(): Promise<void> {
    this.session = undefined;
  }
}
