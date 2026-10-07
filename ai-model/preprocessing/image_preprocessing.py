"""Shared image loading so training and inference see identical inputs.

The model contains its own Rescaling layer, so images are returned as
float32 values in the 0-255 range (not normalised here).
"""
import io

import numpy as np
from PIL import Image

IMG_SIZE = (224, 224)


def preprocess_pil(image: Image.Image) -> np.ndarray:
    image = image.convert("RGB").resize(IMG_SIZE, Image.BILINEAR)
    return np.asarray(image, dtype=np.float32)


def preprocess_bytes(content: bytes) -> np.ndarray:
    return preprocess_pil(Image.open(io.BytesIO(content)))


def preprocess_path(path: str) -> np.ndarray:
    return preprocess_pil(Image.open(path))
