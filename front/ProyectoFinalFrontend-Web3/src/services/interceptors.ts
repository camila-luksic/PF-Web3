import axios from "axios";
import { AuthService } from "./AuthService";

const apiClientPadronElectoral = axios.create({
    baseURL: "https://localhost:7119/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: true
});

const apiClientAdminElectoral = axios.create({
    baseURL: "http://127.0.0.1:8001/adminElectoral/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: true
});

//cuando la petición se va a enviar a la API, se ejecuta este interceptor
apiClientPadronElectoral.interceptors.request.use(function (config) {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    console.error("Error en la solicitud a la API: ", error);
    return Promise.reject(error);
});

apiClientAdminElectoral.interceptors.request.use(function (config) {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    console.error("Error en la solicitud a la API: ", error);
    return Promise.reject(error);
});
//cuando la petición ya llegó a la API y se recibe una respuesta, se ejecuta este interceptor
apiClientPadronElectoral.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (error.response.status === 401) {
        try {
            await new AuthService().refreshToken()
        } catch (authError) {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            console.log("auth error", authError)
            return Promise.reject(authError)
        }
        return apiClientPadronElectoral.request(error.config)
    }

    console.error("Error en la respuesta de la API: ", error.response);
    return Promise.reject(error);
});


apiClientAdminElectoral.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (error.response.status === 401) {
        try {
            await new AuthService().refreshToken()
        } catch (authError) {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            console.log("auth error", authError)
            return Promise.reject(authError)
        }
        return apiClientAdminElectoral.request(error.config)
    }

    console.error("Error en la respuesta de la API: ", error.response);
    return Promise.reject(error);
});

export { apiClientPadronElectoral, apiClientAdminElectoral };