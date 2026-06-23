from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from backend.app.db.models import JobType, ScanStatus

class JobBase(BaseModel):
    scanId: str
    jobType: JobType

class JobStatusResponse(BaseModel):
    jobId: str
    scanId: str
    jobType: JobType
    status: ScanStatus
    progressPct: int = Field(..., ge=0, le=100)
    errorMessage: Optional[str] = None
    startedAt: datetime
    completedAt: Optional[datetime] = None

    class Config:
        from_attributes = True
