import { notFound } from "next/navigation";
import { InterventionForm } from "@/components/InterventionForm";
import { api } from "@/lib/api";
import { deleteIntervention, updateIntervention } from "../actions";

export default async function InterventionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await api.get(Number(id));
  if (!item) notFound();

  const rows: [string, string][] = [
    ["Стратегия", item.strategy],
    ["Номер показа", String(item.exposure_count)],
    ["Вовлечённость до", item.engagement_before.toFixed(2)],
    ["Вовлечённость после", item.engagement_after?.toFixed(2) ?? "—"],
    ["Результат теста", item.quiz_score?.toString() ?? "—"],
    ["Создано", new Date(item.created_at).toLocaleString("ru-RU")],
  ];

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">
          {item.learner_code} · {item.game_element}
        </h1>
      </header>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded border bg-white p-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b py-1">
            <dt className="text-gray-600">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      {item.note && <p className="whitespace-pre-line">{item.note}</p>}

      <details className="rounded border bg-white p-4">
        <summary className="cursor-pointer font-semibold">Редактировать</summary>
        <div className="mt-4">
          <InterventionForm action={updateIntervention.bind(null, item.id)} initial={item} />
        </div>
      </details>

      <form action={deleteIntervention.bind(null, item.id)}>
        <button className="rounded border border-red-700 px-4 py-2 text-red-700">Удалить</button>
      </form>
    </article>
  );
}