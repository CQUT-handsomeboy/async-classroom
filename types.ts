export interface Course {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  description: string;
  duration: string;
  views: number;
  created_at?: string;
  video_url?: string;
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  isCurrent: boolean;
  branch: 'main' | 'student-fork' | 'feature-visuals' | 'feature/controls' | 'experiment/webgl' | 'hotfix/calculation' | 'docs/api';
}

export interface CrashPoint {
  timestamp: number; // seconds
  count: number;
}

export interface TranscriptLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Task {
  task_id: string;
  status: string;
  message: string;
  video_url: string;
  srt_url: string;
  created_at: number;
  code: string;
}

export interface TasksResponse {
  total: number;
  count: number;
  offset: number;
  limit: number | null;
  tasks: Task[];
}
