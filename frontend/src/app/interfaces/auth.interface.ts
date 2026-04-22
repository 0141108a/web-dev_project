export interface AuthResponse {
  message: string;
  user: { id: number; username: string; email: string };
  access: string;
  refresh: string;
}

export interface WeeklyQuestItem {
  id: number;
  title: string;
  description: string;
  progress: number;
  goal: number;
  xp_reward: number;
  completed: boolean;
}

export interface WeeklyQuestResponse {
  week_start: string;
  week_end: string;
  items: WeeklyQuestItem[];
}

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  total_quests: number;
  completed_quests: number;
  xp: number;
  level: number;
  badges: string[];
  weekly?: WeeklyQuestResponse;
}

export interface LeaderboardUser extends ProfileResponse {
  rank: number;
}
