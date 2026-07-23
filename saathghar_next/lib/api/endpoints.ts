export const API = {
    AUTH : {
        REGISTER: "/api/v1/auth/register",
        LOGIN : "/api/v1/auth/login",
        WHOAMI: '/api/v1/auth/whoami',
        UPDATE_PROFILE: '/api/v1/auth/update',
    },
    LISTINGS: {
        BASE: "/api/v1/listings",
        MY_LISTINGS: "/api/v1/listings/my-listings",
        BOOKMARKED: "/api/v1/listings/bookmarked",
        DETAIL: (id: string) => `/api/v1/listings/${id}`,
        BOOKMARK: (id: string) => `/api/v1/listings/${id}/bookmark`,
        COMPATIBILITY: (id: string) => `/api/v1/listings/${id}/compatibility`,
    },
    UPLOAD: "/api/v1/file/upload",
    ADMIN: {
        STATS: "/api/v1/admin/stats",
        USERS: "/api/v1/admin/users",
        DELETE_USER: (id: string) => `/api/v1/admin/users/${id}`,
        LISTINGS: "/api/v1/admin/listings",
        DELETE_LISTING: (id: string) => `/api/v1/admin/listings/${id}`,
    }
}