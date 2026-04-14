import axios from "axios";
import * as tokenStorage from "../utils/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

console.log("EXPO_PUBLIC_API_URL:", BASE_URL);

if (!BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not defined");
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Add token to request headers if available
api.interceptors.request.use(async (config) => {
  try {
    const token = await tokenStorage.getToken();

    if (!config.headers) {
      config.headers = {} as any;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("REQUEST URL:", config.url);
  } catch (error) {
    console.error("Error retrieving token:", error);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("RESPONSE STATUS:", response.status);
    if (
      response.data &&
      typeof response.data === "object" &&
      Object.keys(response.data).length > 0
    ) {
      console.log("RESPONSE received successfully");
    }
    return response;
  },
  (error) => {
    try {
      if (axios.isAxiosError(error)) {
        console.error("AXIOS RESPONSE ERROR - Status:", error.response?.status);
        console.error(
          "AXIOS RESPONSE ERROR - Message:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("AXIOS RESPONSE ERROR:", error?.message);
      }
    } catch {
      // ignore logging failures
    }

    return Promise.reject(error);
  }
);

const formatError = (
  error: any
): { message: string; status?: number; data?: any } => {
  if (axios.isAxiosError(error)) {
    try {
      console.error("API Error - Status:", error.response?.status);
      console.error(
        "API Error - Message:",
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message
      );
    } catch {
      console.error("API Request failed:", error.message);
    }

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

const formatFetchError = async (
  response: Response
): Promise<{ message: string; status?: number; data?: any }> => {
  let data: any = null;

  try {
    data = await response.json();
  } catch {
    try {
      const text = await response.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  return {
    message:
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`,
    status: response.status,
    data,
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
    const response = await api.post<T>(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

/**
 * POST request with FormData (for file uploads)
 * Uses fetch because axios + React Native + multipart files often throws
 * generic "Network Error" with no response object.
 */
export const postFormData = async <T>(
  url: string,
  data: FormData
): Promise<T> => {
  try {
    const token = await tokenStorage.getToken();

    const fullUrl = url.startsWith("http")
      ? url
      : `${BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

    console.log("FORMDATA REQUEST URL:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Do NOT set Content-Type manually for multipart/form-data.
        // React Native will set the correct boundary automatically.
      },
      body: data,
    });

    console.log("FORMDATA RESPONSE STATUS:", response.status);

    if (!response.ok) {
      throw await formatFetchError(response);
    }

    const responseData = await response.json();
    return responseData as T;
  } catch (error: any) {
    console.error(
      "FORMDATA API Error:",
      error?.message || "Failed to upload form data"
    );

    throw {
      message: error?.message || "Failed to submit application",
      status: error?.status,
      data: error?.data,
    };
  }
};

export const put = async <T>(url: string, data?: unknown): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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