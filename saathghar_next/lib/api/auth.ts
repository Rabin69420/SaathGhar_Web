import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
    try {
        const response =
            await axiosInstance.post(API.AUTH.REGISTER, data); 
        return response.data; 
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message
            || 'Registration failed');
    }
}

export const login = async (data: any) => {
    try {
        const response =
            await axiosInstance.post(API.AUTH.LOGIN, data); 
        return response.data; 
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message
            || 'Login failed');
    }
}

export const whoami = async () => {
    try {
        const response = await axiosInstance.post(API.AUTH.WHOAMI);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Fetch user failed');
    }
}

export const updateProfile = async (formData: FormData) => {
    try {
        const response = await axiosInstance.put(API.AUTH.UPDATE_PROFILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Update profile failed');
    }
}