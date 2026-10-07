"""Train the crop disease classifier (MobileNetV2 transfer learning).

Usage (from ai-model/):
    python preprocessing/data_split.py
    python training/train.py --epochs 10 --fine-tune-epochs 5
"""
import argparse
import json
import sys
from pathlib import Path

import tensorflow as tf

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from preprocessing.image_preprocessing import IMG_SIZE  # noqa: E402
from training.augmentation import build_augmentation  # noqa: E402

MODEL_PATH = ROOT / "models" / "crop_disease_model.keras"
CLASSES_PATH = ROOT / "models" / "class_names.json"


def load_datasets(data_dir: Path, batch_size: int):
    kwargs = dict(image_size=IMG_SIZE, batch_size=batch_size, label_mode="int")
    train = tf.keras.utils.image_dataset_from_directory(data_dir / "train", shuffle=True, seed=42, **kwargs)
    val = tf.keras.utils.image_dataset_from_directory(data_dir / "val", shuffle=False, **kwargs)
    classes = train.class_names
    autotune = tf.data.AUTOTUNE
    return train.prefetch(autotune), val.prefetch(autotune), classes


def build_model(num_classes: int):
    base = tf.keras.applications.MobileNetV2(input_shape=IMG_SIZE + (3,), include_top=False, weights="imagenet")
    base.trainable = False

    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = build_augmentation()(inputs)
    x = tf.keras.layers.Rescaling(1.0 / 127.5, offset=-1)(x)  # 0-255 -> [-1, 1]
    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)
    return tf.keras.Model(inputs, outputs), base


def compile_model(model, lr):
    model.compile(
        optimizer=tf.keras.optimizers.Adam(lr),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data-dir", type=Path, default=ROOT / "dataset" / "processed")
    ap.add_argument("--epochs", type=int, default=10)
    ap.add_argument("--fine-tune-epochs", type=int, default=5)
    ap.add_argument("--batch-size", type=int, default=32)
    a = ap.parse_args()

    train_ds, val_ds, classes = load_datasets(a.data_dir, a.batch_size)
    print(f"{len(classes)} classes: {classes}")

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    CLASSES_PATH.write_text(json.dumps(classes, indent=2))

    model, base = build_model(len(classes))
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(MODEL_PATH, monitor="val_accuracy", save_best_only=True),
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=4, restore_best_weights=True),
    ]

    compile_model(model, 1e-3)
    model.fit(train_ds, validation_data=val_ds, epochs=a.epochs, callbacks=callbacks)

    if a.fine_tune_epochs > 0:
        base.trainable = True
        for layer in base.layers[:-30]:  # keep early layers frozen
            layer.trainable = False
        compile_model(model, 1e-5)
        model.fit(train_ds, validation_data=val_ds, epochs=a.fine_tune_epochs, callbacks=callbacks)

    loss, acc = model.evaluate(val_ds)
    print(f"Final validation accuracy: {acc:.3f}")
    print(f"Best model saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()
