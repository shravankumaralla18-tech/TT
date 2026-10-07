"""Evaluate the trained model on dataset/test and write a confusion matrix.

Usage (from ai-model/):  python training/evaluate.py
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from preprocessing.image_preprocessing import IMG_SIZE  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--test-dir", type=Path, default=ROOT / "dataset" / "test")
    ap.add_argument("--batch-size", type=int, default=32)
    a = ap.parse_args()

    model = tf.keras.models.load_model(ROOT / "models" / "crop_disease_model.keras")
    classes = json.loads((ROOT / "models" / "class_names.json").read_text())

    ds = tf.keras.utils.image_dataset_from_directory(
        a.test_dir, image_size=IMG_SIZE, batch_size=a.batch_size, shuffle=False, label_mode="int", class_names=classes
    )
    y_true = np.concatenate([y.numpy() for _, y in ds])
    y_pred = np.argmax(model.predict(ds), axis=1)

    print(classification_report(y_true, y_pred, target_names=classes, digits=3))

    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(10, 9))
    ax.imshow(cm, cmap="Greens")
    ax.set_xticks(range(len(classes)), classes, rotation=90, fontsize=6)
    ax.set_yticks(range(len(classes)), classes, fontsize=6)
    ax.set_xlabel("Predicted")
    ax.set_ylabel("Actual")
    fig.tight_layout()
    out = ROOT / "models" / "confusion_matrix.png"
    fig.savefig(out, dpi=150)
    print(f"Confusion matrix saved to {out}")


if __name__ == "__main__":
    main()
