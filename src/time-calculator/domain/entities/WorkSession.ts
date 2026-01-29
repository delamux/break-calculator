import { Id } from '../../../shared/domain/Id';
import { DomainError } from '../../../shared/domain/DomainError';
import { TimeOfDay } from '../value-objects/TimeOfDay';
import { Duration } from '../value-objects/Duration';
import { Break } from './Break';

type Period = 'AM' | 'PM';

export class WorkSession {
  private _breaks: Break[] = [];

  private constructor(
    readonly id: Id,
    readonly startTime: TimeOfDay,
    readonly startPeriod: Period,
    readonly endTime: TimeOfDay,
    readonly endPeriod: Period
  ) {}

  static create(
    startTime: TimeOfDay,
    startPeriod: Period,
    endTime: TimeOfDay,
    endPeriod: Period,
    id?: Id
  ): WorkSession {
    return new WorkSession(
      id ?? Id.generate(),
      startTime,
      startPeriod,
      endTime,
      endPeriod
    );
  }

  get breaks(): Break[] {
    return [...this._breaks];
  }

  addBreak(breakItem: Break): void {
    this._breaks.push(breakItem);
  }

  removeBreak(breakId: Id): void {
    const index = this._breaks.findIndex((b) => b.id.equals(breakId));
    if (index === -1) {
      throw DomainError.createNotFound('Break not found');
    }
    this._breaks.splice(index, 1);
  }

  calculateTotalTime(): Duration {
    const startMinutes = this.convertTo24Hours(this.startTime, this.startPeriod);
    let endMinutes = this.convertTo24Hours(this.endTime, this.endPeriod);

    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    return Duration.create(endMinutes - startMinutes);
  }

  calculateTotalBreakTime(): Duration {
    const totalMinutes = this._breaks.reduce((sum, breakItem) => {
      return sum + breakItem.calculateDuration().totalMinutes;
    }, 0);
    return Duration.create(totalMinutes);
  }

  calculateWorkTime(): Duration {
    const totalTime = this.calculateTotalTime();
    const breakTime = this.calculateTotalBreakTime();
    return totalTime.subtract(breakTime);
  }

  private convertTo24Hours(time: TimeOfDay, period: Period): number {
    let hours = time.hours;

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + time.minutes;
  }
}
