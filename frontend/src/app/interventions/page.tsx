import Link from "next/link";
import { api } from "@/lib/api";

const PAGE_SIZE = 20;

function formatDelta(before: number, after: number | null) {
  if (after === null) return null;
  const d = after - before;
  return { text: `${d >= 0 ? "+" : ""}${d.toFixed(2)}`, positive: d >= 0 };
}

export default async function InterventionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const items = await api.list(q, current, PAGE_SIZE);

  const link = (p: number) =>
    `/interventions?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Вмешательства</h1>
        <Link href="/interventions/new" className="rounded bg-blue-700 px-4 py-2 text-white">
          Добавить
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Поиск: код студента, элемент или стратегия"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded border bg-white px-4 py-2">Найти</button>
      </form>

      {items.length === 0 ? (
        <p className="text-gray-600">Ничего не найдено.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((i) => {
            const delta = formatDelta(i.engagement_before, i.engagement_after);
            return (
              <li key={i.id} className="rounded border bg-white p-4">
                <Link href={`/interventions/${i.id}`} className="font-semibold hover:underline">
                  {i.learner_code} · {i.game_element}
                </Link>
                <p className="text-sm text-gray-600">
                  Стратегия: {i.strategy} · показ №{i.exposure_count} · вовлечённость{" "}
                  {i.engagement_before.toFixed(2)}
                  {i.engagement_after !== null && ` → ${i.engagement_after.toFixed(2)}`}
                  {delta && (
                    <span className={delta.positive ? "text-green-700" : "text-red-700"}>
                      {" "}
                      ({delta.text})
                    </span>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex justify-between">
        {current > 1 ? <Link href={link(current - 1)}>← Назад</Link> : <span />}
        {items.length === PAGE_SIZE && <Link href={link(current + 1)}>Далее →</Link>}
      </div>
    </section>
  );
}