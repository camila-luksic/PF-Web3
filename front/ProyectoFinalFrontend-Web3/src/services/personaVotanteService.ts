import type { PersonaVotanteRequest} from "../models/PersonaVotanteRequest";
import type { PersonaVotanteResponse } from "../models/PersonaVotanteResponse";
import {apiClientPadronElectoral} from "./interceptors";

export class PersonaVotanteService {
    getPersonasVotantes(): Promise<Array<PersonaVotanteResponse>> {
        return new Promise<Array<PersonaVotanteResponse>>((resolve, reject) => {
            apiClientPadronElectoral.get("/personaVotantes/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener las personas: " + error.message));
                });
        });
    }

    getPersonaVotante(ci: string): Promise<PersonaVotanteResponse> {
        return new Promise<PersonaVotanteResponse>((resolve, reject) => {
            apiClientPadronElectoral.get(`/PersonaVotantes/by-ci/${ci}/`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener el género: " + error.message));
                });
        });
    }

     private buildFormData(personaVotante: PersonaVotanteRequest): FormData {
        const formData = new FormData();
        if (personaVotante.ci !== undefined && personaVotante.ci !== null) {
            formData.append('ci', personaVotante.ci.toString());
        } else {
            console.error("CI is missing or invalid in FormData build.");
        }

        if (personaVotante.nombres) {
            formData.append('nombres', personaVotante.nombres);
        } else {
            console.error("NombreCompleto is missing or empty in FormData build.");
        }
         if (personaVotante.apellidos) {
            formData.append('apellidos', personaVotante.apellidos);
        } else {
            console.error("NombreCompleto is missing or empty in FormData build.");
        }

        if (personaVotante.direccion) {
            formData.append('Direccion', personaVotante.direccion);
        } else {
            console.error("Direccion is missing or empty in FormData build.");
        }
        if (personaVotante.fotoCarnetAnverso) { // Esta condición evalúa a true si es un File, false si es undefined o null
            formData.append('FotoCarnetAnverso', personaVotante.fotoCarnetAnverso);
            
        }

        if (personaVotante.fotoCarnetReverso) {
            formData.append('FotoCarnetReverso', personaVotante.fotoCarnetReverso);
        }

        if (personaVotante.fotoVotante) {
            formData.append('FotoVotante', personaVotante.fotoVotante);
        }
         if (personaVotante.idRecinto) {
            formData.append('idRecinto', personaVotante.idRecinto);
        }
        



        return formData;
    }



    insertPersonaVotante(personaVotante: PersonaVotanteRequest): Promise<PersonaVotanteRequest> {
        return new Promise<PersonaVotanteRequest>((resolve, reject) => {
            const formData = this.buildFormData(personaVotante);
            console.log("Enviando FormData para insertar:", formData);
            apiClientPadronElectoral.post("/personaVotantes/", formData,{
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
    updatePersonaVotante(personaVotante: PersonaVotanteRequest): Promise<PersonaVotanteRequest> {
        return new Promise<PersonaVotanteRequest>((resolve, reject) => {
            const formData = this.buildFormData(personaVotante);
            console.log("Enviando FormData para actualizar:", formData);

            apiClientPadronElectoral.put(`/PersonaVotantes/${personaVotante.ci}/`, formData,{
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

    deletePersonaVotante(ci: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClientPadronElectoral.delete(`/PersonaVotantes/${ci}/`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(new Error("Error al eliminar la persona: " + error.message));
                });
        });
    }
}