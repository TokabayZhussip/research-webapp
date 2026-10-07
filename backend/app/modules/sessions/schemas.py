from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Element = Literal["points", "badge", "leaderboard", "progress_bar", "challenge"]
ELEMENTS: tuple[str, ...] = ("points", "badge", "leaderboard", "progress_bar", "challenge")


class SessionBase(BaseModel):
    session_code: str = Field(min_length=3, max_length=50)
    student_code: str = Field(min_length=2, max_length=50)
    course_topic: str = Field(min_length=2, max_length=200)
    gamification_element: Element
    time_on_task_min: int = Field(ge=0, le=600)
    tasks_completed: int = Field(ge=0, le=1000)
    engagement_score: float = Field(ge=0, le=1)
    reward: float | None = None
    notes: str | None = None


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    session_code: str | None = Field(default=None, min_length=3, max_length=50)
    student_code: str | None = Field(default=None, min_length=2, max_length=50)
    course_topic: str | None = Field(default=None, min_length=2, max_length=200)
    gamification_element: Element | None = None
    time_on_task_min: int | None = Field(default=None, ge=0, le=600)
    tasks_completed: int | None = Field(default=None, ge=0, le=1000)
    engagement_score: float | None = Field(default=None, ge=0, le=1)
    reward: float | None = None
    notes: str | None = None


class SessionOut(SessionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class Recommendation(BaseModel):
    student_code: str
    element: Element
    expected_engagement: float | None
    explored: bool
