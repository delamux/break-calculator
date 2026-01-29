import { useState, useEffect } from 'preact/hooks';
import { CalculateWorkTimeUseCase } from '../../../application/CalculateWorkTimeUseCase';
import type { WorkSessionInputDTO, BreakInputDTO, WorkTimeResultDTO } from '../../../application/CalculateWorkTimeDTO';

interface BreakState {
  id: string;
  type: 'TIME_RANGE' | 'DIRECT_MINUTES';
  startTime?: string;
  endTime?: string;
  minutes?: string;
}

export function useWorkSession(useCase: CalculateWorkTimeUseCase) {
  const [startTime, setStartTime] = useState('');
  const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>('AM');
  const [endTime, setEndTime] = useState('');
  const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>('PM');
  const [breaks, setBreaks] = useState<BreakState[]>([]);
  const [result, setResult] = useState<WorkTimeResultDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const loadSession = async () => {
      const stored = await useCase.loadSession();
      if (stored) {
        setStartTime(stored.startTime);
        setStartPeriod(stored.startPeriod);
        setEndTime(stored.endTime);
        setEndPeriod(stored.endPeriod);

        if (stored.breaks.length > 0) {
          const restoredBreaks: BreakState[] = stored.breaks.map((b) => ({
            id: b.id,
            type: b.type,
            startTime: b.startTime ?? '',
            endTime: b.endTime ?? '',
            minutes: b.minutes !== undefined ? b.minutes.toString() : '',
          }));
          setBreaks(restoredBreaks);
        } else {
          addBreak();
        }
      } else {
        addBreak();
      }
      setInitialized(true);
    };

    loadSession();
  }, [initialized, useCase]);

  const addBreak = () => {
    const newBreak: BreakState = {
      id: crypto.randomUUID(),
      type: 'DIRECT_MINUTES',
      minutes: '',
    };
    setBreaks((prev) => [...prev, newBreak]);
  };

  const removeBreak = (id: string) => {
    setBreaks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBreakType = (id: string, type: 'TIME_RANGE' | 'DIRECT_MINUTES') => {
    setBreaks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, type, startTime: '', endTime: '', minutes: '' } : b
      )
    );
  };

  const updateBreakStartTime = (id: string, value: string) => {
    setBreaks((prev) => prev.map((b) => (b.id === id ? { ...b, startTime: value } : b)));
  };

  const updateBreakEndTime = (id: string, value: string) => {
    setBreaks((prev) => prev.map((b) => (b.id === id ? { ...b, endTime: value } : b)));
  };

  const updateBreakMinutes = (id: string, value: string) => {
    setBreaks((prev) => prev.map((b) => (b.id === id ? { ...b, minutes: value } : b)));
  };

  const calculate = async () => {
    try {
      setError(null);

      const breaksInput: BreakInputDTO[] = breaks
        .filter((b) => {
          if (b.type === 'DIRECT_MINUTES') {
            return b.minutes && b.minutes.trim() !== '';
          }
          return b.startTime && b.endTime && b.startTime.trim() !== '' && b.endTime.trim() !== '';
        })
        .map((b) => ({
          type: b.type,
          startTimeInput: b.startTime,
          endTimeInput: b.endTime,
          minutes: b.minutes ? parseInt(b.minutes, 10) : undefined,
        }));

      const input: WorkSessionInputDTO = {
        startTimeInput: startTime,
        startPeriod,
        endTimeInput: endTime,
        endPeriod,
        breaks: breaksInput,
      };

      const calculatedResult = await useCase.execute(input);
      setResult(calculatedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular');
      setResult(null);
    }
  };

  return {
    startTime,
    setStartTime,
    startPeriod,
    setStartPeriod,
    endTime,
    setEndTime,
    endPeriod,
    setEndPeriod,
    breaks,
    addBreak,
    removeBreak,
    updateBreakType,
    updateBreakStartTime,
    updateBreakEndTime,
    updateBreakMinutes,
    calculate,
    result,
    error,
  };
}
