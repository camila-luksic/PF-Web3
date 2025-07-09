import { useEffect, useState } from "react";
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/constants";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { Table } from "../components/Table";
import type { PartidoResponse } from "../models/partidoResponse";
import { PartidoService } from "../services/partidoService";

const PartidosList = () => {
    const navigate = useNavigate()
    useAuth()

     const [partidos, setPartidos] = useState<Array<PartidoResponse>>([]);

    
    const getPartidosList = () => {
        new PartidoService().getPartidos()
            .then((response) => {
                setPartidos(response);
            })
            .catch((error) => {
                console.error("Error al obtener las generos: ", error);
            });
    }
    useEffect(() => {
        getPartidosList()
    }, [])
    const deletePartido = (id: string) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar esta genero?");
        if (!confirmation) return;
        new PartidoService().deletePartido(id)
            .then(() => {
                getPartidosList()
            })
            .catch((error) => {
                console.error("Error al eliminar la eleccion: ", error);
            });
    }
    return (
        <>
            <Menu />
            <Container>
                <Card title="Lista de Partidos">
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre </th>
                                <th>Sigla</th>
                                <th>Color</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {partidos.map((partido) => (
                                <tr key={partido.id}>
                                    <td className="text-center border-t-1 border-gray-300">{partido.id}</td>
                                    <td className="text-center border-t-1 border-gray-300">{partido.nombre}</td>
                                    <td className="text-center border-t-1 border-gray-300">{partido.sigla}</td>
                                    <td className="text-center border-t-1 border-gray-300">{partido.color}</td>
                                    <td className="text-center border-t-1 border-gray-300"><Button onClick={() => {
                                        navigate(URLS.Partidos.UPDATE(partido.id.toString()))
                                    }} variant="primary" title="Editar"></Button></td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300"><Button onClick={
                                        () => {
                                            deletePartido(partido.id.toString())
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

export default PartidosList;
