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
  branch: 'main' | 'student-fork' | 'feature-visuals';
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
