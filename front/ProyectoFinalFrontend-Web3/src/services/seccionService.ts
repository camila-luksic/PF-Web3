import type { SeccionRequest } from "../models/seccionRequest";
import type { SeccionResponse } from "../models/seccionResponse";
import { apiClientAdminElectoral } from "./interceptors";


export class SeccionService {
  // 🔁 Parsear el GeoJSON sucio del backend
  private parseGeoJsonString(str: string): { lat: number; lng: number }[] {
    try {
      const clean = str.replace(/[\r\n]/g, "").trim();
      const wrapped = clean.startsWith("[") ? clean : `[${clean}]`;
      const quotedKeys = wrapped
        .replace(/([{,]\s*)lat\s*:/g, '$1"lat":')
        .replace(/([{,]\s*)lng\s*:/g, '$1"lng":');
      return JSON.parse(quotedKeys);
    } catch (error) {
      console.error("Error al parsear geojson:", str, error);
      return [];
    }
  }

  // 📥 Obtener todas las secciones con polígonos parseados
  getSecciones(): Promise<Array<{ id: number; nombre: string; path: { lat: number; lng: number }[] }>> {
    return new Promise((resolve, reject) => {
      apiClientAdminElectoral
        .get("/secciones/")
        .then((response) => {
          const data: SeccionResponse[] = response.data;
          const formatted = data.map((item) => ({
            id: item.id,
            nombre: item.nombre,
            path: this.parseGeoJsonString(item.geojson),
          }));
          resolve(formatted);
        })
        .catch((error) => {
          reject(new Error("Error al obtener las secciones: " + error.message));
        });
    });
  }

  // 📄 Obtener una sola sección
  getSeccion(id: number): Promise<{ id: number; nombre: string; path: { lat: number; lng: number }[] }> {
    return new Promise((resolve, reject) => {
      apiClientAdminElectoral
        .get(`/secciones/${id}/`)
        .then((response) => {
          const item = response.data;
          resolve({
            id: item.id,
            nombre: item.nombre,
            path: this.parseGeoJsonString(item.geojson),
          });
        })
        .catch((error) => {
          reject(new Error("Error al obtener la sección: " + error.message));
        });
    });
  }

  // ➕ Insertar nueva sección
  insertSeccion(seccion: SeccionRequest): Promise<SeccionResponse> {
    return new Promise((resolve, reject) => {
      apiClientAdminElectoral
        .post("/secciones/", seccion)
        .then((response) => resolve(response.data))
        .catch((error) => {
          reject(new Error("Error al insertar sección: " + error.message));
        });
    });
  }

  // 🗑️ Eliminar sección
  deleteSeccion(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      apiClientAdminElectoral
        .delete(`/secciones/${id}/`)
        .then(() => resolve())
        .catch((error) => reject(new Error("Error al eliminar sección: " + error.message)));
    });
  }

  // ✏️ Actualizar sección
  updateSeccion(id: number, data: SeccionRequest): Promise<SeccionResponse> {
    return new Promise((resolve, reject) => {
      apiClientAdminElectoral
        .put(`/secciones/${id}/`, data)
        .then((response) => resolve(response.data))
        .catch((error) => reject(new Error("Error al actualizar sección: " + error.message)));
    });
  }
}
