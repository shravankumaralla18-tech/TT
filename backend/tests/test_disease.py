import io

import pytest
from fastapi import HTTPException
from PIL import Image

from app.services.disease_service import build_result
from app.utils.validators import validate_image_upload


def _png_bytes():
    buf = io.BytesIO()
    Image.new("RGB", (8, 8), "green").save(buf, format="PNG")
    return buf.getvalue()


def test_validate_accepts_png():
    assert validate_image_upload(_png_bytes(), "image/png") == ".png"


def test_validate_rejects_bad_type_and_garbage():
    with pytest.raises(HTTPException) as e:
        validate_image_upload(b"x", "text/plain")
    assert e.value.status_code == 415
    with pytest.raises(HTTPException) as e:
        validate_image_upload(b"not an image", "image/png")
    assert e.value.status_code == 400


def test_build_result_merges_info_and_flags_low_confidence():
    record = {
        "_id": "1",
        "class_key": "Tomato___Late_blight",
        "confidence": 0.41,
        "top_predictions": [{"label": "Tomato___Late_blight", "confidence": 0.41}],
        "image_url": "/uploads/x.jpg",
        "created_at": "2026-01-01T00:00:00Z",
    }
    result = build_result(record)
    assert result["disease"] == "Late blight"
    assert result["low_confidence"] is True
    assert result["treatment"]["preventive"]
