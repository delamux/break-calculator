import { Id } from '../../../shared/domain/Id';
import { Duration } from '../value-objects/Duration';
import { TimeOfDay } from '../value-objects/TimeOfDay';
import { BreakType } from '../value-objects/BreakType';

export class Break {
  private constructor(
    readonly id: Id,
    readonly type: BreakType,
    readonly startTime?: TimeOfDay,
    readonly endTime?: TimeOfDay,
    readonly minutes?: number
  ) {}

  static createFromTimeRange(
    start: TimeOfDay,
    end: TimeOfDay,
    id?: Id
  ): Break {
    return new Break(
      id ?? Id.generate(),
      BreakType.TIME_RANGE,
      start,
      end,
      undefined
    );
  }

  static createFromMinutes(minutes: number, id?: Id): Break {
    return new Break(
      id ?? Id.generate(),
      BreakType.DIRECT_MINUTES,
      undefined,
      undefined,
      minutes
    );
  }

  calculateDuration(): Duration {
    if (this.type === BreakType.TIME_RANGE && this.startTime && this.endTime) {
      return Duration.fromTimeRange(this.startTime, this.endTime);
    }
    if (this.type === BreakType.DIRECT_MINUTES && this.minutes !== undefined) {
      return Duration.create(this.minutes);
    }
    return Duration.create(0);
  }
}
