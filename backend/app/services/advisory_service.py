from datetime import date

from fastapi import HTTPException

from app.services import market_service, weather_service
from app.utils.helpers import load_json

FUNGAL_CROPS_NOTE = "Warm, humid weather favours fungal leaf diseases. Scout leaves every 2-3 days and avoid overhead watering."


def list_crops() -> list[dict]:
    return load_json("crops/crops.json")["crops"]


def get_crop(crop_id: str) -> dict:
    for c in list_crops():
        if c["id"] == crop_id:
            return {**c, "details": load_json("crops/crop_details.json").get(crop_id, {})}
    raise HTTPException(404, f"Unknown crop '{crop_id}'.")


def _alerts(crop: dict, weather: dict | None) -> list[str]:
    alerts: list[str] = []
    if not weather:
        return alerts
    lo, hi = crop["ideal_temp_c"]
    temp, humidity = weather.get("temperature"), weather.get("humidity")
    if temp is not None:
        if temp > hi + 3:
            alerts.append(f"It is {temp:.0f}°C now, above the ideal {lo:.0f}-{hi:.0f}°C for {crop['name']}. Irrigate in the early morning or evening.")
        elif temp < lo - 3:
            alerts.append(f"It is {temp:.0f}°C now, below the ideal {lo:.0f}-{hi:.0f}°C for {crop['name']}. Protect young plants from cold.")
    if humidity is not None and humidity >= 80 and temp is not None and 15 <= temp <= 30 and crop["category"] in ("Vegetable", "Fruit", "Cereal"):
        alerts.append(f"Humidity is {humidity:.0f}%. " + FUNGAL_CROPS_NOTE)
    heavy = [d for d in weather.get("forecast", []) if (d.get("rain_mm") or 0) >= 20]
    if heavy:
        alerts.append(f"Heavy rain (20 mm or more) is forecast on {heavy[0]['date']}. Check drainage and delay spraying.")
    return alerts


async def get_crop_advisory(crop_id: str, lat: float | None, lon: float | None) -> dict:
    crop = get_crop(crop_id)
    details = crop.pop("details")
    weather = await weather_service.get_weather(lat, lon) if lat is not None and lon is not None else None
    market = market_service.get_advisory(crop_id)
    return {
        "crop": crop,
        "details": details,
        "weather": weather,
        "alerts": _alerts(crop, weather),
        "market_signal": market["signal"],
        "market_headline": market["headline"],
    }


def get_recommendations(month: int | None = None) -> list[dict]:
    month = month or date.today().month
    out = []
    for crop in list_crops():
        if month in crop["sowing_months"]:
            action, why = "Sow now", f"{crop['name']} is in its sowing window this month."
        elif month in crop["harvest_months"]:
            action, why = "Harvest window", f"{crop['name']} is in its usual harvest window this month."
        else:
            continue
        market = market_service.get_advisory(crop["id"])
        out.append(
            {
                "crop_id": crop["id"],
                "crop_name": crop["name"],
                "action": action,
                "reason": f"{why} {market['headline']}: {market['reason']}",
                "market_signal": market["signal"],
                "latest_price": market["latest_price"],
            }
        )
    return out
