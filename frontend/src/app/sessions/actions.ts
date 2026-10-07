"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { ELEMENTS, type FormState, type GameElement, type SessionInput } from "@/lib/types";

const ERROR = "Проверьте поля: все поля со звёздочкой обязательны, вовлечённость от 0 до 1.";

function parseForm(formData: FormData): SessionInput | null {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const num = (name: string) => (text(name) === "" ? NaN : Number(text(name)));
  const element = text("gamification_element") as GameElement;

  const data: SessionInput = {
    session_code: text("session_code"),
    student_code: text("student_code"),
    course_topic: text("course_topic"),
    gamification_element: element,
    time_on_task_min: num("time_on_task_min"),
    tasks_completed: num("tasks_completed"),
    engagement_score: num("engagement_score"),
    reward: text("reward") === "" ? null : num("reward"),
    notes: text("notes") || null,
  };

  const ok =
    data.session_code.length >= 3 &&
    data.student_code.length >= 2 &&
    data.course_topic.length >= 2 &&
    ELEMENTS.includes(element) &&
    Number.isInteger(data.time_on_task_min) &&
    Number.isInteger(data.tasks_completed) &&
    data.engagement_score >= 0 &&
    data.engagement_score <= 1 &&
    (data.reward === null || !Number.isNaN(data.reward));

  return ok ? data : null;
}

export async function createSession(_prev: FormState, formData: FormData): Promise<FormState> {
  const data = parseForm(formData);
  if (!data) return { error: ERROR };

  let id: number;
  try {
    id = (await api.create(data)).id;
  } catch {
    return { error: "Не удалось сохранить. Возможно, сессия с таким кодом уже есть." };
  }
  revalidatePath("/sessions");
  redirect(`/sessions/${id}`);
}

export async function updateSession(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const data = parseForm(formData);
  if (!data) return { error: ERROR };

  try {
    await api.update(id, data);
  } catch {
    return { error: "Не удалось сохранить изменения." };
  }
  revalidatePath("/sessions");
  redirect(`/sessions/${id}`);
}

export async function deleteSession(id: number) {
  await api.remove(id);
  revalidatePath("/sessions");
  redirect("/sessions");
}
