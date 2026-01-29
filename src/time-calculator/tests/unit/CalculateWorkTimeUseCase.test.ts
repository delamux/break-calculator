import { describe, it, expect, beforeEach } from 'vitest';
import { CalculateWorkTimeUseCase } from '../../application/CalculateWorkTimeUseCase';
import { InMemoryWorkSessionRepository } from '../../domain/repositories/WorkSessionRepository';
import type { WorkSessionInputDTO } from '../../application/CalculateWorkTimeDTO';

describe('The CalculateWorkTimeUseCase', () => {
  let repository: InMemoryWorkSessionRepository;
  let useCase: CalculateWorkTimeUseCase;

  beforeEach(() => {
    repository = new InMemoryWorkSessionRepository();
    useCase = new CalculateWorkTimeUseCase(repository);
  });

  it('calculates work time with no breaks', async () => {
    const input: WorkSessionInputDTO = {
      startTimeInput: '9',
      startPeriod: 'AM',
      endTimeInput: '5',
      endPeriod: 'PM',
      breaks: [],
    };

    const result = await useCase.execute(input);

    expect(result.totalMinutes).toBe(480);
    expect(result.breakMinutes).toBe(0);
    expect(result.workMinutes).toBe(480);
    expect(result.totalTime).toBe('8h 0min (480 min totales)');
  });

  it('calculates work time with direct minutes break', async () => {
    const input: WorkSessionInputDTO = {
      startTimeInput: '9',
      startPeriod: 'AM',
      endTimeInput: '5',
      endPeriod: 'PM',
      breaks: [
        {
          type: 'DIRECT_MINUTES',
          minutes: 60,
        },
      ],
    };

    const result = await useCase.execute(input);

    expect(result.totalMinutes).toBe(480);
    expect(result.breakMinutes).toBe(60);
    expect(result.workMinutes).toBe(420);
  });

  it('calculates work time with time range break', async () => {
    const input: WorkSessionInputDTO = {
      startTimeInput: '9:00',
      startPeriod: 'AM',
      endTimeInput: '5:00',
      endPeriod: 'PM',
      breaks: [
        {
          type: 'TIME_RANGE',
          startTimeInput: '12:00',
          endTimeInput: '1:00',
        },
      ],
    };

    const result = await useCase.execute(input);

    expect(result.breakMinutes).toBe(60);
    expect(result.workMinutes).toBe(420);
  });

  it('calculates work time with multiple breaks', async () => {
    const input: WorkSessionInputDTO = {
      startTimeInput: '900',
      startPeriod: 'AM',
      endTimeInput: '600',
      endPeriod: 'PM',
      breaks: [
        {
          type: 'DIRECT_MINUTES',
          minutes: 30,
        },
        {
          type: 'DIRECT_MINUTES',
          minutes: 15,
        },
      ],
    };

    const result = await useCase.execute(input);

    expect(result.breakMinutes).toBe(45);
    expect(result.workMinutes).toBe(495);
  });

  it('persists the work session', async () => {
    const input: WorkSessionInputDTO = {
      startTimeInput: '9',
      startPeriod: 'AM',
      endTimeInput: '5',
      endPeriod: 'PM',
      breaks: [],
    };

    await useCase.execute(input);

    const saved = await repository.findCurrent();
    expect(saved).toBeDefined();
    expect(saved?.startTime.hours).toBe(9);
  });

  it('handles overnight shift', async () => {
    const input: WorkSessionInputDTO = {
      startTimeInput: '11',
      startPeriod: 'PM',
      endTimeInput: '3',
      endPeriod: 'AM',
      breaks: [],
    };

    const result = await useCase.execute(input);

    expect(result.totalMinutes).toBe(240);
  });
});
