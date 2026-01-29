import { Input } from './Input';
import { Select } from './Select';

interface TimeInputSectionProps {
  startTime: string;
  startPeriod: 'AM' | 'PM';
  endTime: string;
  endPeriod: 'AM' | 'PM';
  onStartTimeChange: (value: string) => void;
  onStartPeriodChange: (value: 'AM' | 'PM') => void;
  onEndTimeChange: (value: string) => void;
  onEndPeriodChange: (value: 'AM' | 'PM') => void;
}

const periodOptions = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
];

export function TimeInputSection({
  startTime,
  startPeriod,
  endTime,
  endPeriod,
  onStartTimeChange,
  onStartPeriodChange,
  onEndTimeChange,
  onEndPeriodChange,
}: TimeInputSectionProps) {
  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-lg font-semibold">Hora de Entrada y Salida</h2>

      <div className="space-y-4">
        <div>
          <label className="label-text block mb-2">Entrada (ej: 923 o 9:23)</label>
          <div className="flex gap-2">
            <Input
              value={startTime}
              onChange={onStartTimeChange}
              placeholder="923"
              className="flex-1"
            />
            <Select
              value={startPeriod}
              onChange={(v) => onStartPeriodChange(v as 'AM' | 'PM')}
              options={periodOptions}
            />
          </div>
        </div>

        <div>
          <label className="label-text block mb-2">Salida (ej: 645 o 6:45)</label>
          <div className="flex gap-2">
            <Input
              value={endTime}
              onChange={onEndTimeChange}
              placeholder="645"
              className="flex-1"
            />
            <Select
              value={endPeriod}
              onChange={(v) => onEndPeriodChange(v as 'AM' | 'PM')}
              options={periodOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
