from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class LearningSession(Base):
    __tablename__ = "learning_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_code: Mapped[str] = mapped_column(String(50), unique=True)
    student_code: Mapped[str] = mapped_column(String(50), index=True)
    course_topic: Mapped[str] = mapped_column(String(200))
    gamification_element: Mapped[str] = mapped_column(String(30), index=True)
    time_on_task_min: Mapped[int] = mapped_column(Integer)
    tasks_completed: Mapped[int] = mapped_column(Integer)
    engagement_score: Mapped[float] = mapped_column(Float)
    reward: Mapped[float | None] = mapped_column(Float)
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
