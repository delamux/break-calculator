import { CalculateWorkTimeUseCase } from '../../application/CalculateWorkTimeUseCase';
import { useWorkSession } from './hooks/useWorkSession';
import { TimeInputSection } from './components/TimeInputSection';
import { BreaksList } from './components/BreaksList';
import { ResultsPanel } from './components/ResultsPanel';
import { Button } from './components/Button';

interface TimeCalculatorAppProps {
  useCase: CalculateWorkTimeUseCase;
}

export function TimeCalculatorApp({ useCase }: TimeCalculatorAppProps) {
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
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Calculadora de Tiempo de Trabajo
        </h1>

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

        <Button onClick={calculate} className="w-full text-lg py-3">
          Calcular Tiempo
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
