import type { RecintoRequest } from "../models/recintoRequest";
import type { RecintoResponse } from "../models/RecintoResponse";
import {apiClientAdminElectoral} from "./interceptors";;

export class RecintoService {
    getRecintos(): Promise<Array<RecintoResponse>> {
        return new Promise<Array<RecintoResponse>>((resolve, reject) => {
            apiClientAdminElectoral.get("/recintos/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener las elecciones: " + error.message));
                });
        });
    }

    getRecinto(id: string): Promise<RecintoResponse> {
        return new Promise<RecintoResponse>((resolve, reject) => {
            apiClientAdminElectoral.get(`/recintos/${id}/`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener el género: " + error.message));
                });
        });
    }

    insertRecinto(recinto: RecintoRequest): Promise<RecintoRequest> {
        return new Promise<RecintoRequest>((resolve, reject) => {
            apiClientAdminElectoral.post("/recintos/", recinto,{
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
    updateRecinto(recinto: RecintoRequest): Promise<RecintoRequest> {
        return new Promise<RecintoRequest>((resolve, reject) => {
            apiClientAdminElectoral.put(`/recintos/${recinto.id}/`, recinto,{
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al actualizar la eleccion: " + error.message));
                });
        });
    }

    deleteRecinto(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClientAdminElectoral.delete(`/recintos/${id}/`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(new Error("Error al eliminar la eleccion: " + error.message));
                });
        });
    }
    asignarVotantesYJurados(idRecinto: number, votantes: Array<any>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        apiClientAdminElectoral.post(`/asignar-votantes-jurados/${idRecinto}/`, {
            votantes: votantes
        })
        .then(() => {
            resolve();
        })
        .catch((error) => {
            console.error("Error en la asignación de votantes y jurados:", error);
            reject(new Error("No se pudo asignar votantes y jurados: " + 
                (error.response?.data?.detail || error.message)));
        });
    });
}


}