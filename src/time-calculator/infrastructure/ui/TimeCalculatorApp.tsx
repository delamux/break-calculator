import { useMemo } from 'preact/hooks';
import { useWorkSession } from './hooks/useWorkSession';
import { TimeInputSection } from './components/TimeInputSection';
import { BreaksList } from './components/BreaksList';
import { ResultsPanel } from './components/ResultsPanel';
import { Button } from './components/Button';
import { ThemeToggle } from './components/ThemeToggle';
import { createCalculateWorkTimeUseCase } from '../factory';

export function TimeCalculatorApp() {
  const useCase = useMemo(() => createCalculateWorkTimeUseCase(), []);
  const {
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
  } = useWorkSession(useCase);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Work Time Calculator
          </h1>
          <ThemeToggle />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TimeInputSection
            startTime={startTime}
            startPeriod={startPeriod}
            endTime={endTime}
            endPeriod={endPeriod}
            onStartTimeChange={setStartTime}
            onStartPeriodChange={setStartPeriod}
            onEndTimeChange={setEndTime}
            onEndPeriodChange={setEndPeriod}
          />

          <BreaksList
            breaks={breaks}
            onAddBreak={addBreak}
            onTypeChange={updateBreakType}
            onStartTimeChange={updateBreakStartTime}
            onEndTimeChange={updateBreakEndTime}
            onMinutesChange={updateBreakMinutes}
            onRemoveBreak={removeBreak}
          />
        </div>

        <Button onClick={calculate} className="w-full text-lg py-3">
          Calculate Time
        </Button>

        {error && (
          <div className="card p-4 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {result && (
          <ResultsPanel
            totalTime={result.totalTime}
            breakTime={result.breakTime}
            workTime={result.workTime}
            visible={true}
          />
        )}
      </div>
    </div>
  );
}
