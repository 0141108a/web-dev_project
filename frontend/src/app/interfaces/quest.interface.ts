export interface Category {
  id: number;
  name: string;
  color: string;
  owner?: number;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deadline: string | null;
  status: 'pending' | 'completed';
  xp_reward: number;
  category: number | null;
  category_name?: string;
}
