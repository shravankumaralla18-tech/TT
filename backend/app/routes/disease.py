from fastapi import APIRouter, Depends, File, UploadFile

from app.middleware.auth_middleware import get_current_user
from app.schemas.disease_schema import DiseaseResult
from app.services import disease_service

router = APIRouter(prefix="/disease", tags=["Disease detection"])


@router.post("/detect", response_model=DiseaseResult, status_code=201)
async def detect(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    content = await file.read()
    return await disease_service.detect_disease(user["id"], content, file.content_type)


@router.get("/history", response_model=list[DiseaseResult])
async def history(user: dict = Depends(get_current_user)):
    return await disease_service.get_history(user["id"])


@router.get("/{record_id}", response_model=DiseaseResult)
async def get_one(record_id: str, user: dict = Depends(get_current_user)):
    return await disease_service.get_result(user["id"], record_id)


@router.delete("/{record_id}", status_code=204)
async def delete_one(record_id: str, user: dict = Depends(get_current_user)):
    await disease_service.delete_result(user["id"], record_id)
