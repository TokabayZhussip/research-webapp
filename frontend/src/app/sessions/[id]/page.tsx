import { notFound } from "next/navigation";
import { SessionForm } from "@/components/SessionForm";
import { api } from "@/lib/api";
import { ELEMENT_LABELS } from "@/lib/types";
import { deleteSession, updateSession } from "../actions";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await api.get(Number(id));
  if (!s) notFound();

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Сессия {s.session_code}</h1>
        <p className="text-gray-600">{s.student_code} · {s.course_topic}</p>
      </header>

      <dl className="grid grid-cols-2 gap-2 rounded border bg-white p-4 text-sm">
        <dt>Элемент геймификации</dt><dd>{ELEMENT_LABELS[s.gamification_element]}</dd>
        <dt>Время на задании</dt><dd>{s.time_on_task_min} мин</dd>
        <dt>Выполнено заданий</dt><dd>{s.tasks_completed}</dd>
        <dt>Вовлечённость</dt><dd>{s.engagement_score.toFixed(2)}</dd>
        <dt>Награда</dt><dd>{s.reward ?? "—"}</dd>
      </dl>

      {s.notes && <p className="whitespace-pre-line">{s.notes}</p>}

      <details className="rounded border bg-white p-4">
        <summary className="cursor-pointer font-semibold">Редактировать</summary>
        <div className="mt-4">
          <SessionForm action={updateSession.bind(null, s.id)} initial={s} />
        </div>
      </details>

      <form action={deleteSession.bind(null, s.id)}>
        <button className="rounded border border-red-700 px-4 py-2 text-red-700">Удалить</button>
      </form>
    </article>
  );
}
