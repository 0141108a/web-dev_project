export interface AuthResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  access: string;
  refresh: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  total_quests: number;
  completed_quests: number;
  xp: number;
  level: number;
}
