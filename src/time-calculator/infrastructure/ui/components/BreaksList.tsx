import { Button } from './Button';
import { BreakItem } from './BreakItem';

interface Break {
  id: string;
  type: 'TIME_RANGE' | 'DIRECT_MINUTES';
  startTime?: string;
  endTime?: string;
  minutes?: string;
}

interface BreaksListProps {
  breaks: Break[];
  onAddBreak: () => void;
  onTypeChange: (id: string, type: 'TIME_RANGE' | 'DIRECT_MINUTES') => void;
  onStartTimeChange: (id: string, value: string) => void;
  onEndTimeChange: (id: string, value: string) => void;
  onMinutesChange: (id: string, value: string) => void;
  onRemoveBreak: (id: string) => void;
}

export function BreaksList({
  breaks,
  onAddBreak,
  onTypeChange,
  onStartTimeChange,
  onEndTimeChange,
  onMinutesChange,
  onRemoveBreak,
}: BreaksListProps) {
  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-lg font-semibold">Breaks</h2>

      <div className="space-y-3">
        {breaks.map((breakItem) => (
          <BreakItem
            key={breakItem.id}
            id={breakItem.id}
            type={breakItem.type}
            startTime={breakItem.startTime}
            endTime={breakItem.endTime}
            minutes={breakItem.minutes}
            onTypeChange={onTypeChange}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            onMinutesChange={onMinutesChange}
            onRemove={onRemoveBreak}
          />
        ))}
      </div>

      <Button onClick={onAddBreak} variant="secondary" className="w-full">
        + Add Break
      </Button>
    </div>
  );
}
