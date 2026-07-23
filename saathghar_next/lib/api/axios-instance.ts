import axios from "axios";
import { getTokenCookie } from "../cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
    || "http://localhost:8089";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Helper to get auth token on both server and client sides
const getAuthToken = async (): Promise<string | undefined> => {
    if (typeof window === "undefined") {
        try {
            return await getTokenCookie();
        } catch {
            return undefined;
        }
    } else {
        const name = "auth_token=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return undefined;
    }
};

// 🔒 JWT Token Interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken(); 
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