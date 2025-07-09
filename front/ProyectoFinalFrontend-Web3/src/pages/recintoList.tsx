import { useEffect, useState } from "react";
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/constants";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { Table } from "../components/Table";
import type { RecintoResponse } from "../models/RecintoResponse";
import { RecintoService } from "../services/recintoService";
import { PersonaVotanteService } from "../services/personaVotanteService";

const RecintosList = () => {
    const navigate = useNavigate()
    useAuth()

     const [recintos, setRecintos] = useState<Array<RecintoResponse>>([]);

    
    const getRecintosList = () => {
        new RecintoService().getRecintos()
            .then((response) => {
                setRecintos(response);
            })
            .catch((error) => {
                console.error("Error al obtener las generos: ", error);
            });
    }
    useEffect(() => {
        getRecintosList()
    }, [])
    const deleteRecinto = (id: string) => {
        const confirmation = window.confirm("¿Está seguro de que desea eliminar esta genero?");
        if (!confirmation) return;
        new RecintoService().deleteRecinto(id)
            .then(() => {
                getRecintosList()
            })
            .catch((error) => {
                console.error("Error al eliminar la eleccion: ", error);
            });
    }

function getApellidoPaterno(apellidos: string): string {
  return apellidos.trim().split(" ")[0] || "";
}
    const handleAsignacion = async (recintoId: number) => {
  const personaService = new PersonaVotanteService();
  const recintoService = new RecintoService();

  try {
    // 1. Obtener todas las personas votantes
    const personas = await personaService.getPersonasVotantes();

    // 2. Filtrar por idRecinto
    const votantesRecinto = personas
     .filter((v) => Number(v.idRecinto) === recintoId)
      .sort((a, b) =>
    getApellidoPaterno(a.apellidos).localeCompare(getApellidoPaterno(b.apellidos))
  );

    if (votantesRecinto.length === 0) {
      alert("Este recinto no tiene votantes registrados.");
      return;
    }

    // 3. Usar el service para asignar (llama al backend)
    await recintoService.asignarVotantesYJurados(recintoId, votantesRecinto);

    alert("Asignación realizada con éxito ✅");
  } catch (error) {
    console.error("Error en la asignación:", error);
    alert("Ocurrió un error al asignar los votantes.");
  }
};
    return (
        <>
            <Menu />
            <Container>
                <Card title="Lista de Recintos">
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre </th>
                                <th>Direccion</th>
                                <th>Seccion</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recintos.map((recinto) => (
                                <tr key={recinto.id}>
                                    <td className="text-center border-t-1 border-gray-300">{recinto.id}</td>
                                    <td className="text-center border-t-1 border-gray-300">{recinto.nombre}</td>
                                     <td className="text-center border-t-1 border-gray-300">{recinto.direccion}</td>
                                    <td className="text-center border-t-1 border-gray-300">{recinto.seccion}</td>
                                    
                                        <button
  onClick={() => handleAsignacion(recinto.id)}
  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
>
  Asignar votantes y jurados
</button>

                                    <td className="text-center border-t-1 border-gray-300"><Button onClick={() => {
                                        navigate(URLS.Recintos.UPDATE(recinto.id.toString()))
                                    }} variant="primary" title="Editar"></Button></td>
                                    <td className="px-3 py-3 text-center border-t-1 border-gray-300"><Button onClick={
                                        () => {
                                            deleteRecinto(recinto.id.toString())
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

export default RecintosList;
