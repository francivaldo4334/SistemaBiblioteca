import axios from "axios";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import router from "@/router";
import { TokenAPI } from "./endpoints";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const axiosClientNotAuth = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthenticationStore();
    const token = authStore.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthenticationStore();

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return await axiosClient(originalRequest);
        } catch (err) {
          return await Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = authStore.refreshToken;
        if (!refreshToken) {
          authStore.cleanSession();
          router.replace({ name: "login" });
          return await Promise.reject(error);
        }

        const response = await TokenAPI.tokenRefresh({ refresh: refreshToken });
        const newAccessToken = response.access;
        authStore.setAccessToken(newAccessToken);
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return await axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.cleanSession();
        router.replace({ name: "login" });
        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { axiosClient, axiosClientNotAuth };
