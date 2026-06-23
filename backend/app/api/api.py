from fastapi import APIRouter
from backend.app.api.endpoints import scans, recommendations

api_router = APIRouter()

api_router.include_router(
    scans.router,
    prefix="/scans",
    tags=["scans"]
)

api_router.include_router(
    recommendations.router,
    prefix="/recommendations",
    tags=["recommendations"]
)
