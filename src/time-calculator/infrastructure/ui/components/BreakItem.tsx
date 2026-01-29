import { Input } from './Input';
import { RadioGroup } from './RadioGroup';
import { Button } from './Button';

interface BreakItemProps {
  id: string;
  type: 'TIME_RANGE' | 'DIRECT_MINUTES';
  startTime?: string;
  endTime?: string;
  minutes?: string;
  onTypeChange: (id: string, type: 'TIME_RANGE' | 'DIRECT_MINUTES') => void;
  onStartTimeChange: (id: string, value: string) => void;
  onEndTimeChange: (id: string, value: string) => void;
  onMinutesChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

const typeOptions = [
  { value: 'TIME_RANGE', label: 'Time Range' },
  { value: 'DIRECT_MINUTES', label: 'Direct Minutes' },
];

export function BreakItem({
  id,
  type,
  startTime = '',
  endTime = '',
  minutes = '',
  onTypeChange,
  onStartTimeChange,
  onEndTimeChange,
  onMinutesChange,
  onRemove,
}: BreakItemProps) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <RadioGroup
          name={`break-type-${id}`}
          value={type}
          onChange={(v) => onTypeChange(id, v as 'TIME_RANGE' | 'DIRECT_MINUTES')}
          options={typeOptions}
        />
        <Button variant="destructive" onClick={() => onRemove(id)}>
          Remove
        </Button>
      </div>

      {type === 'TIME_RANGE' ? (
        <div className="flex gap-2">
          <Input
            value={startTime}
            onChange={(v) => onStartTimeChange(id, v)}
            placeholder="Start (e.g. 1200)"
            className="flex-1"
          />
          <Input
            value={endTime}
            onChange={(v) => onEndTimeChange(id, v)}
            placeholder="End (e.g. 1300)"
            className="flex-1"
          />
        </div>
      ) : (
        <Input
          value={minutes}
          onChange={(v) => onMinutesChange(id, v)}
          placeholder="Minutes (e.g. 30)"
        />
      )}
    </div>
  );
}
