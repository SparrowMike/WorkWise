import { ReminderInterface } from "../interfaces/user";

//! ------------------------- future concept if ever
export class Reminder implements ReminderInterface {
  id: string;
  title: string;
  description?: string;
  duration: number;
  createdAt: Date;
  priority: number;
  reminder: boolean;
  timeLeft: number;
  dueDate?: Date;
  category?: string;
  tags?: string[];
  completed?: boolean;
  completedAt?: Date;

  constructor(data: ReminderInterface) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.duration = data.duration;
    this.createdAt = data.createdAt;
    this.priority = data.priority;
    this.reminder = data.reminder;
    this.timeLeft = data.timeLeft;
    this.dueDate = data.dueDate;
    this.category = data.category;
    this.tags = data.tags;
    this.completed = data.completed;
    this.completedAt = data.completedAt;
  }

  isOverdue(): boolean {
    return this.dueDate && this.dueDate.getTime() < Date.now();
  }

  extendTime(minutes: number): void {
    this.timeLeft += minutes;
  }

  delete(): void {
  
  }
}


const reminderData: ReminderInterface = {
  id: '1',
  title: 'Finish project',
  description: 'Complete the project by the end of the day',
  duration: 30,
  createdAt: new Date(),
  priority: 1,
  reminder: true,
  timeLeft: 30,
  dueDate: new Date('2023-03-30T12:00:00'),
  category: 'Work',
  tags: ['Urgent', 'Important'],
  completed: false,
  completedAt: undefined,
};

const reminder = new Reminder(reminderData);