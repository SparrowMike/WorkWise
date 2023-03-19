export interface RemindersInterface {
  title: string;
  description: string;
  priority: number;
  reminder: boolean;
}

export interface Preference {
  theme?: string;
  showReminder?: boolean;
  stickyBlob?: boolean;
  hideBlob?: boolean;
  showTime?: boolean;
  showDate?: boolean;
  sprintTiming?: number;
  blobPosition?: {
    left: string;
    top: string;
  };

  timeLeft? : number; //!===== tbc
  reminder?: string; //! ==== same as single reminder from the array TBC
  isActive?: boolean; //! ==== tbc
}
//? ========= all three ! are added to remove errors over context ------ TBC!!!