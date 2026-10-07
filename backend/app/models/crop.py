from pydantic import BaseModel


class Crop(BaseModel):
    id: str
    name: str
    category: str
    sowing_months: list[int]
    harvest_months: list[int]
    ideal_temp_c: list[float]
    water_need: str
    duration_days: int
