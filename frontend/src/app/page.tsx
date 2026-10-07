import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">GameRL Lab</h1>
      <p>
        Журнал учебных сессий для исследования адаптивной геймификации: какой игровой элемент
        получил обучающийся и как изменилась его вовлечённость. На этих данных RL-агент
        рекомендует элемент геймификации, повышающий вовлечённость конкретного обучающегося.
      </p>
      <Link href="/sessions" className="inline-block rounded bg-blue-700 px-4 py-2 text-white">
        Перейти к сессиям
      </Link>
    </section>
  );
}
