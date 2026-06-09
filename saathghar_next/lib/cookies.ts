"use server";
import { cookies } from "next/headers";

export async function setTokenCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "auth_token", 
        value: token,
        path: "/",         
        secure: true,
        httpOnly: true    
    });
}

export async function getTokenCookie() {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
}

export async function storeUserData(userData: any) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "user_data",
        value: JSON.stringify(userData), 
        path: "/",
    });
}

export async function getUserData() {
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("user_data")?.value;
    return userDataCookie ? JSON.parse(userDataCookie) : null; 
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
}

export async function getCookieClientSide(name: string): Promise<string | undefined> {
    if (typeof window === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
}