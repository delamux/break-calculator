interface ResultsPanelProps {
  totalTime: string;
  breakTime: string;
  workTime: string;
  visible: boolean;
}

export function ResultsPanel({ totalTime, breakTime, workTime, visible }: ResultsPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="card p-6 space-y-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <h2 className="text-xl font-semibold">Resultados</h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-[hsl(var(--primary-foreground))]/20">
          <span className="text-sm">Tiempo total en empresa:</span>
          <span className="font-medium">{totalTime}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-[hsl(var(--primary-foreground))]/20">
          <span className="text-sm">Tiempo total de breaks:</span>
          <span className="font-medium">{breakTime}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold">TIEMPO TRABAJADO:</span>
          <span className="text-lg font-bold">{workTime}</span>
        </div>
      </div>
    </div>
  );
}
