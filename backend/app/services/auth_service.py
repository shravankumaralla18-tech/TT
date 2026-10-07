from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError

from app import database
from app.models.user import UserInDB
from app.schemas.user_schema import UserCreate, UserLogin
from app.utils.helpers import public_user
from app.utils.security import create_access_token, hash_password, verify_password


async def register_user(data: UserCreate) -> dict:
    db = database.get_db()
    doc = UserInDB(
        name=data.name.strip(),
        email=data.email.lower(),
        hashed_password=hash_password(data.password),
        location=data.location,
    ).model_dump()
    try:
        result = await db.users.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(409, "An account with this email already exists.")
    doc["_id"] = result.inserted_id
    return public_user(doc)


async def login_user(data: UserLogin) -> dict:
    db = database.get_db()
    doc = await db.users.find_one({"email": data.email.lower()})
    if not doc or not verify_password(data.password, doc["hashed_password"]):
        raise HTTPException(401, "Email or password is incorrect.")
    user = public_user(doc)
    return {"access_token": create_access_token(user["id"]), "token_type": "bearer", "user": user}
