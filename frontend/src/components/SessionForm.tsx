"use client";

import { useActionState } from "react";
import { ELEMENTS, ELEMENT_LABELS, type FormState, type LearningSession } from "@/lib/types";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: LearningSession;
};

const field = "w-full rounded border px-3 py-2";

export function SessionForm({ action, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        Код сессии *
        <input name="session_code" required minLength={3} placeholder="S-001-01"
          defaultValue={initial?.session_code} className={field} />
      </label>
      <label className="block">
        Код обучающегося *
        <input name="student_code" required minLength={2} placeholder="S-001"
          defaultValue={initial?.student_code} className={field} />
      </label>
      <label className="block">
        Тема курса *
        <input name="course_topic" required minLength={2}
          defaultValue={initial?.course_topic} className={field} />
      </label>
      <label className="block">
        Элемент геймификации *
        <select name="gamification_element" required
          defaultValue={initial?.gamification_element ?? "points"} className={field}>
          {ELEMENTS.map((e) => (
            <option key={e} value={e}>{ELEMENT_LABELS[e]}</option>
          ))}
        </select>
      </label>
      <label className="block">
        Время на задании, мин *
        <input name="time_on_task_min" type="number" required min={0} max={600}
          defaultValue={initial?.time_on_task_min} className={field} />
      </label>
      <label className="block">
        Выполнено заданий *
        <input name="tasks_completed" type="number" required min={0}
          defaultValue={initial?.tasks_completed} className={field} />
      </label>
      <label className="block">
        Вовлечённость (0–1) *
        <input name="engagement_score" type="number" required min={0} max={1} step={0.01}
          defaultValue={initial?.engagement_score} className={field} />
      </label>
      <label className="block">
        Награда (reward)
        <input name="reward" type="number" step="any"
          defaultValue={initial?.reward ?? ""} className={field} />
      </label>
      <label className="block">
        Заметки
        <textarea name="notes" rows={4} defaultValue={initial?.notes ?? ""} className={field} />
      </label>

      {state.error && <p className="text-red-700">{state.error}</p>}

      <button disabled={pending}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Сохранение…" : "Сохранить"}
      </button>
    </form>
  );
}
