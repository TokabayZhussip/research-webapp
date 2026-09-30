"use client";

import { useActionState } from "react";
import {
  GAME_ELEMENTS,
  STRATEGIES,
  type FormState,
  type Intervention,
} from "@/lib/types";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Intervention;
};

const field = "mt-1 w-full rounded border px-3 py-2";

export function InterventionForm({ action, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          Код студента *
          <input
            name="learner_code"
            required
            minLength={2}
            placeholder="S-001"
            defaultValue={initial?.learner_code}
            className={field}
          />
        </label>
        <label className="block">
          Номер показа элемента *
          <input
            name="exposure_count"
            type="number"
            required
            min={0}
            step={1}
            defaultValue={initial?.exposure_count ?? 0}
            className={field}
          />
        </label>
        <label className="block">
          Игровой элемент *
          <select
            name="game_element"
            defaultValue={initial?.game_element ?? "badge"}
            className={field}
          >
            {GAME_ELEMENTS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          Стратегия *
          <select name="strategy" defaultValue={initial?.strategy ?? "none"} className={field}>
            {STRATEGIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          Вовлечённость до (0–1) *
          <input
            name="engagement_before"
            type="number"
            required
            min={0}
            max={1}
            step={0.01}
            defaultValue={initial?.engagement_before}
            className={field}
          />
        </label>
        <label className="block">
          Вовлечённость после (0–1)
          <input
            name="engagement_after"
            type="number"
            min={0}
            max={1}
            step={0.01}
            defaultValue={initial?.engagement_after ?? ""}
            className={field}
          />
        </label>
        <label className="block">
          Результат теста (0–100)
          <input
            name="quiz_score"
            type="number"
            min={0}
            max={100}
            step={0.1}
            defaultValue={initial?.quiz_score ?? ""}
            className={field}
          />
        </label>
      </div>

      <label className="block">
        Примечание
        <textarea name="note" rows={3} defaultValue={initial?.note ?? ""} className={field} />
      </label>

      {state.error && <p className="text-red-700">{state.error}</p>}

      <button
        disabled={pending}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Сохранение…" : "Сохранить"}
      </button>
    </form>
  );
}