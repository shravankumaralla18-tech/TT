import pytest
from fastapi import HTTPException

from app.services import advisory_service, market_service


def test_prices_cover_all_markets_for_crop():
    rows = market_service.get_prices("tomato")
    assert len(rows) == 4
    assert all(r["crop_id"] == "tomato" for r in rows)


def test_trends_length_and_order():
    series = market_service.get_trends("potato", 30)
    assert len(series) == 30
    assert [p["date"] for p in series] == sorted(p["date"] for p in series)


def test_advisory_has_valid_signal():
    adv = market_service.get_advisory("wheat")
    assert adv["signal"] in {"sell", "hold", "monitor"}
    assert adv["reason"]


def test_unknown_crop_is_404():
    with pytest.raises(HTTPException) as e:
        market_service.get_trends("banana")
    assert e.value.status_code == 404


def test_recommendations_for_october_include_wheat():
    ids = {r["crop_id"] for r in advisory_service.get_recommendations(10)}
    assert "wheat" in ids
