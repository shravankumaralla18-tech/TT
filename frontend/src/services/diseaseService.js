import api from "./api";

export function detect(file) {
  const form = new FormData();
  form.append("file", file);
  return api.post("/disease/detect", form).then((r) => r.data);
}
export const getHistory = () => api.get("/disease/history").then((r) => r.data);
export const getResult = (id) => api.get(`/disease/${id}`).then((r) => r.data);
export const deleteResult = (id) => api.delete(`/disease/${id}`);
