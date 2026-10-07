from collections import defaultdict
from statistics import mean

from fastapi import HTTPException

from app.utils.helpers import load_json

DISCLAIMER = "Guidance based on recent price movement only. It is not a guarantee. Check your local market and storage costs before deciding."


def _market_data() -> dict:
    return load_json("market/sample_market_data.json")


def crop_names() -> dict[str, str]:
    return {c["id"]: c["name"] for c in load_json("crops/crops.json")["crops"]}


def _ensure_crop(crop_id: str) -> str:
    names = crop_names()
    if crop_id not in names:
        raise HTTPException(404, f"Unknown crop '{crop_id}'.")
    return names[crop_id]


def get_prices(crop_id: str | None = None, region: str | None = None) -> list[dict]:
    """Latest price per market, with the change over the previous 7 days."""
    names = crop_names()
    records = [r for r in _market_data()["records"] if (not crop_id or r["crop_id"] == crop_id) and (not region or r["region"].lower() == region.lower())]
    if crop_id:
        _ensure_crop(crop_id)
    by_key = defaultdict(list)
    for r in records:
        by_key[(r["crop_id"], r["market"])].append(r)
    rows = []
    for (cid, market), items in by_key.items():
        items.sort(key=lambda r: r["date"])
        latest = items[-1]
        past = items[-8] if len(items) >= 8 else None
        change = round((latest["modal_price"] - past["modal_price"]) / past["modal_price"] * 100, 1) if past else None
        rows.append({**latest, "crop_name": names.get(cid, cid), "change_7d_pct": change})
    rows.sort(key=lambda r: (r["crop_name"], -r["modal_price"]))
    return rows


def get_trends(crop_id: str, days: int = 30) -> list[dict]:
    _ensure_crop(crop_id)
    by_date = defaultdict(list)
    for r in _market_data()["records"]:
        if r["crop_id"] == crop_id:
            by_date[r["date"]].append(r["modal_price"])
    series = [{"date": d, "price": round(mean(v), 1)} for d, v in sorted(by_date.items())]
    return series[-days:]


def get_advisory(crop_id: str) -> dict:
    name = _ensure_crop(crop_id)
    series = [p["price"] for p in get_trends(crop_id, 45)]
    if len(series) < 14:
        raise HTTPException(404, "Not enough price history for this crop yet.")
    latest = series[-1]
    avg7 = mean(series[-7:])
    avg30 = mean(series[-30:])
    prev7 = mean(series[-14:-7])
    momentum = (avg7 - prev7) / prev7 * 100

    if latest >= avg30 * 1.05:
        signal, headline = "sell", "Good time to sell"
        reason = f"Today's price is {((latest / avg30) - 1) * 100:.1f}% above the 30-day average."
    elif momentum < -3 and latest >= avg30:
        signal, headline = "sell", "Sell soon, prices are slipping"
        reason = f"The 7-day average fell {abs(momentum):.1f}% against the week before, while prices are still above the 30-day average."
    elif latest <= avg30 * 0.95:
        signal, headline = "hold", "Hold if you can store it"
        reason = f"Today's price is {((1 - latest / avg30)) * 100:.1f}% below the 30-day average."
        if momentum > 0:
            reason += " The last 7 days show a recovery."
    else:
        signal, headline = "monitor", "Watch the market"
        reason = "Price is close to its 30-day average with no strong trend."

    latest_rows = get_prices(crop_id)
    best = max(latest_rows, key=lambda r: r["modal_price"])
    data = _market_data()
    return {
        "crop_id": crop_id,
        "crop_name": name,
        "signal": signal,
        "headline": headline,
        "reason": reason,
        "latest_price": round(latest, 1),
        "avg_7d": round(avg7, 1),
        "avg_30d": round(avg30, 1),
        "momentum_pct": round(momentum, 1),
        "best_market": f"{best['market']} ({best['region']})",
        "best_market_price": best["modal_price"],
        "currency": data["currency"],
        "unit": data["unit"],
        "disclaimer": DISCLAIMER,
    }
