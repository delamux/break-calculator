import { DomainError } from '../../../shared/domain/DomainError';

export class TimeOfDay {
  private constructor(
    readonly hours: number,
    readonly minutes: number
  ) {}

  static create(hours: number, minutes: number): TimeOfDay {
    if (hours < 0 || hours > 23) {
      throw DomainError.createValidation('Hours must be between 0 and 23');
    }
    if (minutes < 0 || minutes > 59) {
      throw DomainError.createValidation('Minutes must be between 0 and 59');
    }
    return new TimeOfDay(hours, minutes);
  }

  toMinutes(): number {
    return this.hours * 60 + this.minutes;
  }
}
