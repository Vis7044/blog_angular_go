import axios from "axios";
import { eventEmitter } from "./eventEmittor";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // important: send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// No need for manual Authorization headers

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => resolve(apiClient(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        // The refresh token is automatically sent via cookie
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        onRefreshed();
        return apiClient(originalRequest);
      } catch (refreshError) {
        eventEmitter.emit("showLoginModal");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
