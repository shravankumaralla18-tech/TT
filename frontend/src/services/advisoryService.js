import api from "./api";

export const listCrops = () => api.get("/crops").then((r) => r.data);
export const getCropAdvisory = (cropId, coords) =>
  api.get(`/advisory/crop/${cropId}`, { params: coords ? { lat: coords.lat, lon: coords.lon } : {} }).then((r) => r.data);
export const getRecommendations = () => api.get("/advisory/recommendations").then((r) => r.data);
