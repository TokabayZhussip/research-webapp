export const ELEMENTS = ["points", "badge", "leaderboard", "progress_bar", "challenge"] as const;
export type GameElement = (typeof ELEMENTS)[number];

export const ELEMENT_LABELS: Record<GameElement, string> = {
  points: "Баллы",
  badge: "Бейдж",
  leaderboard: "Рейтинг",
  progress_bar: "Прогресс-бар",
  challenge: "Челлендж",
};

export type LearningSession = {
  id: number;
  session_code: string;
  student_code: string;
  course_topic: string;
  gamification_element: GameElement;
  time_on_task_min: number;
  tasks_completed: number;
  engagement_score: number;
  reward: number | null;
  notes: string | null;
  created_at: string;
};

export type SessionInput = Omit<LearningSession, "id" | "created_at">;

export type Recommendation = {
  student_code: string;
  element: GameElement;
  expected_engagement: number | null;
  explored: boolean;
};

export type FormState = { error?: string };
