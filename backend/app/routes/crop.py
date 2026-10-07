from fastapi import APIRouter, Depends

from app.middleware.auth_middleware import get_current_user
from app.services import advisory_service

router = APIRouter(prefix="/crops", tags=["Crops"], dependencies=[Depends(get_current_user)])


@router.get("")
async def list_crops():
    return advisory_service.list_crops()


@router.get("/{crop_id}")
async def crop_detail(crop_id: str):
    return advisory_service.get_crop(crop_id)
