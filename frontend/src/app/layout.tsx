import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GamifyLab",
  description: "Adaptive gamification: engagement monitoring and intervention log",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-4xl flex-wrap gap-6 p-4">
            <Link href="/" className="font-semibold">
              GamifyLab
            </Link>
            <Link href="/interventions">Вмешательства</Link>
            <Link href="/interventions/new">Добавить</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl p-4 sm:p-8">{children}</main>
      </body>
    </html>
  );
}