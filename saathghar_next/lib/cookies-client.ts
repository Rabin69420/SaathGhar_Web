export function getCookieClientSide(name: string): string | undefined {
    if (typeof window === "undefined") return undefined;
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? match[2] : undefined;
}

export function getUserData(): any | null {
    const raw = getCookieClientSide("user_data");
    if (!raw) return null;
    try {
        return JSON.parse(decodeURIComponent(raw));
    } catch {
        return null;
    }
}
