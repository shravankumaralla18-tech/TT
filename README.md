# AI Crop Disease & Market Advisory

Farmers upload a leaf photo to identify crop disease, get treatment guidance, and see whether to sell or hold a crop based on recent market prices.

| Part | Stack |
|---|---|
| `frontend/` | React 18, Vite, React Router, Axios, Recharts |
| `backend/` | FastAPI, MongoDB (Motor), JWT auth |
| `ai-model/` | TensorFlow/Keras, MobileNetV2 transfer learning |
| `data/` | JSON for crops, diseases, treatments and sample market prices |

## Quick start

You need Python 3.10+, Node 18+ and a running MongoDB (local or Atlas).

```bash
# 1. Model (see ai-model/README.md for the dataset layout)
cd ai-model && pip install -r requirements.txt
python preprocessing/data_split.py
python training/train.py

# 2. Backend
cd ../backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# edit .env: set SECRET_KEY and MONGODB_URI
uvicorn app.main:app --reload          # http://localhost:8000/docs

# 3. Frontend
cd ../frontend
npm install
npm run dev                            # http://localhost:5173
```

Run backend tests with `pytest` from `backend/` (they do not need MongoDB or a trained model).

## Notes

- Until you train the model, `POST /api/disease/detect` returns 503 with a message saying so. Everything else works.
- Market prices in `data/market/sample_market_data.json` are **synthetic** (INR per quintal). Replace `market_service.py`'s loader with a real price feed for production.
- Sowing and harvest months in `data/crops/crops.json` are indicative. Adjust them for your climate.
- Treatment text in `data/diseases/treatment.json` is general guidance and deliberately gives no pesticide doses. Always follow the product label and local agriculture office advice.
- Add an entry to `disease_information.json` and `treatment.json` for every class you train.
- Weather alerts use the free Open-Meteo API (no key needed).
