import api from "./api";

export const getPrices = (params = {}) => api.get("/market/prices", { params }).then((r) => r.data);
export const getTrends = (crop, days = 30) => api.get("/market/trends", { params: { crop, days } }).then((r) => r.data);
export const getMarketAdvisory = (crop) => api.get("/market/advisory", { params: { crop } }).then((r) => r.data);
