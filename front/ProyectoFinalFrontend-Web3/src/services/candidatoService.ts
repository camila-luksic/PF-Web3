import type { CandidatoResponse } from "../models/candidatoResponse";
import {apiClientAdminElectoral} from "./interceptors";
import type { CandidatoRequest } from '../models/candidatoRequest';

export class CandidatoService {
    getCandidatos(): Promise<Array<CandidatoResponse>> {
        return new Promise<Array<CandidatoResponse>>((resolve, reject) => {
            apiClientAdminElectoral.get("/candidatos/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener las personas: " + error.message));
                });
        });
    }

    getCandidato(id: string): Promise<CandidatoResponse> {
        return new Promise<CandidatoResponse>((resolve, reject) => {
            apiClientAdminElectoral.get(`/candidatos/${id}/`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener el género: " + error.message));
                });
        });
    }

     private buildFormData(candidato: CandidatoRequest): FormData {
        const formData = new FormData();
        if (candidato.ci !== undefined && candidato.ci !== null) {
            formData.append('ci', candidato.ci.toString());
        } else {
            console.error("CI is missing or invalid in FormData build.");
        }

        if (candidato.nombre) {
            formData.append('nombre', candidato.nombre);
        } else {
            console.error("nombre is missing or empty in FormData build.");
        }

        if (candidato.cargo) {
            formData.append('cargo', candidato.cargo);
        } else {
            console.error("cargo is missing or empty in FormData build.");
        }
        if (candidato.foto) { // Esta condición evalúa a true si es un File, false si es undefined o null
            formData.append('foto', candidato.foto);
            
        }

        if (candidato.partido) {
            formData.append('partido', candidato.partido);
        }

        return formData;
    }



    insertCandidato(candidato: CandidatoRequest): Promise<CandidatoRequest> {
        return new Promise<CandidatoRequest>((resolve, reject) => {
            const formData = this.buildFormData(candidato);
            console.log("Enviando FormData para insertar:", formData);
            apiClientAdminElectoral.post("/candidatos/", formData,{
                headers:{"Content-type":"multipart/form-data"}
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
    updateCandidato(candidato: CandidatoRequest): Promise<CandidatoRequest> {
        return new Promise<CandidatoRequest>((resolve, reject) => {
            const formData = this.buildFormData(candidato);
            console.log("Enviando FormData para actualizar:", formData);

            apiClientAdminElectoral.put(`/candidatos/${candidato.id}/`, formData,{
                headers:{"Content-type":"multipart/form-data"}
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al actualizar la persona: " + error.message));
                });
        });
    }

    deleteCandidato(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClientAdminElectoral.delete(`/candidatos/${id}/`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(new Error("Error al eliminar la persona: " + error.message));
                });
        });
    }
}