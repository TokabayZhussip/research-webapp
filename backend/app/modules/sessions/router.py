from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_session

from . import service
from .models import LearningSession
from .schemas import Recommendation, SessionCreate, SessionOut, SessionUpdate

router = APIRouter(prefix="/sessions", tags=["sessions"])

DUPLICATE = "Learning session with this session_code exists"


def get_or_404(session_id: int, db: Session = Depends(get_session)) -> LearningSession:
    item = service.get_learning_session(db, session_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Learning session not found")
    return item


@router.get("", response_model=list[SessionOut])
def list_sessions(
    q: str | None = Query(default=None, max_length=200),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_session),
):
    return service.list_sessions(db, q, limit, offset)


# Объявлен ВЫШЕ /{session_id}, иначе слово recommend примут за id
@router.get("/recommend", response_model=Recommendation)
def recommend(
    student_code: str = Query(min_length=2, max_length=50),
    epsilon: float = Query(default=0.1, ge=0, le=1),
    db: Session = Depends(get_session),
):
    element, expected, explored = service.recommend_element(db, student_code, epsilon)
    return Recommendation(
        student_code=student_code,
        element=element,
        expected_engagement=expected,
        explored=explored,
    )


@router.get("/{session_id}", response_model=SessionOut)
def read_session(item: LearningSession = Depends(get_or_404)):
    return item


@router.post("", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
def create_session(data: SessionCreate, db: Session = Depends(get_session)):
    try:
        return service.create_learning_session(db, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, DUPLICATE)


@router.patch("/{session_id}", response_model=SessionOut)
def update_session(
    data: SessionUpdate,
    item: LearningSession = Depends(get_or_404),
    db: Session = Depends(get_session),
):
    try:
        return service.update_learning_session(db, item, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, DUPLICATE)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    item: LearningSession = Depends(get_or_404), db: Session = Depends(get_session)
) -> None:
    service.delete_learning_session(db, item)
