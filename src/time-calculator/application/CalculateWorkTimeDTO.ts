export interface WorkSessionInputDTO {
  startTimeInput: string;
  startPeriod: 'AM' | 'PM';
  endTimeInput: string;
  endPeriod: 'AM' | 'PM';
  breaks: BreakInputDTO[];
}

export interface BreakInputDTO {
  type: 'TIME_RANGE' | 'DIRECT_MINUTES';
  startTimeInput?: string;
  endTimeInput?: string;
  minutes?: number;
}

export interface WorkTimeResultDTO {
  totalTime: string;
  breakTime: string;
  workTime: string;
  totalMinutes: number;
  breakMinutes: number;
  workMinutes: number;
}
