from datetime import datetime, timezone

from pydantic import BaseModel, Field


class DiseaseRecord(BaseModel):
    user_id: str
    image_url: str
    class_key: str
    confidence: float
    top_predictions: list[dict]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
