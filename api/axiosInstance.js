import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://petmania-backend.onrender.com/api",
  timeout: 10000,
  withCredentials: true, // allows cookies (like tokens) to be sent automatically
});

// Optional: interceptors for logging or error handling
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle 401 (unauthorized) errors globally here
    if (error.response?.status === 401) {
      console.warn("Unauthorized — possible expired or missing token");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
