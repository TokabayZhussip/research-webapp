import { SessionForm } from "@/components/SessionForm";
import { createSession } from "../actions";

export default function NewSessionPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Новая учебная сессия</h1>
      <SessionForm action={createSession} />
    </section>
  );
}
