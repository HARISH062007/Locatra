from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.db.session import get_db
from backend.app.db import models
from backend.app.core.security import get_current_user, CurrentUser
from backend.app.schemas.scan import ScanCreate, ScanResponse
from backend.app.schemas.job import JobStatusResponse
import uuid
from datetime import datetime

router = APIRouter()

# Simple mock process that simulates 3D reconstruction in background
async def simulate_3d_reconstruction(scan_id: str, db_session: AsyncSession):
    # This background task updates the job status gradually
    job_query = await db_session.execute(
        select(models.AIJob).where(models.AIJob.scanId == scan_id)
    )
    job = job_query.scalars().first()
    if job:
        job.status = models.ScanStatus.PROCESSING
        job.progressPct = 50
        await db_session.commit()
        
        # In a real pipeline, photogrammetry / Gaussian Splatting runs here.
        # We complete the job for the mockup.
        job.status = models.ScanStatus.COMPLETED
        job.progressPct = 100
        job.completedAt = datetime.utcnow()
        
        # Link the scan to a mock target asset
        scan_query = await db_session.execute(
            select(models.Scan).where(models.Scan.id == scan_id)
        )
        scan = scan_query.scalars().first()
        if scan:
            scan.status = models.ScanStatus.COMPLETED
            
            if scan.targetType == models.TargetType.ROOM:
                proj_query = await db_session.execute(
                    select(models.Project).where(models.Project.userId == scan.userId)
                )
                project = proj_query.scalars().first()
                if not project:
                    project = models.Project(
                        id=str(uuid.uuid4()),
                        userId=scan.userId,
                        name="My Scanned Spaces"
                    )
                    db_session.add(project)
                    await db_session.commit()
                
                new_room_id = str(uuid.uuid4())
                room = models.Room(
                    id=new_room_id,
                    projectId=project.id,
                    name=f"Living Room Twin ({scan_id[-4:]})",
                    lengthCm=520,
                    widthCm=480,
                    heightCm=270,
                    meshUrl="living_room.glb"
                )
                db_session.add(room)
                await db_session.commit()
                
                space_a = models.RoomSpace(
                    id=str(uuid.uuid4()),
                    roomId=new_room_id,
                    label="Corner A",
                    widthCm=120,
                    depthCm=120,
                    positionJson={"x": 0.4, "y": 0.0, "z": -1.2}
                )
                space_b = models.RoomSpace(
                    id=str(uuid.uuid4()),
                    roomId=new_room_id,
                    label="Wall space B",
                    widthCm=150,
                    depthCm=80,
                    positionJson={"x": 1.8, "y": 0.0, "z": 0.5}
                )
                db_session.add(space_a)
                db_session.add(space_b)
                scan.targetId = new_room_id
            
            elif scan.targetType == models.TargetType.OBJECT:
                new_obj_id = str(uuid.uuid4())
                obj = models.Object(
                    id=new_obj_id,
                    userId=scan.userId,
                    name=f"Office Chair Model ({scan_id[-4:]})",
                    category="furniture.chair",
                    heightCm=110,
                    widthCm=65,
                    depthCm=65,
                    weightKg=14,
                    material="Mesh/Plastic",
                    modelUrl="office_chair.glb"
                )
                db_session.add(obj)
                scan.targetId = new_obj_id
            
        await db_session.commit()

@router.post("/", response_model=ScanResponse, status_code=status.HTTP_201_CREATED)
async def create_scan(
    payload: ScanCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    scan_id = payload.scanId or str(uuid.uuid4())
    
    # Create scan record
    new_scan = models.Scan(
        id=scan_id,
        userId=current_user.id,
        targetType=payload.targetType,
        rawMediaUrl=payload.rawMediaUrl,
        status=models.ScanStatus.QUEUED
    )
    
    # Create AI tracking job
    job_type = (
        models.JobType.ROOM_MAPPING 
        if payload.targetType == models.TargetType.ROOM 
        else models.JobType.OBJECT_RECONSTRUCTION
    )
    new_job = models.AIJob(
        id=str(uuid.uuid4()),
        scanId=scan_id,
        jobType=job_type,
        status=models.ScanStatus.QUEUED,
        progressPct=0
    )
    
    db.add(new_scan)
    db.add(new_job)
    await db.commit()
    await db.refresh(new_scan)
    
    # Run the background processor simulator
    background_tasks.add_task(simulate_3d_reconstruction, scan_id, db)
    
    return new_scan

@router.get("/{scan_id}", response_model=ScanResponse)
async def get_scan(
    scan_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    result = await db.execute(
        select(models.Scan).where(
            models.Scan.id == scan_id,
            models.Scan.userId == current_user.id
        )
    )
    scan = result.scalars().first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found"
        )
    return scan

@router.get("/jobs/{job_id}", response_model=JobStatusResponse)
async def get_job_status(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    result = await db.execute(
        select(models.AIJob).join(models.Scan).where(
            models.AIJob.id == job_id,
            models.Scan.userId == current_user.id
        )
    )
    job = result.scalars().first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job record not found"
        )
    return job
