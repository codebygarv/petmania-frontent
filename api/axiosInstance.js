import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Shared Axios client; token is injected in the request interceptor to avoid
// creating the client asynchronously.
const axiosInstance = axios.create({
  // baseURL: "https://petmania-backend-six.vercel.app/api",
  baseURL: "http://10.159.243.130:5050/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    const verifyChangePassword = await AsyncStorage.getItem("verifyChangePassword");
    // console.log("verifyChangePassword from axiosInstance", verifyChangePassword); 
    if (verifyChangePassword) {
      config.headers.Authorization = `Bearer ${verifyChangePassword}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  }, (error) => Promise.reject(error));

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
