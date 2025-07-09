import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate, useParams } from "react-router";
import { URLS } from "../navigation/constants";
import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import type { EleccionRequest } from "../models/eleccionRequest";
import { EleccionService } from "../services/eleccionService";
import { SeccionService } from "../services/seccionService";

// ✅ Formulario compatible con backend: secciones es array de ID

type FormInputs = {
  nombre: string;
  tipo: string;
  fecha: string;
  secciones: number[];
};

export const EleccionForm = () => {
  const navigate = useNavigate();
  useAuth();

  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
      defaultValues: {
      secciones: [],
    },
  }
  );

  const [seccionesDisponibles, setSeccionesDisponibles] = useState<{ id: number; nombre: string }[]>([]);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const eleccion: EleccionRequest = {
      nombre: data.nombre,
      tipo: data.tipo,
      fecha: data.fecha,
      secciones: data.secciones || [],
    };
    console.log("Datos a enviar:", eleccion);

    if (id) {
      updateEleccion(eleccion);
    } else {
      insertEleccion(eleccion);
    }
  };

  const updateEleccion = (eleccion: EleccionRequest) => {
    new EleccionService()
      .updateEleccion({ ...eleccion, id: Number(id) })
      .then(() => navigate(URLS.HOME))
      .catch((error) => {
        console.error("Error al actualizar la elección: ", error);
        alert("Error al actualizar la elección, intente nuevamente");
      });
  };

  const insertEleccion = (eleccion: EleccionRequest) => {
    new EleccionService()
      .insertEleccion(eleccion)
      .then(() => 
        navigate(URLS.HOME)
      )
      .catch((error) => {
        console.error("Error al insertar la elección: ", error);
        alert("Error al insertar elección, intente nuevamente");
      });
  };

  const loadEleccion = async (id: string) => {
    new EleccionService().getEleccion(id).then((response) => {
      reset({
        nombre: response.nombre,
        tipo: response.tipo,
        fecha: response.fecha,
        secciones: response.secciones || [],
      });
    });
  };

  const loadSecciones = () => {
    new SeccionService().getSecciones().then((data) => {
      const resumen = data.map((s) => ({ id: s.id, nombre: s.nombre }));
      setSeccionesDisponibles(resumen);
    });
  };

  useEffect(() => {
    loadSecciones();
    if (id) loadEleccion(id);
  }, [id]);
  return (
    <>
      <Menu />
      <Container>
        <Card title="Formulario Elección" className="mx-5 my-5">
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
              <label htmlFor="tipo">Tipo:</label>
              <Input
                id="tipo"
                type="text"
                {...register("tipo", { required: "El tipo es requerido" })}
              />
              {errors.tipo && <span>{errors.tipo.message}</span>}
            </FormField>

            <FormField>
              <label htmlFor="fecha">Fecha:</label>
              <Input
                id="fecha"
                type="date"
                {...register("fecha", { required: "La fecha es requerida" })}
              />
              {errors.fecha && <span>{errors.fecha.message}</span>}
            </FormField>
        <FormField>
  <label>Secciones:</label>
  <Controller
    control={control}
    name="secciones"
    rules={{ required: "Seleccione al menos una sección" }}
    render={({ field }) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        {seccionesDisponibles.map((seccion) => (
          <label
            key={seccion.id}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <input
              type="checkbox"
              value={seccion.id}
              checked={field.value?.includes(seccion.id) || false}
              onChange={(e) => {
                const value = Number(e.target.value);
                const newValue = field.value?.includes(value)
                  ? field.value.filter((id: number) => id !== value)
                  : [...(field.value || []), value];
                field.onChange(newValue);
              }}
            />
            {seccion.nombre}
          </label>
        ))}
      </div>
    )}
  />
  {errors.secciones && <span>{errors.secciones.message}</span>}
</FormField>

            <Button type="submit" title="Guardar" />
          </form>
        </Card>
      </Container>
    </>
  );
};
