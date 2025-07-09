import { useEffect, useState } from "react";
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/constants";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { Table } from "../components/Table";
import type { EleccionResponse } from "../models/eleccionResponse";
import { EleccionService } from "../services/eleccionService";

const EleccionList = () => {
    const navigate = useNavigate()
    useAuth()

     const [elecciones, setElecciones] = useState<Array<EleccionResponse>>([]);

    
    const getEleccionesList = () => {
        new EleccionService().getElecciones()
            .then((response) => {
                setElecciones(response);
            })
            .catch((error) => {
                console.error("Error al obtener las generos: ", error);
            });
    }
    useEffect(() => {
        getEleccionesList()
    }, [])
    const deleteEleccion = (id: string) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar esta genero?");
        if (!confirmation) return;
        new EleccionService().deleteEleccion(id)
            .then(() => {
                getEleccionesList()
            })
            .catch((error) => {
                console.error("Error al eliminar la eleccion: ", error);
            });
    }
    return (
        <>
            <Menu />
            <Container>
                <Card title="Lista de Eleccions">
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre </th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {elecciones.map((eleccion) => (
                                <tr key={eleccion.id}>
                                    <td className="text-center border-t-1 border-gray-300">{eleccion.id}</td>
                                    <td className="text-center border-t-1 border-gray-300">{eleccion.nombre}</td>
                                    <td className="text-center border-t-1 border-gray-300"><Button onClick={() => {
                                        navigate(URLS.Elecciones.UPDATE(eleccion.id.toString()))
                                    }} variant="primary" title="Editar"></Button></td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300"><Button onClick={
                                        () => {
                                            deleteEleccion(eleccion.id.toString())
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

export default EleccionList;
