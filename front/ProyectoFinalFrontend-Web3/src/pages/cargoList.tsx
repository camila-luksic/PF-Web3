import { useEffect, useState } from "react";
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/constants";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { Table } from "../components/Table";
import type { CargoResponse } from "../models/cargoResponse";
import { CargoService } from "../services/cargoService";

const CargosList = () => {
    const navigate = useNavigate()
    useAuth()

     const [cargos, setCargos] = useState<Array<CargoResponse>>([]);

    
    const getCargosList = () => {
        new CargoService().getCargos()
            .then((response) => {
                setCargos(response);
            })
            .catch((error) => {
                console.error("Error al obtener las generos: ", error);
            });
    }
    useEffect(() => {
        getCargosList()
    }, [])
    const deleteCargo = (id: string) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar esta genero?");
        if (!confirmation) return;
        new CargoService().deleteCargo(id)
            .then(() => {
                getCargosList()
            })
            .catch((error) => {
                console.error("Error al eliminar la eleccion: ", error);
            });
    }
    return (
        <>
            <Menu />
            <Container>
                <Card title="Lista de Cargos">
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
                            {cargos.map((cargo) => (
                                <tr key={cargo.id}>
                                    <td className="text-center border-t-1 border-gray-300">{cargo.id}</td>
                                    <td className="text-center border-t-1 border-gray-300">{cargo.nombre}</td>
                                    <td className="text-center border-t-1 border-gray-300"><Button onClick={() => {
                                        navigate(URLS.Cargos.UPDATE(cargo.id.toString()))
                                    }} variant="primary" title="Editar"></Button></td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300"><Button onClick={
                                        () => {
                                            deleteCargo(cargo.id.toString())
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

export default CargosList;
