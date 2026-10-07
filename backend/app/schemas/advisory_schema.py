from pydantic import BaseModel


class WeatherDay(BaseModel):
    date: str
    temp_max: float | None = None
    temp_min: float | None = None
    rain_mm: float | None = None


class WeatherInfo(BaseModel):
    temperature: float | None = None
    humidity: float | None = None
    forecast: list[WeatherDay] = []


class CropAdvisoryOut(BaseModel):
    crop: dict
    details: dict
    weather: WeatherInfo | None = None
    alerts: list[str]
    market_signal: str | None = None
    market_headline: str | None = None


class Recommendation(BaseModel):
    crop_id: str
    crop_name: str
    action: str  # "Sow now" | "Harvest window"
    reason: str
    market_signal: str
    latest_price: float
