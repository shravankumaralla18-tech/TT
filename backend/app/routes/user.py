from bson import ObjectId
from fastapi import APIRouter, Depends

from app import database
from app.middleware.auth_middleware import get_current_user
from app.schemas.user_schema import UserOut, UserUpdate
from app.utils.helpers import public_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
async def get_profile(user: dict = Depends(get_current_user)):
    return user


@router.put("/me", response_model=UserOut)
async def update_profile(payload: UserUpdate, user: dict = Depends(get_current_user)):
    changes = payload.model_dump(exclude_unset=True)
    db = database.get_db()
    if changes:
        await db.users.update_one({"_id": ObjectId(user["id"])}, {"$set": changes})
    return public_user(await db.users.find_one({"_id": ObjectId(user["id"])}))
