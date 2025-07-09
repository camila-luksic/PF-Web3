import { useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate, useParams } from "react-router";
import { URLS } from "../navigation/constants";
import { useEffect } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import type { PartidoRequest } from "../models/partidoRequest";
import { PartidoService } from "../services/partidoService";

// ✅ Formulario compatible con backend: secciones es array de ID

type FormInputs = {
  nombre: string;
  sigla:string;
  color:string;

};

export const PartidoForm = () => {
  const navigate = useNavigate();
  useAuth();

  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
  }
  );

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const partido: PartidoRequest = {
      nombre: data.nombre,
      sigla:data.sigla,
      color:data.color,
     
    };
    console.log("Datos a enviar:", partido);

    if (id) {
      updatePartido(partido);
    } else {
      insertPartido(partido);
    }
  };

  const updatePartido = (partido: PartidoRequest) => {
    new PartidoService()
      .updatePartido({ ...partido, id: Number(id) })
      .then(() => navigate(URLS.HOME))
      .catch((error) => {
        console.error("Error al actualizar la elección: ", error);
        alert("Error al actualizar la elección, intente nuevamente");
      });
  };

  const insertPartido = (partido: PartidoRequest) => {
    new PartidoService()
      .insertPartido(partido)
      .then(() => 
        navigate(URLS.HOME)
      )
      .catch((error) => {
        console.error("Error al insertar la elección: ", error);
        alert("Error al insertar elección, intente nuevamente");
      });
  };

  const loadPartido = async (id: string) => {
    new PartidoService().getPartido(id).then((response) => {
      reset({
        nombre: response.nombre,
        sigla:response.sigla,
        color:response.color
      });
    });
  };


  useEffect(() => {
    if (id) loadPartido(id);
  }, [id]);

  return (
    <>
      <Menu />
      <Container>
        <Card title="Formulario Partidos" className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <label htmlFor="nombre">Nombre:</label>
              <Input
                id="nombre"
                type="text"
                {...register("nombre", { required: "El nombre es requerido" })}
              />
              {errors.nombre && <span>{errors.nombre.message}</span>}
            </FormField>
              <FormField>
              <label htmlFor="sigla">Sigla:</label>
              <Input
                id="sigla"
                type="text"
                {...register("sigla", { required: "El nombre es requerido" })}
              />
              {errors.sigla && <span>{errors.sigla.message}</span>}
            </FormField>
              <FormField>
              <label htmlFor="color">Color:</label>
              <Input
                id="color"
                type="text"
                {...register("color", { required: "El nombre es requerido" })}
              />
              {errors.color && <span>{errors.color.message}</span>}
            </FormField>
            <Button type="submit" title="Guardar" />
          </form>
        </Card>
      </Container>
    </>
  );
};
