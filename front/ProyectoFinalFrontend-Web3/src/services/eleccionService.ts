import type { EleccionRequest } from "../models/eleccionRequest";
import type { EleccionResponse } from "../models/eleccionResponse";
import {apiClientAdminElectoral} from "./interceptors";;

export class EleccionService {
    getElecciones(): Promise<Array<EleccionResponse>> {
        return new Promise<Array<EleccionResponse>>((resolve, reject) => {
            apiClientAdminElectoral.get("/eleciones/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener las elecciones: " + error.message));
                });
        });
    }

    getEleccion(id: string): Promise<EleccionResponse> {
        return new Promise<EleccionResponse>((resolve, reject) => {
            apiClientAdminElectoral.get(`/eleciones/${id}/`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener el género: " + error.message));
                });
        });
    }

    insertEleccion(eleccion: EleccionRequest): Promise<EleccionRequest> {
        return new Promise<EleccionRequest>((resolve, reject) => {
            apiClientAdminElectoral.post("/eleciones/", eleccion,{
            })
        
                .then((response) => {
                    console.log("Respuesta del servidor:", response.data);
                    resolve(response.data);
                })
                .catch((error) => {
                    console.error("Error completo:", error);
                    reject(new Error("Error al insertar la persona: " + 
                        (error.response?.data?.detail || error.message)));
                });
        });
    }
    updateEleccion(eleccion: EleccionRequest): Promise<EleccionRequest> {
        return new Promise<EleccionRequest>((resolve, reject) => {
            apiClientAdminElectoral.put(`/eleciones/${eleccion.id}/`, eleccion,{
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al actualizar la eleccion: " + error.message));
                });
        });
    }

    deleteEleccion(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClientAdminElectoral.delete(`/eleciones/${id}/`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(new Error("Error al eliminar la eleccion: " + error.message));
                });
        });
    }
}