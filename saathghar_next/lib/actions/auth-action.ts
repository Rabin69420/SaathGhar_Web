"use server";

import { login, register } from "../api/auth";
import { setTokenCookie, storeUserData } from "../cookies";
import { LoginFormData, RegisterFormData } from "../../app/(auth)/_component/schema";

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
                message: result.message || 'Login successful' 
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