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
  sprintLength?: number;
  showTime?: boolean;
  showDate?: boolean;
}