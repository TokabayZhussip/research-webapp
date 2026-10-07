import Link from "next/link";
import { api } from "@/lib/api";
import { ELEMENT_LABELS } from "@/lib/types";

const PAGE_SIZE = 20;

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const items = await api.list(q, current, PAGE_SIZE);

  const link = (p: number) =>
    `/sessions?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Учебные сессии</h1>
        <Link href="/sessions/new" className="rounded bg-blue-700 px-4 py-2 text-white">
          Добавить
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Код обучающегося, тема или элемент (badge, points…)"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded border bg-white px-4 py-2">Найти</button>
      </form>

      {items.length === 0 ? (
        <p className="text-gray-600">Ничего не найдено.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((s) => (
            <li key={s.id} className="rounded border bg-white p-4">
              <Link href={`/sessions/${s.id}`} className="font-semibold hover:underline">
                {s.session_code} — {s.course_topic}
              </Link>
              <p className="text-sm text-gray-600">
                {s.student_code} · {ELEMENT_LABELS[s.gamification_element]} · вовлечённость{" "}
                {s.engagement_score.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between">
        {current > 1 ? <Link href={link(current - 1)}>← Назад</Link> : <span />}
        {items.length === PAGE_SIZE && <Link href={link(current + 1)}>Далее →</Link>}
      </div>
    </section>
  );
}
