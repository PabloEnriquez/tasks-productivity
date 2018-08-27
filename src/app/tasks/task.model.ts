export interface Task {
  id: string;
  title:  string;
  content: string;
  duration: { min: number, sec: number };
  completion?: { min: number, sec: number };
  isCompleted?: boolean;
}
