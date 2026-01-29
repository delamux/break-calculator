import { DomainError } from '../../../shared/domain/DomainError';
import { TimeOfDay } from './TimeOfDay';

export class Duration {
  private constructor(readonly totalMinutes: number) {}

  static create(minutes: number): Duration {
    if (minutes < 0) {
      throw DomainError.createValidation('Duration cannot be negative');
    }
    return new Duration(minutes);
  }

  static fromTimeRange(start: TimeOfDay, end: TimeOfDay): Duration {
    const startMinutes = start.toMinutes();
    const endMinutes = end.toMinutes();
    const totalMinutes = endMinutes - startMinutes;
    return Duration.create(totalMinutes);
  }

  toHoursAndMinutes(): { hours: number; minutes: number } {
    const hours = Math.floor(this.totalMinutes / 60);
    const minutes = this.totalMinutes % 60;
    return { hours, minutes };
  }

  formatAsString(): string {
    const { hours, minutes } = this.toHoursAndMinutes();
    return `${hours}h ${minutes}min (${this.totalMinutes} min totales)`;
  }

  subtract(other: Duration): Duration {
    const result = this.totalMinutes - other.totalMinutes;
    if (result < 0) {
      throw DomainError.createValidation('Cannot subtract more than available duration');
    }
    return Duration.create(result);
  }
}
