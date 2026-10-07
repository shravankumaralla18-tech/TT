import tensorflow as tf


def build_augmentation() -> tf.keras.Sequential:
    """Light augmentation that keeps leaf colour intact (colour carries disease signal)."""
    return tf.keras.Sequential(
        [
            tf.keras.layers.RandomFlip("horizontal_and_vertical"),
            tf.keras.layers.RandomRotation(0.15),
            tf.keras.layers.RandomZoom(0.15),
            tf.keras.layers.RandomContrast(0.1),
        ],
        name="augmentation",
    )
