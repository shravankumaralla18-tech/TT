from fastapi import APIRouter, Depends

from app.middleware.auth_middleware import get_current_user
from app.schemas.user_schema import Token, UserCreate, UserLogin, UserOut
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=201)
async def register(payload: UserCreate):
    return await auth_service.register_user(payload)


@router.post("/login", response_model=Token)
async def login(payload: UserLogin):
    return await auth_service.login_user(payload)


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return user
