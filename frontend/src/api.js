import axios from "axios";

// Configurable via .env (REACT_APP_API_URL) so it works both locally and in Docker
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const getTickets = () => api.get("/tickets");
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const createTicket = (data) => api.post("/tickets", data);
export const updateTicket = (id, data) => api.patch(`/tickets/${id}`, data);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);

export default api;
