import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameRL Lab",
  description: "Адаптивная геймификация на основе обучения с подкреплением",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-4xl flex-wrap gap-6 p-4">
            <Link href="/" className="font-semibold">GameRL Lab</Link>
            <Link href="/sessions">Сессии</Link>
            <Link href="/sessions/new">Добавить</Link>
            <Link href="/recommend">Рекомендация</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl p-4 sm:p-8">{children}</main>
      </body>
    </html>
  );
}
