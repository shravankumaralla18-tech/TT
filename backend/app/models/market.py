from pydantic import BaseModel


class MarketRecord(BaseModel):
    crop_id: str
    market: str
    region: str
    date: str
    min_price: float
    max_price: float
    modal_price: float
