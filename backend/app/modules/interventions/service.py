from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from .models import Intervention
from .schemas import InterventionCreate, InterventionUpdate


def list_interventions(
    session: Session, q: str | None = None, limit: int = 20, offset: int = 0
) -> list[Intervention]:
    stmt = select(Intervention).order_by(Intervention.id.desc())
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(
            or_(
                Intervention.learner_code.ilike(pattern),
                Intervention.game_element.ilike(pattern),
                Intervention.strategy.ilike(pattern),
            )
        )
    return list(session.scalars(stmt.limit(limit).offset(offset)))


def get_intervention(session: Session, item_id: int) -> Intervention | None:
    return session.get(Intervention, item_id)


def create_intervention(session: Session, data: InterventionCreate) -> Intervention:
    item = Intervention(**data.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def update_intervention(
    session: Session, item: Intervention, data: InterventionUpdate
) -> Intervention:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    session.commit()
    session.refresh(item)
    return item


def delete_intervention(session: Session, item: Intervention) -> None:
    session.delete(item)
    session.commit()