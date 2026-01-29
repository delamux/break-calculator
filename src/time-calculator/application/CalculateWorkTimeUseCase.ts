import type { WorkSessionRepository } from '../domain/repositories/WorkSessionRepository';
import { WorkSession } from '../domain/entities/WorkSession';
import { Break } from '../domain/entities/Break';
import { TimeOfDay } from '../domain/value-objects/TimeOfDay';
import { TimeCalculationService } from '../domain/services/TimeCalculationService';
import type { WorkSessionInputDTO, WorkTimeResultDTO, StoredSessionDTO, StoredBreakDTO } from './CalculateWorkTimeDTO';
import { BreakType } from '../domain/value-objects/BreakType';

export class CalculateWorkTimeUseCase {
  constructor(private readonly repository: WorkSessionRepository) {}

  async loadSession(): Promise<StoredSessionDTO | null> {
    const session = await this.repository.findCurrent();
    if (!session) return null;

    const formatTime = (hours: number, minutes: number): string => {
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };

    const breaks: StoredBreakDTO[] = session.breaks.map((b) => ({
      id: b.id.value,
      type: b.type,
      startTime: b.startTime ? formatTime(b.startTime.hours, b.startTime.minutes) : undefined,
      endTime: b.endTime ? formatTime(b.endTime.hours, b.endTime.minutes) : undefined,
      minutes: b.type === BreakType.DIRECT_MINUTES ? b.minutes : undefined,
    }));

    return {
      startTime: formatTime(session.startTime.hours, session.startTime.minutes),
      startPeriod: session.startPeriod,
      endTime: formatTime(session.endTime.hours, session.endTime.minutes),
      endPeriod: session.endPeriod,
      breaks,
    };
  }

  async execute(input: WorkSessionInputDTO): Promise<WorkTimeResultDTO> {
    const startParsed = TimeCalculationService.parseTimeInput(input.startTimeInput);
    const startTime = TimeOfDay.create(startParsed.hours, startParsed.minutes);
    const start24h = TimeCalculationService.convertTo24Hour(startTime, input.startPeriod);

    const endParsed = TimeCalculationService.parseTimeInput(input.endTimeInput);
    const endTime = TimeOfDay.create(endParsed.hours, endParsed.minutes);
    const end24h = TimeCalculationService.convertTo24Hour(endTime, input.endPeriod);

    const session = WorkSession.create(startTime, input.startPeriod, endTime, input.endPeriod);

    for (const breakInput of input.breaks) {
      if (breakInput.type === 'DIRECT_MINUTES' && breakInput.minutes !== undefined) {
        const breakEntity = Break.createFromMinutes(breakInput.minutes);
        session.addBreak(breakEntity);
      } else if (breakInput.type === 'TIME_RANGE' && breakInput.startTimeInput && breakInput.endTimeInput) {
        const breakStartParsed = TimeCalculationService.parseTimeInput(breakInput.startTimeInput);
        const breakStart = TimeOfDay.create(breakStartParsed.hours, breakStartParsed.minutes);
        
        const breakEndParsed = TimeCalculationService.parseTimeInput(breakInput.endTimeInput);
        const breakEnd = TimeOfDay.create(breakEndParsed.hours, breakEndParsed.minutes);
        
        const breakStart24h = TimeCalculationService.convertTo24Hour(breakStart, 'AM');
        const breakEnd24h = TimeCalculationService.convertTo24Hour(breakEnd, 'AM');
        
        const breakEntity = Break.createFromTimeRange(breakStart24h, breakEnd24h);
        session.addBreak(breakEntity);
      }
    }

    await this.repository.save(session);

    const totalTime = session.calculateTotalTime();
    const breakTime = session.calculateTotalBreakTime();
    const workTime = session.calculateWorkTime();

    return {
      totalTime: totalTime.formatAsString(),
      breakTime: breakTime.formatAsString(),
      workTime: workTime.formatAsString(),
      totalMinutes: totalTime.totalMinutes,
      breakMinutes: breakTime.totalMinutes,
      workMinutes: workTime.totalMinutes,
    };
  }
}
