import type { PartidoRequest } from "../models/partidoRequest";
import type { PartidoResponse } from "../models/partidoResponse";
import {apiClientAdminElectoral} from "./interceptors";;

export class PartidoService {
    getPartidos(): Promise<Array<PartidoResponse>> {
        return new Promise<Array<PartidoResponse>>((resolve, reject) => {
            apiClientAdminElectoral.get("/partidos/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener las elecciones: " + error.message));
                });
        });
    }

    getPartido(id: string): Promise<PartidoResponse> {
        return new Promise<PartidoResponse>((resolve, reject) => {
            apiClientAdminElectoral.get(`/partidos/${id}/`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener el género: " + error.message));
                });
        });
    }

    insertPartido(partido: PartidoRequest): Promise<PartidoRequest> {
        return new Promise<PartidoRequest>((resolve, reject) => {
            apiClientAdminElectoral.post("/partidos/", partido,{
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
    updatePartido(partido: PartidoRequest): Promise<PartidoRequest> {
        return new Promise<PartidoRequest>((resolve, reject) => {
            apiClientAdminElectoral.put(`/partidos/${partido.id}/`, partido,{
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al actualizar la eleccion: " + error.message));
                });
        });
    }

    deletePartido(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClientAdminElectoral.delete(`/partidos/${id}/`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(new Error("Error al eliminar la eleccion: " + error.message));
                });
        });
    }
}