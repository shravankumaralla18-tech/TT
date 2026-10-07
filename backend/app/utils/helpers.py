import json
from functools import lru_cache
from pathlib import Path

from app.config import settings


@lru_cache(maxsize=None)
def load_json(relative_path: str):
    """Read a JSON file from the shared /data folder (cached)."""
    with open(Path(settings.DATA_DIR) / relative_path, encoding="utf-8") as f:
        return json.load(f)


def public_user(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "email": doc["email"],
        "location": doc.get("location"),
        "phone": doc.get("phone"),
        "created_at": doc["created_at"],
    }


def parse_class_name(key: str) -> tuple[str, str, bool]:
    """'Tomato___Early_blight' -> ('Tomato', 'Early blight', False)."""

    def clean(s: str) -> str:
        return " ".join(s.replace("_", " ").split())

    crop_raw, _, disease_raw = key.partition("___")
    disease = clean(disease_raw) or "Unknown"
    return clean(crop_raw), disease, disease.lower() == "healthy"
