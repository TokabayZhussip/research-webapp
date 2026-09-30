from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

GameElement = Literal["points", "badge", "leaderboard", "challenge", "progress_bar", "feedback"]
Strategy = Literal["none", "static", "adaptive_rl"]


class InterventionBase(BaseModel):
    learner_code: str = Field(min_length=2, max_length=50)
    game_element: GameElement
    strategy: Strategy
    engagement_before: float = Field(ge=0, le=1)
    engagement_after: float | None = Field(default=None, ge=0, le=1)
    quiz_score: float | None = Field(default=None, ge=0, le=100)
    exposure_count: int = Field(default=0, ge=0)
    note: str | None = Field(default=None, max_length=2000)


class InterventionCreate(InterventionBase):
    pass


class InterventionUpdate(BaseModel):
    learner_code: str | None = Field(default=None, min_length=2, max_length=50)
    game_element: GameElement | None = None
    strategy: Strategy | None = None
    engagement_before: float | None = Field(default=None, ge=0, le=1)
    engagement_after: float | None = Field(default=None, ge=0, le=1)
    quiz_score: float | None = Field(default=None, ge=0, le=100)
    exposure_count: int | None = Field(default=None, ge=0)
    note: str | None = Field(default=None, max_length=2000)


class InterventionOut(InterventionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime