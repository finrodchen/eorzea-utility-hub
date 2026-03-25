export interface Alarm {
  id: string;
  label: string;
  targetTime: Date;
  active: boolean;
  isReset: boolean;
  durationHours?: number;
  offsetMinutes?: number;
}

export interface EorzeaTime {
  hours: number;
  minutes: number;
}
