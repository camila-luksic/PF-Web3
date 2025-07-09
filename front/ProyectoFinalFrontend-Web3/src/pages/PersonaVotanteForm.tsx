import { useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { PersonaVotanteService } from "../services/personaVotanteService";
import type { PersonaVotanteRequest } from "../models/PersonaVotanteRequest";
import { useNavigate, useParams } from "react-router";
import { URLS } from "../navigation/constants";
import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useAuth } from "../hooks/useAuth";
import { FileInput } from "../components/FileInput";
import type { RecintoResponse } from "../models/RecintoResponse";
import { RecintoService } from "../services/recintoService";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para íconos que no se cargan en algunos entornos
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Componente para mover el mapa al centro del nuevo recinto
const MoverMapa = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16);
  }, [lat, lng, map]);
  return null;
};

type FormInputs = {
  ci: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  idRecinto: string;
  fotoCarnetAnverso?: FileList;
  fotoCarnetReverso?: FileList;
  fotoVotante?: FileList;
};

export const PersonaVotanteForm = () => {
  const navigate = useNavigate();
  useAuth();

  const { ci } = useParams<{ ci: string }>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const [recintos, setRecintos] = useState<RecintoResponse[]>([]);
  const [recintoSeleccionado, setRecintoSeleccionado] = useState<RecintoResponse | null>(null);

  useEffect(() => {
    new RecintoService().getRecintos().then(setRecintos);
  }, []);

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const personaVotante: PersonaVotanteRequest = {
      ci: data.ci,
      nombres: data.nombres,
      apellidos:data.apellidos,
      direccion: data.direccion,
      idRecinto: data.idRecinto,
      fotoCarnetAnverso: data.fotoCarnetAnverso?.[0],
      fotoCarnetReverso: data.fotoCarnetReverso?.[0],
      fotoVotante: data.fotoVotante?.[0],
    };

    if (ci) {
      updatePersonaVotante(personaVotante);
    } else {
      insertPersonaVotante(personaVotante);
    }
  };

  const updatePersonaVotante = (personaVotante: PersonaVotanteRequest) => {
    new PersonaVotanteService()
      .updatePersonaVotante(personaVotante)
      .then(() => navigate(URLS.HOME))
      .catch((error) => {
        console.error("Error al actualizar la persona: ", error);
        alert("Error al actualizar persona, intente nuevamente");
      });
  };

  const insertPersonaVotante = (personaVotante: PersonaVotanteRequest) => {
    
        console.log("antes de enviar"+personaVotante)
    new PersonaVotanteService()
      .insertPersonaVotante(personaVotante)
      .then(() =>
         //navigate(URLS.HOME)
      console.log(personaVotante)
      )
      .catch((error) => {
        console.error("Error al insertar la persona: ", error);
        alert("Error al insertar persona, intente nuevamente");
      });
  };

  const loadPersonaVotante = async (ci: string) => {
    new PersonaVotanteService().getPersonaVotante(ci).then((response) => {
      reset({
        ci: response.ci.toString(),
        nombres: response.nombres,
        apellidos:response.apellidos,
        direccion: response.direccion,
        idRecinto: response.idRecinto,
      });

      const recinto = recintos.find((r) => r.id.toString() == response.idRecinto);
      if (recinto) setRecintoSeleccionado(recinto);
    });
  };

  useEffect(() => {
    if (ci) loadPersonaVotante(ci);
  }, [ci, recintos]);

  return (
    <>
      <Menu />
      <Container>
        <Card title="Formulario Persona Votante" className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <FormField>
              <label htmlFor="ci">CI:</label>
              <Input id="ci" type="number" {...register("ci", { required: "El CI es requerido" })} disabled={!!ci} />
              {errors.ci && <span>{errors.ci.message}</span>}
            </FormField>

            <FormField>
              <label htmlFor="nombres">Nombres:</label>
              <Input
                id="nombres"
                type="text"
                {...register("nombres", { required: "El nombre  es requerido" })}
              />
              {errors.nombres && <span>{errors.nombres.message}</span>}
            </FormField>
              <FormField>
              <label htmlFor="apellidos">Apellidos :</label>
              <Input
                id="apellidos"
                type="text"
                {...register("apellidos", { required: "El apellido completo es requerido" })}
              />
              {errors.apellidos && <span>{errors.apellidos.message}</span>}
            </FormField>

            <FormField>
              <label htmlFor="direccion">Dirección:</label>
              <Input
                id="direccion"
                type="text"
                {...register("direccion", { required: "La dirección es requerida" })}
              />
              {errors.direccion && <span>{errors.direccion.message}</span>}
            </FormField>

            <FormField>
              <label htmlFor="idRecinto">Recinto:</label>
              <select
                id="idRecinto"
                {...register("idRecinto", { required: "Debe seleccionar un recinto" })}
                onChange={(e) => {
                  const selected = recintos.find((r) => r.id === parseInt(e.target.value));
                  setRecintoSeleccionado(selected || null);
                }}
              >
                <option value="">Seleccione un recinto</option>
                {recintos.map((recinto) => (
                  <option key={recinto.id} value={recinto.id}>
                    {recinto.nombre}
                  </option>
                ))}
              </select>
              {errors.idRecinto && <span>{errors.idRecinto.message}</span>}
            </FormField>

            {recintoSeleccionado && (
              <div className="h-60 mt-2 rounded overflow-hidden">
                <MapContainer
                  center={[
                    Number(recintoSeleccionado.latitud),
                    Number(recintoSeleccionado.longitud),
                  ]}
                  zoom={16}
                  scrollWheelZoom={false}
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MoverMapa
                    lat={Number(recintoSeleccionado.latitud)}
                    lng={Number(recintoSeleccionado.longitud)}
                  />
                  <Marker
                    position={[
                      Number(recintoSeleccionado.latitud),
                      Number(recintoSeleccionado.longitud),
                    ]}
                  />
                </MapContainer>
              </div>
            )}

            <FormField>
              <label htmlFor="fotoCarnetAnverso">Foto Carnet Anverso:</label>
              <FileInput
                id="fotoCarnetAnverso"
                type="file"
                accept="image/*"
                {...register("fotoCarnetAnverso")}
              />
            </FormField>

            <FormField>
              <label htmlFor="fotoCarnetReverso">Foto Carnet Reverso:</label>
              <FileInput
                id="fotoCarnetReverso"
                type="file"
                accept="image/*"
                {...register("fotoCarnetReverso")}
              />
            </FormField>

            <FormField>
              <label htmlFor="fotoVotante">Foto Votante:</label>
              <FileInput
                id="fotoVotante"
                type="file"
                accept="image/*"
                {...register("fotoVotante")}
              />
            </FormField>

            <Button type="submit" title="Guardar" />
          </form>
        </Card>
      </Container>
    </>
  );
};
