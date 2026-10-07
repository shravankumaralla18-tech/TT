import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "models" / "crop_disease_model.keras"
CLASSES_PATH = ROOT / "models" / "class_names.json"

_cache: dict = {}


def load_model_and_classes():
    """Load the Keras model once and reuse it. Raises FileNotFoundError if not trained yet."""
    if "model" not in _cache:
        if not MODEL_PATH.exists() or not CLASSES_PATH.exists():
            raise FileNotFoundError(f"Model files not found in {MODEL_PATH.parent}. Train the model first.")
        import tensorflow as tf

        _cache["model"] = tf.keras.models.load_model(MODEL_PATH)
        _cache["classes"] = json.loads(CLASSES_PATH.read_text())
    return _cache["model"], _cache["classes"]
