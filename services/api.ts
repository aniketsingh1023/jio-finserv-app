import axios from "axios";
import * as tokenStorage from "../utils/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

console.log("EXPO_PUBLIC_API_URL:", BASE_URL);

if (!BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not defined");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token to request headers if available
api.interceptors.request.use(async (config) => {
  try {
    const token = await tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
  }
  return config;
});

api.interceptors.request.use((config) => {
  console.log("REQUEST BASE URL:", config.baseURL);
  console.log("REQUEST URL:", config.url);
  console.log("FULL REQUEST URL:", `${config.baseURL}${config.url}`);
  console.log("REQUEST DATA:", config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("RESPONSE STATUS:", response.status);
    console.log("RESPONSE DATA:", response.data);
    return response;
  },
  (error) => {
    console.error("AXIOS RESPONSE ERROR:", {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      fullURL: `${error.config?.baseURL || ""}${error.config?.url || ""}`,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

const formatError = (
  error: any
): { message: string; status?: number; data?: any } => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      fullURL: `${error.config?.baseURL || ""}${error.config?.url || ""}`,
      status: error.response?.status,
      message: error.response?.data?.error || error.response?.data?.message,
      data: error.response?.data,
      axiosMessage: error.message,
    });

    return {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status,
      data: error.response?.data,
    };
  }

  return {
    message: error?.message || "Something went wrong",
  };
};

export const get = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const post = async <T>(url: string, data?: unknown): Promise<T> => {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const put = async <T>(url: string, data?: unknown): Promise<T> => {
  try {
    const response = await api.put<T>(url, data);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const del = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.delete<T>(url);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export default api;