export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
// Uploaded leaf photos are served from the backend root, not /api
export const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, "");
export const TOKEN_KEY = "crop_advisory_token";
export const SIGNAL_LABELS = { sell: "Sell", hold: "Hold", monitor: "Watch" };
