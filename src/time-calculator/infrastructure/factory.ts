import { CalculateWorkTimeUseCase } from '../application/CalculateWorkTimeUseCase';
import { LocalStorageAdapter } from './adapters/LocalStorageAdapter';
import { LocalStorageWorkSessionRepository } from './adapters/LocalStorageWorkSessionRepository';

export function createCalculateWorkTimeUseCase(): CalculateWorkTimeUseCase {
  const storage = new LocalStorageAdapter();
  const repository = new LocalStorageWorkSessionRepository(storage);
  return new CalculateWorkTimeUseCase(repository);
}
