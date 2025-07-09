import { useForm, type SubmitHandler } from "react-hook-form";
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
import type { RecintoRequest } from "../models/recintoRequest";
import { RecintoService } from "../services/recintoService";
import { SeccionService } from "../services/seccionService";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type FormInputs = {
  nombre: string;
  direccion: string;
  latitud: string;
  longitud: string;
  seccion: string;
  cantidad_mesas:number;
};

export const RecintoForm = () => {
  const navigate = useNavigate();
  useAuth();

  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();

  const [secciones, setSecciones] = useState<{ id: number; nombre: string }[]>(
    []
  );
  const [mapCenter, setMapCenter] = useState({ lat: -17.7833, lng: -63.1821 });
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDwzmR5amAqzcIOSywVjjquY4xGtwHP6bc", // Reemplazá con tu clave real
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const recinto: RecintoRequest = {
      nombre: data.nombre,
      direccion: data.direccion,
      longitud: data.longitud,
      latitud: data.latitud,
      seccion: data.seccion,
      cantidad_mesas:data.cantidad_mesas
    };

    if (id) {
      updateRecinto(recinto);
    } else {
      insertRecinto(recinto);
    }
  };

  const updateRecinto = (recinto: RecintoRequest) => {
    new RecintoService()
      .updateRecinto({ ...recinto, id: Number(id) })
      .then(() => navigate(URLS.HOME))
      .catch((error) => {
        console.error("Error al actualizar el recinto: ", error);
        alert("Error al actualizar el recinto, intente nuevamente");
      });
  };

  const insertRecinto = (recinto: RecintoRequest) => {
    new RecintoService()
      .insertRecinto(recinto)
      .then(() => navigate(URLS.HOME))
      .catch((error) => {
        console.error("Error al insertar el recinto: ", error);
        alert("Error al insertar recinto, intente nuevamente");
      });
  };

  const loadRecinto = async (id: string) => {
    new RecintoService().getRecinto(id).then((response) => {
      reset({
        nombre: response.nombre,
        direccion: response.direccion,
        latitud: response.latitud,
        longitud: response.longitud,
        seccion: response.seccion,
      });
      if (response.latitud && response.longitud) {
        const lat = parseFloat(response.latitud);
        const lng = parseFloat(response.longitud);
        setMapCenter({ lat, lng });
        setMarker({ lat, lng });
      }
    });
  };

  const loadSecciones = () => {
    new SeccionService().getSecciones().then((data) => {
      const resumen = data.map((s) => ({ id: s.id, nombre: s.nombre }));
      setSecciones(resumen);
    });
  };

  useEffect(() => {
    loadSecciones();
    if (id) loadRecinto(id);
  }, [id]);

  useEffect(() => {
    const selectedId = Number(watch("seccion"));
    if (selectedId) {
      new SeccionService().getSeccion(selectedId).then((res) => {
        if (Array.isArray(res.path) && res.path.length > 0) {
        const punto = res.path[0];
        if (punto?.lat && punto?.lng) {
          setMapCenter({ lat: punto.lat, lng: punto.lng });
        }
      }
    });
  }
}, [watch("seccion")]);

  return (
    <>
      <Menu />
      <Container>
        <Card title="Formulario Recintos" className="mx-5 my-5">
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
              <label htmlFor="cantidad_mesas">Cantidad de Mesas:</label>
              <Input
                id="cantidad_mesas"
                type="number"
                {...register("cantidad_mesas", { required: "El n mesas es requerido" })}
              />
              {errors.cantidad_mesas && <span>{errors.cantidad_mesas.message}</span>}
            </FormField>

            <FormField>
              <label htmlFor="seccion">Sección:</label>
              <select
                id="seccion"
                {...register("seccion", { required: "La sección es requerida" })}
              >
                <option value="">Seleccione una sección</option>
                {secciones.map((seccion) => (
                  <option key={seccion.id} value={seccion.id}>
                    {seccion.nombre}
                  </option>
                ))}
              </select>
              {errors.seccion && <span>{errors.seccion.message}</span>}
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
              <label>Ubicación en el mapa (clic para seleccionar):</label>
              {isLoaded && (
                <div style={{ height: "400px", width: "100%" }}>
                  <GoogleMap
                    center={mapCenter}
                    zoom={10}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    onClick={(e) => {
                      const lat = e.latLng?.lat();
                      const lng = e.latLng?.lng();
                      if (lat && lng) {
                        setMarker({ lat, lng });
                        setValue("latitud", lat.toString());
                        setValue("longitud", lng.toString());
                      }
                    }}
                  >
                    {marker && <Marker position={marker} />}
                  </GoogleMap>
                </div>
              )}
            </FormField>

            <input type="hidden" {...register("latitud")} />
            <input type="hidden" {...register("longitud")} />

            <Button type="submit" title="Guardar" />
          </form>
        </Card>
      </Container>
    </>
  );
};
