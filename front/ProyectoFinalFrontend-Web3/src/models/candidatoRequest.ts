export interface CandidatoRequest {
    id?:string;
    ci: string;
    nombre: string;
    cargo:string;
    partido:string
    foto?: File|undefined;

}