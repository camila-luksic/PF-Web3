export interface PersonaVotanteRequest {
    ci: string;
    nombres: string;
    apellidos: string;
    direccion:string;
    idRecinto:string;
    fotoCarnetAnverso?: File|undefined;
    fotoCarnetReverso?: File|undefined;
    fotoVotante?: File|undefined;

}