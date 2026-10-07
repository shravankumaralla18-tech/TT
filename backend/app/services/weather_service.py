import httpx

API = "https://api.open-meteo.com/v1/forecast"


async def get_weather(lat: float, lon: float) -> dict | None:
    """Current conditions and a 5-day forecast from Open-Meteo (no API key). Returns None on failure."""
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
        "forecast_days": 5,
        "timezone": "auto",
    }
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            res = await client.get(API, params=params)
            res.raise_for_status()
            data = res.json()
    except (httpx.HTTPError, ValueError):
        return None
    daily = data.get("daily", {})
    forecast = [
        {"date": d, "temp_max": hi, "temp_min": lo, "rain_mm": rain}
        for d, hi, lo, rain in zip(
            daily.get("time", []),
            daily.get("temperature_2m_max", []),
            daily.get("temperature_2m_min", []),
            daily.get("precipitation_sum", []),
        )
    ]
    current = data.get("current", {})
    return {
        "temperature": current.get("temperature_2m"),
        "humidity": current.get("relative_humidity_2m"),
        "forecast": forecast,
    }
