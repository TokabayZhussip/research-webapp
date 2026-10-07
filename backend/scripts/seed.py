"""Наполняет БД синтетическими учебными сессиями (реальных данных студентов нет)."""

import random

from sqlalchemy import func, select

from app.db import SessionLocal
from app.modules.sessions.models import LearningSession

ELEMENTS = ["points", "badge", "leaderboard", "progress_bar", "challenge"]
TOPICS = ["Алгоритмы", "Базы данных", "Python", "Дискретная математика", "Компьютерные сети"]


def main() -> None:
    rng = random.Random(42)
    with SessionLocal() as db:
        if db.scalar(select(func.count()).select_from(LearningSession)):
            print("В базе уже есть данные, seed пропущен")
            return
        for s in range(1, 11):
            student = f"S-{s:03d}"
            favorite = rng.choice(ELEMENTS)  # скрытое предпочтение — его должен найти агент
            for k in range(1, 5):
                element = rng.choice(ELEMENTS)
                base = 0.75 if element == favorite else 0.45
                engagement = round(min(1.0, max(0.0, rng.gauss(base, 0.1))), 2)
                db.add(
                    LearningSession(
                        session_code=f"{student}-{k:02d}",
                        student_code=student,
                        course_topic=rng.choice(TOPICS),
                        gamification_element=element,
                        time_on_task_min=int(10 + 60 * engagement + rng.randint(0, 10)),
                        tasks_completed=int(engagement * 8),
                        engagement_score=engagement,
                        reward=round(engagement - 0.5, 2),
                    )
                )
        db.commit()
        print("Добавлено 40 синтетических сессий")


if __name__ == "__main__":
    main()
