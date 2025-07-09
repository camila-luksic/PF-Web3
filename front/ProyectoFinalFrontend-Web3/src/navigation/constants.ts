export const URLS = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    SECCIONES:'/secciones',
    PersonasVotantes: {
        LIST: '/personasVotantes',
        CREATE: '/personaVotante/create',
        BUSCAR:'/buscar',
        EDIT_BY_CI: "/personaVotante/edit/:ci",
        UPDATE_BY_CI: (ci: string) => {
            return `/personaVotante/edit/${ci}`;
        }
    },
    Elecciones: {
        LIST: '/elecciones',
        CREATE: '/elecciones/create',
        EDIT: "/eleccion/edit/:id",
        UPDATE: (id: string) => {
            return `/eleccion/edit/${id}`;
        }
    },
     Cargos: {
        LIST: '/cargos',
        CREATE: '/cargos/create',
        EDIT: "/cargo/edit/:id",
        UPDATE: (id: string) => {
            return `/cargo/edit/${id}`;
        }
    },
    Partidos: {
        LIST: '/partidos',
        CREATE: '/partidos/create',
        EDIT: "/partido/edit/:id",
        UPDATE: (id: string) => {
            return `/partido/edit/${id}`;
        }
    },
     Candidatos: {
        LIST: '/candidatos',
        CREATE: '/candidatos/create',
        EDIT: "/candidato/edit/:id",
        UPDATE: (id: string) => {
            return `/candidato/edit/${id}`;
        }
    },
      Recintos: {
        LIST: '/recintos',
        CREATE: '/recintos/create',
        EDIT: "/recinto/edit/:id",
        UPDATE: (id: string) => {
            return `/recinto/edit/${id}`;
        }
    },

    

}