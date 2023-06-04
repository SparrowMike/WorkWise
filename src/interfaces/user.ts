export interface ReminderInterface {
  id?: string;
  title: string;
  description?: string;
  duration?: number;
  isFocused?: boolean;
  createdAt: Date;


  timeLeft?: number;
  priority?: number;
  reminder?: boolean;
  dueDate?: Date;
  category?: string;
  tags?: string[];
  completed?: boolean;
  completedAt?: Date;
  isOverdue?(): boolean;
  extendTime?(minutes: number): void;
  delete?(): void;
}


export interface PreferenceInterface {
  theme: string;
  showReminder: boolean;
  stickyBlob: boolean;
  hideBlob: boolean;
  showTime: boolean;
  showDate: boolean;
  sprintTiming: string;
  blobPosition?: {
    left: string;
    top: string;
  };
  quote?: {
    text: string;
    author: string;
  };

  reminder?: string; //! ==== same as single reminder from the array TBC
  isActive?: boolean; //! ==== tbc
}
//? ========= all three ! are added to remove errors over context ------ TBC!!!