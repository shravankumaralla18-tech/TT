from fastapi import APIRouter, Depends, Query

from app.middleware.auth_middleware import get_current_user
from app.schemas.advisory_schema import CropAdvisoryOut, Recommendation
from app.services import advisory_service

router = APIRouter(prefix="/advisory", tags=["Advisory"], dependencies=[Depends(get_current_user)])


@router.get("/crop/{crop_id}", response_model=CropAdvisoryOut)
async def crop_advisory(crop_id: str, lat: float | None = Query(None, ge=-90, le=90), lon: float | None = Query(None, ge=-180, le=180)):
    return await advisory_service.get_crop_advisory(crop_id, lat, lon)


@router.get("/recommendations", response_model=list[Recommendation])
async def recommendations(month: int | None = Query(None, ge=1, le=12)):
    return advisory_service.get_recommendations(month)
