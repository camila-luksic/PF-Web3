import { useEffect, useState } from "react";
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/constants";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { Table } from "../components/Table";
import type { CandidatoResponse } from "../models/candidatoResponse";
import { CandidatoService } from "../services/candidatoService";

const CandidatosList = () => {
    const navigate = useNavigate()
    useAuth()

     const [candidatos, setCandidatos] = useState<Array<CandidatoResponse>>([]);

    
    const getCandidatosList = () => {
        new CandidatoService().getCandidatos()
            .then((response) => {
                setCandidatos(response);
            })
            .catch((error) => {
                console.error("Error al obtener las generos: ", error);
            });
    }
    useEffect(() => {
        getCandidatosList()
    }, [])
    const deleteCandidato = (id: string) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar esta genero?");
        if (!confirmation) return;
        new CandidatoService().deleteCandidato(id)
            .then(() => {
                getCandidatosList()
            })
            .catch((error) => {
                console.error("Error al eliminar la eleccion: ", error);
            });
    }
    return (
        <>
            <Menu />
            <Container>
                <Card title="Lista de Candidatos">
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre </th>
                                <th>CI</th>
                                <th>Cargo</th>
                                <th>Partido</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatos.map((candidato) => (
                                <tr key={candidato.id}>
                                    <td className="text-center border-t-1 border-gray-300">{candidato.id}</td>
                                    <td className="text-center border-t-1 border-gray-300">{candidato.nombre}</td>
                                    <td className="text-center border-t-1 border-gray-300">{candidato.ci}</td>
                                     <td className="text-center border-t-1 border-gray-300">{candidato.cargo}</td>
                                    <td className="text-center border-t-1 border-gray-300">{candidato.partido}</td>
                                    <td className="text-center border-t-1 border-gray-300"><Button onClick={() => {
                                        navigate(URLS.Candidatos.UPDATE(candidato.id.toString()))
                                    }} variant="primary" title="Editar"></Button></td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300"><Button onClick={
                                        () => {
                                            deleteCandidato(candidato.id.toString())
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

export default CandidatosList;
