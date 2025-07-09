import type{ SubmitHandler } from "react-hook-form"
 import{useForm } from "react-hook-form"
import { Input } from "../components/Input"
import { FormField } from "../components/FormField"
import { Card } from '../components/Card';
import { Button } from "../components/Button";
import { useNavigate, useParams } from "react-router";
import { URLS } from "../navigation/constants";
import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { FileInput } from "../components/FileInput";
import type { CandidatoRequest } from "../models/candidatoRequest";
import { CandidatoService } from "../services/candidatoService";
import { CargoService } from "../services/cargoService";
import { PartidoService } from "../services/partidoService";

type FormInputs = {
    ci: string;
    nombre: string;
    cargo: string;
    partido:string;
    foto?: FileList;
}

export const CandidatoForm = () => {
    const navigate = useNavigate()
    useAuth()

    const { id } = useParams<{ id: string }>();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormInputs>()
    const [partidos, setPartidos] = useState<{ id: number; nombre: string }[]>([]);
     const [cargos, setCargos] = useState<{ id: number; nombre: string }[]>([]);
    

    const onSubmit: SubmitHandler<FormInputs> = (data) => {

    // Crear objeto para el servicio
    const candidato: CandidatoRequest = {
        id,
        ci: data.ci,
        nombre: data.nombre,
        cargo: data.cargo,
        partido:data.partido,
        foto: data.foto?.[0], // Si es undefined o tiene length 0, esto será undefined
    };

      console.log("Candidato a enviar:", candidato); // 👈 LOG PARA DEPURAR


    if (id) {
        updateCandidato(candidato);
    } else {
        insertCandidato(candidato);
    }
};
    const updateCandidato = (candidato: CandidatoRequest) => {
        new CandidatoService()
            .updateCandidato(candidato)
            .then(() => {
                navigate(URLS.HOME)
            })
            .catch((error) => {
                console.error("Error al actualizar la persona: ", error)
                alert("Error al actualizar persona, intente nuevamente");
            });
    }

    const insertCandidato = (candidato: CandidatoRequest) => {
        new CandidatoService()
            .insertCandidato(candidato)
            .then(() => {
                navigate(URLS.HOME)
            })
            .catch((error) => {
                console.error("Error al insertar la persona: ", error)
                alert("Error al insertar persona, intente nuevamente");
            });
    }

    const loadCandidato = async (id: string) => {
        new CandidatoService()
            .getCandidato(id!)
            .then((response) => {
                reset({
                    ci: response.ci.toString(),
                    nombre: response.nombre,
                })
            });
    }

     const loadCargos = () => {
        new CargoService().getCargos().then((data) => {
          const resumen = data.map((s) => ({ id: s.id, nombre: s.nombre }));
          setCargos(resumen);
        });
      };

       const loadPartidos = () => {
        new PartidoService().getPartidos().then((data) => {
          const resumen = data.map((s) => ({ id: s.id, nombre: s.nombre }));
          setPartidos(resumen);
        });
      };

    useEffect(() => {
        loadCargos()
        loadPartidos()
        if (!id) {
            return;
        }
        loadCandidato(id);

    }, [id])

    return (<>
        <Menu />
        <Container>
            <Card title="Formulario Candidato " className="mx-5 my-5">
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <FormField>
                            <label htmlFor="ci">CI:</label>
                            <Input
                                id="ci"
                                type="number" // Tipo number para CI
                                {...register("ci", { required: "El CI es requerido" })}
                                // Deshabilitar si estamos editando para evitar cambiar el CI de un registro existente
                                disabled={!!id}
                            />
                            {errors.ci && <span>{errors.ci.message}</span>}
                        </FormField>

                        <FormField>
                            <label htmlFor="nombreCompleto">Nombre Completo:</label>
                            <Input
                                id="nombreCompleto"
                                type="text"
                                {...register("nombre", { required: "El nombre completo es requerido" })}
                            />
                            {errors.nombre && <span>{errors.nombre.message}</span>}
                        </FormField>

                        <FormField>
  <label htmlFor="cargo">Cargo:</label>
  <select id="cargo" {...register("cargo", { required: "El cargo es requerido" })}>
    <option value="">Seleccione un cargo</option>
    {cargos.map((cargo) => (
      <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
    ))}
  </select>
  {errors.cargo && <span>{errors.cargo.message}</span>}
</FormField>

<FormField>
  <label htmlFor="partido">Partido:</label>
  <select id="partido" {...register("partido", { required: "El partido es requerido" })}>
    <option value="">Seleccione un partido</option>
    {partidos.map((partido) => (
      <option key={partido.id} value={partido.id}>{partido.nombre}</option>
    ))}
  </select>
  {errors.partido && <span>{errors.partido.message}</span>}
</FormField>


                        <FormField>
                            <label htmlFor="foto">Foto  :</label>
                            <FileInput
                                id="foto"
                                type="file"
                                accept="image/*"
                                {...register("foto")}
                            />
                            {errors.foto && <span>{errors.foto.message}</span>}
                        </FormField>

                    <Button type="submit" title="Guardar" />
                </form>
            </Card>
        </Container>
    </>
    );
}