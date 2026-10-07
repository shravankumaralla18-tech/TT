"""Run a prediction on a single image.

CLI (from ai-model/):  python prediction/predict.py path/to/leaf.jpg
"""
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from prediction.model_loader import load_model_and_classes  # noqa: E402
from preprocessing.image_preprocessing import preprocess_bytes  # noqa: E402


def predict_image_bytes(content: bytes, top_k: int = 3) -> dict:
    model, classes = load_model_and_classes()
    batch = np.expand_dims(preprocess_bytes(content), axis=0)
    probs = model.predict(batch, verbose=0)[0]
    order = np.argsort(probs)[::-1][:top_k]
    return {
        "class_name": classes[int(order[0])],
        "confidence": float(probs[order[0]]),
        "top_predictions": [{"label": classes[int(i)], "confidence": float(probs[i])} for i in order],
    }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: python prediction/predict.py <image_path>")
    result = predict_image_bytes(Path(sys.argv[1]).read_bytes())
    print(f"{result['class_name']}  ({result['confidence']:.1%})")
    for p in result["top_predictions"]:
        print(f"  {p['label']}: {p['confidence']:.1%}")
