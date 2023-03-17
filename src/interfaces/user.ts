export interface FormData {
  title: string;
  description: string;
  priority: number;
  reminder: boolean;
}

export interface Preference {
  theme?: boolean;
  isActive?: boolean;
  reminder?: string;
  showReminder?: boolean;
  timeLeft?: number;
  showTime?: boolean;
  showDate?: boolean;
}