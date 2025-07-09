export interface EleccionRequest {
  id?: number;
  nombre: string;
  tipo:string;
  fecha:string;
  secciones: number[];
}