import type { CargoRequest } from "../models/cargoRequest";
import type { CargoResponse } from "../models/cargoResponse";
import {apiClientAdminElectoral} from "./interceptors";;

export class CargoService {
    getCargos(): Promise<Array<CargoResponse>> {
        return new Promise<Array<CargoResponse>>((resolve, reject) => {
            apiClientAdminElectoral.get("/cargos/")
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener las elecciones: " + error.message));
                });
        });
    }

    getCargo(id: string): Promise<CargoResponse> {
        return new Promise<CargoResponse>((resolve, reject) => {
            apiClientAdminElectoral.get(`/cargos/${id}/`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al obtener el género: " + error.message));
                });
        });
    }

    insertCargo(cargo: CargoRequest): Promise<CargoRequest> {
        return new Promise<CargoRequest>((resolve, reject) => {
            apiClientAdminElectoral.post("/cargos/", cargo,{
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
    updateCargo(cargo: CargoRequest): Promise<CargoRequest> {
        return new Promise<CargoRequest>((resolve, reject) => {
            apiClientAdminElectoral.put(`/cargos/${cargo.id}/`, cargo,{
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(new Error("Error al actualizar la eleccion: " + error.message));
                });
        });
    }

    deleteCargo(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            apiClientAdminElectoral.delete(`/cargos/${id}/`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(new Error("Error al eliminar la eleccion: " + error.message));
                });
        });
    }
}