from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from backend.app.db.models import TargetType, ScanStatus

class ScanBase(BaseModel):
    targetType: TargetType = Field(..., description="Target scan type (ROOM or OBJECT)")
    rawMediaUrl: str = Field(..., description="S3 file path to the uploaded raw media")

class ScanCreate(ScanBase):
    scanId: Optional[str] = Field(None, description="Optional custom scan UUID")

class ScanResponse(ScanBase):
    id: str
    userId: str
    targetId: Optional[str] = None
    status: ScanStatus
    createdAt: datetime

    class Config:
        from_attributes = True
