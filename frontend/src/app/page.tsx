import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">GamifyLab</h1>
      <p>
        Журнал игровых вмешательств и мониторинг вовлечённости студентов. Каждая запись
        фиксирует, какой игровой элемент был показан студенту, по какой стратегии (без
        геймификации, статическая или адаптивная на основе обучения с подкреплением) и как
        изменились вовлечённость и результат обучения.
      </p>
      <p className="text-sm text-gray-600">
        Прототип к диссертации «Модели и методы адаптивной геймификации образовательной
        платформы на основе обучения с подкреплением», ЕНУ им. Л.Н. Гумилёва.
      </p>
      <Link
        href="/interventions"
        className="inline-block rounded bg-blue-700 px-4 py-2 text-white"
      >
        Перейти к журналу
      </Link>
    </section>
  );
}