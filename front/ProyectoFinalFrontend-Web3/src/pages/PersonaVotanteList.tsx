import { useEffect, useState } from "react";
import { Card } from '../components/Card';
import {PersonaVotanteService } from "../services/personaVotanteService";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/constants";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { Table } from "../components/Table";
import type { PersonaVotanteResponse } from "../models/PersonaVotanteResponse";

const PersonaVotanteList = () => {
    const navigate = useNavigate()
    useAuth()

     const [personasVotantes, setPersonasVotantes] = useState<Array<PersonaVotanteResponse>>([]);

    
    const getpersonaVotantesList = () => {
        new PersonaVotanteService().getPersonasVotantes()
            .then((response) => {
                setPersonasVotantes(response);
            })
            .catch((error) => {
                console.error("Error al obtener las generos: ", error);
            });
    }
    useEffect(() => {
        getpersonaVotantesList()
    }, [])
    const deletePersonaVotante = (ci: string) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar esta genero?");
        if (!confirmation) return;
        new PersonaVotanteService().deletePersonaVotante(ci)
            .then(() => {
                getpersonaVotantesList()
            })
            .catch((error) => {
                console.error("Error al eliminar la persona: ", error);
            });
    }
    return (
        <>
            <Menu />
            <Container>
                <Card title="Lista de Personas">
                    <Table>
                        <thead>
                            <tr>
                                <th>CI</th>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {personasVotantes.map((persona) => (
                                <tr key={persona.ci}>
                                    <td className="text-center border-t-1 border-gray-300">{persona.ci}</td>
                                    <td className="text-center border-t-1 border-gray-300">{persona.nombres}</td>
                                    <td className="text-center border-t-1 border-gray-300">{persona.apellidos}</td>
                                    <td className="text-center border-t-1 border-gray-300"><Button onClick={() => {
                                        navigate(URLS.PersonasVotantes.UPDATE_BY_CI(persona.ci.toString()))
                                    }} variant="primary" title="Editar"></Button></td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300"><Button onClick={
                                        () => {
                                            deletePersonaVotante(persona.ci.toString())
                                        }
                                    } variant="danger" title="Eliminar"></Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </Container>
        </>
    );
}

export default PersonaVotanteList;
