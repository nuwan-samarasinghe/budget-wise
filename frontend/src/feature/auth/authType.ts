export type AuthState = {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export type Auth = {
    username: string,
    password: string
}