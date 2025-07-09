export interface LoginResponse {
    refresh: string;
    access: string;
    roles: string[];
    email: string;
}