import Link from "next/link";

export default function NotFound() {
  return (
    <section className="space-y-4 py-16 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-600">Такой записи нет: возможно, она была удалена.</p>
      <Link href="/sessions" className="inline-block rounded bg-blue-700 px-4 py-2 text-white">
        К списку сессий
      </Link>
    </section>
  );
}
