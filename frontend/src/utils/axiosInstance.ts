import axios from "axios";

// Create a reusable Axios instance for all API calls
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false; // Tracks if refresh call is in progress
let refreshSubscribers: ((token: string) => void)[] = []; // Queued requests waiting for new token

// Add request to the waiting list until new token is available
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Notify all queued requests that new token is ready
const onRrefreshed = (newToken: string) => {
  refreshSubscribers.map((cb) => cb(newToken));
  refreshSubscribers = [];
};

// Request Interceptor – attach access token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Access token stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor – handles expired access tokens (401 errors)
apiClient.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;

    // If access token expired and this request hasn’t been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // If a refresh request is already running, queue this one
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            // Retry the failed request with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      // Begin token refresh flow
      isRefreshing = true;
      try {
        // Call refresh token endpoint
        // Refresh token is stored in HTTP-only cookie → automatically sent via withCredentials
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true } // sending refresh token cookie
        );

        const newToken = res.data.data; // New access token from backend
        localStorage.setItem("authToken", newToken); // Store new access token
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`; // Update Axios default header

        onRrefreshed(newToken); // Notify all queued requests
        return apiClient(originalRequest); // Retry the original failed request
      } catch (refreshError: unknown) {
        // If refresh token expired or not present → force logout
        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response &&
          [401, 403].includes(refreshError.response.status)
        ) {
          localStorage.removeItem("authToken");
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Reset flag
      }
    }

    // For non-401 errors, just pass the error along
    return Promise.reject(error);
  }
);

export default apiClient;
