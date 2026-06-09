import axios from "axios";
import { getCookieClientSide } from "../cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
    || "http://localhost:8089";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔒 JWT Token Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCookieClientSide("auth_token"); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;