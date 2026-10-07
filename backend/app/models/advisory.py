from pydantic import BaseModel


class AdvisoryRecord(BaseModel):
    crop_id: str
    signal: str  # sell | hold | monitor
    reason: str
