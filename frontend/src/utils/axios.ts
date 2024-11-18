import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});
