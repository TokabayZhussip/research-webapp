from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_session

from . import service
from .models import Intervention
from .schemas import InterventionCreate, InterventionOut, InterventionUpdate

router = APIRouter(prefix="/interventions", tags=["interventions"])

CONFLICT_MSG = "Record for this learner, game element and exposure count already exists"


def get_or_404(item_id: int, session: Session = Depends(get_session)) -> Intervention:
    item = service.get_intervention(session, item_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Intervention not found")
    return item


@router.get("", response_model=list[InterventionOut])
def list_interventions(
    q: str | None = Query(default=None, max_length=200),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_session),
):
    return service.list_interventions(session, q, limit, offset)


@router.get("/{item_id}", response_model=InterventionOut)
def read_intervention(item: Intervention = Depends(get_or_404)):
    return item


@router.post("", response_model=InterventionOut, status_code=status.HTTP_201_CREATED)
def create_intervention(data: InterventionCreate, session: Session = Depends(get_session)):
    try:
        return service.create_intervention(session, data)
    except IntegrityError:
        session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, CONFLICT_MSG)


@router.patch("/{item_id}", response_model=InterventionOut)
def update_intervention(
    data: InterventionUpdate,
    item: Intervention = Depends(get_or_404),
    session: Session = Depends(get_session),
):
    try:
        return service.update_intervention(session, item, data)
    except IntegrityError:
        session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, CONFLICT_MSG)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_intervention(
    item: Intervention = Depends(get_or_404), session: Session = Depends(get_session)
) -> None:
    service.delete_intervention(session, item)