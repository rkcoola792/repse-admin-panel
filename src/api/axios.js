import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/userSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue = [];

const flushQueue = () => {
  queue.forEach((resolve) => resolve());
  queue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED";
    const isRefreshCall = original?.url?.includes("/refresh-token");

    if (isTokenExpired && !original._retry && !isRefreshCall) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => queue.push(resolve)).then(() =>
          api(original),
        );
      }

      isRefreshing = true;
      try {
        await api.post("/refresh-token");
        flushQueue();
        return api(original);
      } catch (refreshError) {
        queue = [];
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && !isTokenExpired && !isRefreshCall) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  },
);

export default api;
