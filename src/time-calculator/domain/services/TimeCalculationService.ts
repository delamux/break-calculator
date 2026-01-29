import { DomainError } from '../../../shared/domain/DomainError';
import { TimeOfDay } from '../value-objects/TimeOfDay';

type Period = 'AM' | 'PM';

export class TimeCalculationService {
  static parseTimeInput(input: string): { hours: number; minutes: number } {
    if (!input || input.trim() === '') {
      throw DomainError.createValidation('Time input cannot be empty');
    }

    const cleanInput = input.replace(':', '').trim();

    if (!/^\d+$/.test(cleanInput)) {
      throw DomainError.createValidation('Time input must contain only digits');
    }

    const length = cleanInput.length;

    if (length === 1 || length === 2) {
      let hours = parseInt(cleanInput, 10);
      if (hours > 12) {
        hours = hours % 12;
      }
      return { hours, minutes: 0 };
    }

    if (length === 3) {
      const hours = parseInt(cleanInput.charAt(0), 10);
      const minutes = parseInt(cleanInput.substring(1), 10);
      return { hours, minutes };
    }

    if (length === 4) {
      let hours = parseInt(cleanInput.substring(0, 2), 10);
      if (hours > 12) {
        hours = hours % 12;
      }
      const minutes = parseInt(cleanInput.substring(2), 10);
      return { hours, minutes };
    }

    throw DomainError.createValidation('Invalid time format');
  }

  static convertTo24Hour(time: TimeOfDay, period: Period): TimeOfDay {
    let hours = time.hours;

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return TimeOfDay.create(hours, time.minutes);
  }
}
