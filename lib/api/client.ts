import axios from "axios";

const API_BASE_URL = "http://kaktos.kanoonbartarha.ir";
const BEARER_TOKEN = "28|MDgAfKeNof7zZSStFljlHCvyc0Ht89pC8eG64e1fed053201";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
