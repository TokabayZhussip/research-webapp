export type GameElement =
  | "points"
  | "badge"
  | "leaderboard"
  | "challenge"
  | "progress_bar"
  | "feedback";

export type Strategy = "none" | "static" | "adaptive_rl";

export const GAME_ELEMENTS: GameElement[] = [
  "points",
  "badge",
  "leaderboard",
  "challenge",
  "progress_bar",
  "feedback",
];

export const STRATEGIES: Strategy[] = ["none", "static", "adaptive_rl"];

export type Intervention = {
  id: number;
  learner_code: string;
  game_element: GameElement;
  strategy: Strategy;
  engagement_before: number;
  engagement_after: number | null;
  quiz_score: number | null;
  exposure_count: number;
  note: string | null;
  created_at: string;
};

export type InterventionInput = Omit<Intervention, "id" | "created_at">;

export type FormState = { error?: string };