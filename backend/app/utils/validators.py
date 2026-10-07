import io

from fastapi import HTTPException
from PIL import Image, UnidentifiedImageError

from app.config import settings

ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


def validate_image_upload(content: bytes, content_type: str | None) -> str:
    """Validate an uploaded leaf photo. Returns the file extension to store it with."""
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(415, "Upload a JPG, PNG or WebP image.")
    if len(content) == 0:
        raise HTTPException(400, "The uploaded file is empty.")
    if len(content) > settings.MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(413, f"Image is larger than {settings.MAX_UPLOAD_MB} MB.")
    try:
        Image.open(io.BytesIO(content)).verify()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(400, "The file is not a valid image.")
    return ALLOWED_TYPES[content_type]
