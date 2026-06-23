from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RecommendPlacementRequest(BaseModel):
    objectId: str = Field(..., description="UUID of the digitized 3D object")
    roomId: str = Field(..., description="UUID of the room twin model")

class PlacementRecommendationDetail(BaseModel):
    spaceLabel: str = Field(..., description="Label of the free space (e.g. Corner A)")
    confidence: float = Field(..., description="AI confidence score, between 0.00 and 1.00", ge=0.0, le=1.0)
    reasons: List[str] = Field(..., description="Plain-language explaining factors")

class RecommendPlacementResponse(BaseModel):
    jobId: str
    status: str
    recommendedPlacement: Optional[PlacementRecommendationDetail] = None
    alternatives: List[dict] = Field([], description="Ranked alternative placement options")

class PlacementConfirmRequest(BaseModel):
    recommendationId: Optional[str] = None
    objectId: str
    roomId: str
    positionJson: dict = Field(..., description="Final 3D position, rotation and scale matrix")
