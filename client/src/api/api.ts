import axios from "axios";

// Configuração global do Axios
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Permite envio de cookies
});

export default api;
