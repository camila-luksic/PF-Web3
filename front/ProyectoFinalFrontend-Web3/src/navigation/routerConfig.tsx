import { Routes, Route } from "react-router";
import { URLS } from "./constants";
import App from "../App";
import { PersonaVotanteForm } from "../pages/PersonaVotanteForm";
import PersonaVotanteList from "../pages/PersonaVotanteList";
import VoterSearchPage from "../pages/BuscarPersonaVotante";
import { LoginForm } from "../pages/LoginForm";
import { RegisterForm } from "../pages/registerForm";
import PolygonManager from "../pages/seccionForm";
import { EleccionForm } from "../pages/eleccionForm";
import EleccionList from "../pages/eleccionList";
import { CargoForm } from "../pages/cargoForm";
import CargosList from "../pages/cargoList";
import { PartidoForm } from "../pages/partidoForm";
import PartidosList from "../pages/partidoList";
import { CandidatoForm } from "../pages/candidatoForm";
import CandidatosList from "../pages/candidatoList";
import { RecintoForm } from "../pages/recintoForm";
import RecintosList from "../pages/recintoList";

const RouterConfig = () => {
    return (
        <Routes>
            <Route path={URLS.HOME} element={<App />} />
            <Route path={URLS.LOGIN} element={<LoginForm />} />
            <Route path={URLS.REGISTER} element={<RegisterForm />} />
            
             <Route path={URLS.SECCIONES} element={<PolygonManager />} />


            <Route path={URLS.PersonasVotantes.CREATE} element={<PersonaVotanteForm />} />
            <Route path={URLS.PersonasVotantes.EDIT_BY_CI} element={<PersonaVotanteForm />} />
            <Route path={URLS.PersonasVotantes.LIST} element={<PersonaVotanteList />} />
            <Route path={URLS.PersonasVotantes.BUSCAR} element={<VoterSearchPage />} />

            <Route path={URLS.Elecciones.CREATE} element={<EleccionForm />} />
            <Route path={URLS.Elecciones.LIST} element={<EleccionList />} />
            <Route path={URLS.Elecciones.EDIT} element={<EleccionForm />} />

            <Route path={URLS.Cargos.CREATE} element={<CargoForm />} />
            <Route path={URLS.Cargos.LIST} element={<CargosList />} />
            <Route path={URLS.Cargos.EDIT} element={<CargoForm />} />

            <Route path={URLS.Partidos.CREATE} element={<PartidoForm />} />
            <Route path={URLS.Partidos.LIST} element={<PartidosList />} />
            <Route path={URLS.Partidos.EDIT} element={<PartidoForm />} />

            <Route path={URLS.Candidatos.CREATE} element={<CandidatoForm />} />
            <Route path={URLS.Candidatos.LIST} element={<CandidatosList />} />
            <Route path={URLS.Candidatos.EDIT} element={<CandidatoForm />} />

             <Route path={URLS.Recintos.CREATE} element={<RecintoForm />} />
            <Route path={URLS.Recintos.LIST} element={<RecintosList />} />
            <Route path={URLS.Recintos.EDIT} element={<RecintoForm />} />







        </Routes>
    );
}
export default RouterConfig;