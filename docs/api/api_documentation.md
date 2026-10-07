# API reference

Base URL: `http://localhost:8000/api`. Interactive docs: `http://localhost:8000/docs`.
All endpoints except register, login and health need the header `Authorization: Bearer <token>`.

## Auth
| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/auth/register` | `{name, email, password (8+), location?}` | user |
| POST | `/auth/login` | `{email, password}` | `{access_token, token_type, user}` |
| GET | `/auth/me` | | user |
| GET / PUT | `/users/me` | PUT: `{name?, location?, phone?}` | user |

## Disease detection
| Method | Path | Notes |
|---|---|---|
| POST | `/disease/detect` | multipart field `file` (JPG/PNG/WebP, max 8 MB). Returns result with `confidence`, `low_confidence`, `top_predictions`, `description`, `symptoms`, `treatment`, `image_url` |
| GET | `/disease/history` | Latest 50 checks for the current user |
| GET | `/disease/{id}` | One check (owner only) |
| DELETE | `/disease/{id}` | Deletes the record and photo |

Errors: 415 wrong type, 413 too large, 400 not an image, 503 model not trained or runtime missing.

## Market
| Method | Path | Query |
|---|---|---|
| GET | `/market/prices` | `crop?`, `region?`: latest price per market with 7-day change |
| GET | `/market/trends` | `crop`, `days` (7-90): daily average price |
| GET | `/market/advisory` | `crop`: `signal` is `sell`, `hold` or `monitor`, with reason, best market, averages |

Signal rules: sell if today is 5%+ above the 30-day average, or the 7-day average fell more than 3% week on week while still above the 30-day average; hold if 5%+ below the 30-day average; otherwise monitor.

## Crops and advisory
| Method | Path | Query |
|---|---|---|
| GET | `/crops` | List crops |
| GET | `/crops/{crop_id}` | Crop with growing details |
| GET | `/advisory/crop/{crop_id}` | `lat?`, `lon?`: details, weather, alerts, market signal |
| GET | `/advisory/recommendations` | `month?` (1-12, default current): crops to sow or harvest |

## Other
`GET /health` returns `{"status": "ok"}`. Uploaded photos are served from `/uploads/<file>` (not under `/api`).
