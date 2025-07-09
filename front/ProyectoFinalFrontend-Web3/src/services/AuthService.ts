import axios from "axios";
import type{ LoginResponse } from "../models/dto/LoginResponse";
import type{ RefreshTokenResponse } from "../models/dto/RefreshTokenResponse";
import type{ RegisterResponse } from "../models/dto/RegisterResponse";
import type{ UserInfoResponse } from "../models/dto/UserInfoResponse";

export class AuthService {
    login(email: string, password: string): Promise<LoginResponse> {
        return new Promise<LoginResponse>((resolve, reject) => {
            axios.post("http://localhost:8000/api/token/", {
                email: email,
                password: password
            }, { withCredentials: true }).then((response) => {
                 const { access, roles } = response.data;

            // Guardar token y roles
            localStorage.setItem("access_token", access);
            localStorage.setItem("roles", JSON.stringify(roles));

                resolve(response.data)
            }).catch((error) => {
                reject(new Error("Error al iniciar sesión: " + error.message))
            })
        });
    }
    refreshToken(): Promise<RefreshTokenResponse> {
        return new Promise<RefreshTokenResponse>((resolve, reject) => {
            axios.post("http://localhost:8000/api/token/refresh/", {}, {
                withCredentials: true
            }).then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(new Error("Error al refrescar el token: " + error.message))
            })
        });
    }
    logout(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("roles");

            axios.post("http://localhost:8000/auth/logout/").then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(new Error("Error al cerrar sesión: " + error.message))
            })
        });
    }

    register(email: string, password: string): Promise<RegisterResponse> {
        return new Promise<RegisterResponse>((resolve, reject) => {
            axios.post("http://localhost:8000/accesos/auth/register/", {
                email,
                password
            }).then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(new Error("Error al registrar el usuario: " + error.message))
            })
        });
    }
    me(): Promise<UserInfoResponse> {
        return new Promise<UserInfoResponse>((resolve, reject) => {
            axios.get("http://localhost:8000/accesos/usuarios/me/").then((response) => {
                resolve(response.data)
            }).catch((error) => {
                reject(new Error("Error al obtener la información del usuario: " + error.message))
            })
        });
    }
}