import { api } from "@/lib/api";
import { ELEMENT_LABELS } from "@/lib/types";

export default async function RecommendPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const { student } = await searchParams;
  const rec = student ? await api.recommend(student) : null;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Рекомендация RL-агента</h1>
      <p className="text-gray-700">
        ε-greedy агент выбирает элемент геймификации с наибольшей средней вовлечённостью
        обучающегося, а с вероятностью ε пробует случайный элемент (исследование).
      </p>

      <form className="flex gap-2">
        <input name="student" defaultValue={student} required minLength={2}
          placeholder="Код обучающегося, например S-001"
          className="flex-1 rounded border px-3 py-2" />
        <button className="rounded bg-blue-700 px-4 py-2 text-white">Получить</button>
      </form>

      {rec && (
        <div className="space-y-1 rounded border bg-white p-4">
          <p>Обучающийся: <b>{rec.student_code}</b></p>
          <p>Показать: <b>{ELEMENT_LABELS[rec.element]}</b></p>
          <p className="text-gray-600">
            {rec.explored
              ? "Режим исследования: элемент выбран случайно"
              : `Ожидаемая вовлечённость: ${rec.expected_engagement}`}
          </p>
        </div>
      )}
    </section>
  );
}
