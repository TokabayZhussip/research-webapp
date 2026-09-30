"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import {
  GAME_ELEMENTS,
  STRATEGIES,
  type FormState,
  type GameElement,
  type InterventionInput,
  type Strategy,
} from "@/lib/types";

function parseForm(formData: FormData): InterventionInput | null {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const num = (name: string) => {
    const v = text(name);
    return v === "" ? null : Number(v);
  };
  const inRange = (v: number | null, min: number, max: number) =>
    v === null || (!Number.isNaN(v) && v >= min && v <= max);

  const learner_code = text("learner_code");
  const game_element = text("game_element") as GameElement;
  const strategy = text("strategy") as Strategy;
  const engagement_before = num("engagement_before");
  const engagement_after = num("engagement_after");
  const quiz_score = num("quiz_score");
  const exposure_count = num("exposure_count") ?? 0;

  if (
    learner_code.length < 2 ||
    !GAME_ELEMENTS.includes(game_element) ||
    !STRATEGIES.includes(strategy) ||
    engagement_before === null ||
    !inRange(engagement_before, 0, 1) ||
    !inRange(engagement_after, 0, 1) ||
    !inRange(quiz_score, 0, 100) ||
    !Number.isInteger(exposure_count) ||
    exposure_count < 0
  ) {
    return null;
  }

  return {
    learner_code,
    game_element,
    strategy,
    engagement_before,
    engagement_after,
    quiz_score,
    exposure_count,
    note: text("note") || null,
  };
}

const INVALID = "Проверьте поля: код студента, элемент, стратегия и вовлечённость (0–1) обязательны.";
const CONFLICT =
  "Не удалось сохранить. Возможно, запись с таким студентом, элементом и номером показа уже есть.";

export async function createIntervention(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const data = parseForm(formData);
  if (!data) return { error: INVALID };

  let id: number;
  try {
    id = (await api.create(data)).id;
  } catch {
    return { error: CONFLICT };
  }
  revalidatePath("/interventions");
  redirect(`/interventions/${id}`);
}

export async function updateIntervention(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const data = parseForm(formData);
  if (!data) return { error: INVALID };

  try {
    await api.update(id, data);
  } catch {
    return { error: CONFLICT };
  }
  revalidatePath("/interventions");
  redirect(`/interventions/${id}`);
}

export async function deleteIntervention(id: number) {
  await api.remove(id);
  revalidatePath("/interventions");
  redirect("/interventions");
}