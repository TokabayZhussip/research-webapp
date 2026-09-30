from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Intervention(Base):
    __tablename__ = "interventions"
    __table_args__ = (
        UniqueConstraint(
            "learner_code", "game_element", "exposure_count", name="uq_learner_element_exposure"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    learner_code: Mapped[str] = mapped_column(String(50), index=True)
    game_element: Mapped[str] = mapped_column(String(50), index=True)
    strategy: Mapped[str] = mapped_column(String(30), index=True)
    engagement_before: Mapped[float] = mapped_column(Float)
    engagement_after: Mapped[float | None] = mapped_column(Float)
    quiz_score: Mapped[float | None] = mapped_column(Float)
    exposure_count: Mapped[int] = mapped_column(Integer, default=0)
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )