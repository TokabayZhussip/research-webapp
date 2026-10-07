import random

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from .models import LearningSession
from .schemas import ELEMENTS, SessionCreate, SessionUpdate


def list_sessions(
    db: Session, q: str | None = None, limit: int = 20, offset: int = 0
) -> list[LearningSession]:
    stmt = select(LearningSession).order_by(
        LearningSession.created_at.desc(), LearningSession.id.desc()
    )
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(
            or_(
                LearningSession.student_code.ilike(pattern),
                LearningSession.course_topic.ilike(pattern),
                LearningSession.gamification_element.ilike(pattern),
            )
        )
    return list(db.scalars(stmt.limit(limit).offset(offset)))


def get_learning_session(db: Session, session_id: int) -> LearningSession | None:
    return db.get(LearningSession, session_id)


def create_learning_session(db: Session, data: SessionCreate) -> LearningSession:
    item = LearningSession(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_learning_session(
    db: Session, item: LearningSession, data: SessionUpdate
) -> LearningSession:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_learning_session(db: Session, item: LearningSession) -> None:
    db.delete(item)
    db.commit()


def _mean_engagement(db: Session, student_code: str | None = None) -> dict[str, float]:
    stmt = select(
        LearningSession.gamification_element, func.avg(LearningSession.engagement_score)
    ).group_by(LearningSession.gamification_element)
    if student_code:
        stmt = stmt.where(LearningSession.student_code == student_code)
    return {element: float(avg) for element, avg in db.execute(stmt)}


def recommend_element(
    db: Session, student_code: str, epsilon: float = 0.1
) -> tuple[str, float | None, bool]:
    """ε-greedy бандит: с вероятностью ε — случайный элемент (исследование),
    иначе — элемент с наибольшей средней вовлечённостью (эксплуатация)."""
    if random.random() < epsilon:
        return random.choice(ELEMENTS), None, True
    means = _mean_engagement(db, student_code) or _mean_engagement(db)
    if not means:
        return random.choice(ELEMENTS), None, True
    best = max(means, key=means.__getitem__)
    return best, round(means[best], 3), False
