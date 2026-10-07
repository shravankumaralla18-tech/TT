from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app import database
from app.utils.helpers import public_user
from app.utils.security import decode_access_token

bearer = HTTPBearer(auto_error=False)


async def get_current_user(creds: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
    unauthorized = HTTPException(401, "Please log in again.", headers={"WWW-Authenticate": "Bearer"})
    if creds is None:
        raise unauthorized
    user_id = decode_access_token(creds.credentials)
    if not user_id:
        raise unauthorized
    try:
        doc = await database.get_db().users.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise unauthorized
    if not doc:
        raise unauthorized
    return public_user(doc)
