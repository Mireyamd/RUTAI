"""Pydantic schemas for barrier reports.

Reports intentionally do not collect personal data.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

BarrierReportCategory = Literal[
    "signage_missing",
    "audio_not_working",
    "unclear_route",
    "needed_assistance",
    "other",
]

BarrierReportStatus = Literal["open", "reviewing", "resolved", "dismissed"]


class BarrierReportCreate(BaseModel):
    """Input contract for an anonymous barrier report."""

    model_config = ConfigDict(extra="forbid")

    station_id: str = Field(..., min_length=1)
    category: BarrierReportCategory
    description: str | None = Field(default=None, max_length=1000)
    created_at: datetime | None = None


class BarrierReportResponse(BaseModel):
    """Public response for a barrier report."""

    id: str
    station_id: str
    category: BarrierReportCategory
    description: str | None
    status: BarrierReportStatus
    created_at: datetime
