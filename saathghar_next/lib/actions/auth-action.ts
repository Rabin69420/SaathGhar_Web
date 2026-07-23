"use server";

import { login, register, whoami, updateProfile } from "../api/auth";
import { setTokenCookie, storeUserData, clearAuthCookies } from "../cookies";
import { LoginFormData, RegisterFormData } from "../../app/(auth)/_component/schema";
import { revalidatePath } from "next/cache";

export const handleLoginUser = async (data: LoginFormData) => {
    try {
        const result = await login(data);
        
        // Checks if backend indicates success OR returns a token directly
        if (result && (result.success || result.token || result.data?.token)) {
            const token = result.token || result.data?.token;
            const user = result.user || result.data?.user;
            
            if (token) await setTokenCookie(token);
            if (user) await storeUserData(user);
            
            return { 
                success: true, 
                message: result.message || 'Login successful',
                role: user?.role,
                user: user
            }; 
        }
        
        return { 
            success: false, 
            message: result?.message || 'Invalid credentials' 
        };
    } catch (error: any) {
        return { 
            success: false, 
            message: error?.response?.data?.message || error?.message || 'Login failed' 
        };    
    }
};

export const handleRegisterUser = async (data: RegisterFormData) => {
    try {
        const result = await register(data);
        
        // Checks if backend registration was successful
        if (result && (result.success || result.id || result._id || result.data)) {
            return { 
                success: true, 
                message: result.message || 'Registration successful' 
            };
        }
        
        return { 
            success: false, 
            message: result?.message || 'Registration failed' 
        };
    } catch (error: any) {
        return { 
            success: false, 
            message: error?.response?.data?.message || error?.message || 'Registration failed' 
        };    
    }
};

export const handleWhoami = async () => {
    try {        
        const response = await whoami();
        if (response.success) {
            return {
                success: true,
                data: response.data
            }
        }
        return { success: false, message: response.message || 'Whoami failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Whoami action failed' }
    }
}

export const handleUpdateProfile = async (formData: FormData) => {
    try {
        const response = await updateProfile(formData);
        if (response.success) {
            await storeUserData(response.data);
            revalidatePath("/user/profile"); // refresh cache 
            return {
                success: true,
                message: 'Profile updated successfully',
                data: response.data
            }
        }
        return { success: false, message: response.message || 'Update profile failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Update profile action failed' }
    }
}

export const handleLogoutUser = async () => {
    try {
        await clearAuthCookies();
        return { success: true, message: "Logged out successfully" };
    } catch (error: any) {
        return { success: false, message: error.message || "Logout failed" };
    }
}