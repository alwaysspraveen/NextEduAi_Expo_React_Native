// src/services/api.ts
import { environment } from "@/environment/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// --- Create instance ---
const interceptor = axios.create({
  baseURL: environment.apiUrl, // e.g. "https://api.yourapp.com"
  timeout: 20000, // 20s timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --- Helper: add cache-buster for GETs (prevents 304s) ---
function addCacheBuster(config: AxiosRequestConfig) {
  if (config.method?.toLowerCase() === "get") {
    const params = new URLSearchParams(
      (config.params as Record<string, any>) ?? {}
    );
    params.set("_cb", Date.now().toString());
    config.params = Object.fromEntries(params.entries());
    // Also ask intermediaries not to cache
    config.headers = {
      ...(config.headers ?? {}),
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };
  }
}

// --- Request interceptor: attach JWT + (optional) cache buster ---
interceptor.interceptors.request.use(
  async (config) => {
    // Attach token
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // Prevent 304s if you want a fresh payload
    addCacheBuster(config);

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: handle auth errors globally ---
interceptor.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    // Network error (no response)
    if (!error.response) {
      // You can surface a toast here if you like
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Handle 401/403 -> logout or navigate to login
    if (status === 401 || status === 403) {
      try {
        // Optional: clear session
        await AsyncStorage.removeItem("token");
        // TODO: route to login screen if needed
        // router.replace("/(auth)/login");
      } catch {}
    }

    // Normalize error message
    const message =
      (error.response.data as any)?.error ||
      (error.response.data as any)?.message ||
      error.message ||
      "Request failed";

    return Promise.reject(new Error(message));
  }
);

export default interceptor;
