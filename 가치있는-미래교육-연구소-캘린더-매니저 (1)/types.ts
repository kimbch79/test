
export interface Schedule {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  description: string;
  createdAt: number;
}

export interface UserSession {
  code: string;
  isAuthenticated: boolean;
}
