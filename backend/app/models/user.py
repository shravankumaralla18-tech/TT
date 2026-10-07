from datetime import datetime, timezone

from pydantic import BaseModel, Field


class UserInDB(BaseModel):
    name: str
    email: str
    hashed_password: str
    location: str | None = None
    phone: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
