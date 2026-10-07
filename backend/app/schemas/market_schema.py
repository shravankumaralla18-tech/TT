from pydantic import BaseModel


class PriceRow(BaseModel):
    crop_id: str
    crop_name: str
    market: str
    region: str
    date: str
    min_price: float
    max_price: float
    modal_price: float
    change_7d_pct: float | None = None


class TrendPoint(BaseModel):
    date: str
    price: float


class MarketAdvisoryOut(BaseModel):
    crop_id: str
    crop_name: str
    signal: str
    headline: str
    reason: str
    latest_price: float
    avg_7d: float
    avg_30d: float
    momentum_pct: float
    best_market: str
    best_market_price: float
    currency: str
    unit: str
    disclaimer: str
