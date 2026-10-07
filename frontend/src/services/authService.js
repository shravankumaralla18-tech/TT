import api from "./api";
import { TOKEN_KEY } from "../utils/constants";

export const register = (payload) => api.post("/auth/register", payload).then((r) => r.data);

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem(TOKEN_KEY, data.access_token);
  return data.user;
}

export const logout = () => localStorage.removeItem(TOKEN_KEY);
export const getMe = () => api.get("/auth/me").then((r) => r.data);
export const updateProfile = (payload) => api.put("/users/me", payload).then((r) => r.data);
