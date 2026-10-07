"""Split dataset/raw/<class>/*.jpg into processed/train, processed/val and test.

Usage:
    python preprocessing/data_split.py --train 0.7 --val 0.15
The remainder (default 0.15) goes to dataset/test.
"""
import argparse
import random
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "dataset"
EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def split(raw: Path, processed: Path, test: Path, train_ratio: float, val_ratio: float, seed: int) -> None:
    rng = random.Random(seed)
    for class_dir in sorted(p for p in raw.iterdir() if p.is_dir()):
        files = sorted(f for f in class_dir.iterdir() if f.suffix.lower() in EXTS)
        rng.shuffle(files)
        n_train = int(len(files) * train_ratio)
        n_val = int(len(files) * val_ratio)
        groups = {
            processed / "train" / class_dir.name: files[:n_train],
            processed / "val" / class_dir.name: files[n_train : n_train + n_val],
            test / class_dir.name: files[n_train + n_val :],
        }
        for target, items in groups.items():
            target.mkdir(parents=True, exist_ok=True)
            for f in items:
                shutil.copy2(f, target / f.name)
        print(f"{class_dir.name}: {len(files)} images")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", type=Path, default=ROOT / "raw")
    ap.add_argument("--processed", type=Path, default=ROOT / "processed")
    ap.add_argument("--test", type=Path, default=ROOT / "test")
    ap.add_argument("--train", type=float, default=0.7)
    ap.add_argument("--val", type=float, default=0.15)
    ap.add_argument("--seed", type=int, default=42)
    a = ap.parse_args()
    split(a.raw, a.processed, a.test, a.train, a.val, a.seed)
