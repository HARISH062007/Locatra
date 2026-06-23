from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.db.session import get_db
from backend.app.db import models
from backend.app.core.security import get_current_user, CurrentUser
from backend.app.schemas.recommendation import (
    RecommendPlacementRequest, RecommendPlacementResponse, 
    PlacementRecommendationDetail, PlacementConfirmRequest
)
import uuid

router = APIRouter()

@router.post("/recommend-placement", response_model=RecommendPlacementResponse)
async def generate_recommendations(
    payload: RecommendPlacementRequest,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    # Verify object exists and is owned by the user
    object_query = await db.execute(
        select(models.Object).where(
            models.Object.id == payload.objectId,
            models.Object.userId == current_user.id
        )
    )
    obj = object_query.scalars().first()
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Object {payload.objectId} not found"
        )

    # Verify room exists and belongs to a project owned by the user
    room_query = await db.execute(
        select(models.Room).join(models.Project).where(
            models.Room.id == payload.roomId,
            models.Project.userId == current_user.id
        )
    )
    room = room_query.scalars().first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Room {payload.roomId} not found"
        )

    # In a real environment, the Spatial Understanding and Placement Scoring 
    # algorithms segment the room mesh and compute accessibility clearances.
    # We output a mocked recommendation matching the scoring model.
    job_id = str(uuid.uuid4())
    
    return RecommendPlacementResponse(
        jobId=job_id,
        status="completed",
        recommendedPlacement=PlacementRecommendationDetail(
            spaceLabel="Corner A",
            confidence=0.91,
            reasons=[
                "Fits within available dimensions with 10cm clearance",
                "Maintains main walking path",
                "Matches user's wall-adjacent storage preference"
            ]
        ),
        alternatives=[
            {
                "spaceLabel": "Wall space B",
                "confidence": 0.74,
                "reasons": ["Fits boundary constraints but reduces window exposure"]
            }
        ]
    )

@router.post("/confirm", status_code=status.HTTP_201_CREATED)
async def confirm_placement(
    payload: PlacementConfirmRequest,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    # Verify the target object & room exist and belong to the user
    object_query = await db.execute(
        select(models.Object).where(
            models.Object.id == payload.objectId,
            models.Object.userId == current_user.id
        )
    )
    obj = object_query.scalars().first()
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Object not found"
        )

    room_query = await db.execute(
        select(models.Room).join(models.Project).where(
            models.Room.id == payload.roomId,
            models.Project.userId == current_user.id
        )
    )
    room = room_query.scalars().first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )

    # Save placement
    new_placement = models.Placement(
        id=str(uuid.uuid4()),
        recommendationId=payload.recommendationId,
        objectId=payload.objectId,
        roomId=payload.roomId,
        positionJson=payload.positionJson
    )
    
    db.add(new_placement)
    await db.commit()
    return {"status": "success", "placementId": new_placement.id}
