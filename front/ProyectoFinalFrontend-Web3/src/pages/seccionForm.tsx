import { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";
import { SeccionService } from "../services/seccionService";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: -17.7833,
  lng: -63.1821,
};

const seccionService = new SeccionService();

export default function PolygonManager() {
  const [secciones, setSecciones] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [pendingPolygon, setPendingPolygon] = useState<any | null>(null);
  const [nombre, setNombre] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (!mapLoaded) return;
    cargarSecciones();
  }, [mapLoaded]);

  const cargarSecciones = () => {
    seccionService
      .getSecciones()
      .then((data) => setSecciones(data))
      .catch((err) => console.error("Error al cargar secciones", err));
  };

  const guardarPoligono = () => {
    if (!pendingPolygon || nombre.trim() === "") return;

    const payload = {
      nombre,
      geojson: JSON.stringify(pendingPolygon),
    };

    const accion = editingId
      ? seccionService.updateSeccion(editingId, payload)
      : seccionService.insertSeccion(payload);

    accion
      .then(() => {
        setEditingId(null);
        setNombre("");
        setPendingPolygon(null);
        cargarSecciones();
      })
      .catch((err) => console.error("Error al guardar sección", err));
  };

  const handleDelete = (id: number) => {
    seccionService
      .deleteSeccion(id)
      .then(() => cargarSecciones())
      .catch((err) => console.error("Error al eliminar sección", err));
  };

  const handleEdit = (seccion: any) => {
    setPendingPolygon(seccion.path);
    setNombre(seccion.nombre);
    setEditingId(seccion.id);
  };

  const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    const path = polygon.getPath().getArray().map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    setPendingPolygon(path);
    polygon.setMap(null);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDwzmR5amAqzcIOSywVjjquY4xGtwHP6bc"
      libraries={["drawing"]}
      onLoad={() => setMapLoaded(true)}
    >
      <div style={{ marginBottom: "1rem" }}>
        {pendingPolygon && (
          <div
            style={{
              padding: "10px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h4>{editingId ? "Editar Polígono" : "Nuevo Polígono"}</h4>
            <input
              type="text"
              value={nombre}
              placeholder="Nombre del polígono"
              onChange={(e) => setNombre(e.target.value)}
              style={{
                padding: "8px",
                width: "250px",
                marginRight: "10px",
              }}
            />
            <button
              onClick={guardarPoligono}
              style={{
                padding: "8px 12px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {editingId ? "Actualizar" : "Guardar Polígono"}
            </button>
          </div>
        )}
      </div>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
        {mapLoaded && (
          <DrawingManager
            onPolygonComplete={onPolygonComplete}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                drawingModes: [
                  window.google.maps.drawing.OverlayType.POLYGON,
                ],
                position: window.google.maps.ControlPosition.TOP_CENTER,
              },
              polygonOptions: {
                fillColor: "#4CAF50",
                fillOpacity: 0.5,
                strokeWeight: 2,
                editable: false,
                draggable: false,
              },
            }}
          />
        )}

        {secciones.map((seccion, index) => (
          <Polygon
            key={index}
            paths={seccion.path}
            options={{
              fillColor: "#2196F3",
              fillOpacity: 0.4,
              strokeColor: "#0D47A1",
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
            onClick={() => handleEdit(seccion)}
          />
        ))}

        <div style={{ position: "absolute", top: 10, right: 10 }}>
          {secciones.map((seccion) => (
            <div key={seccion.id} style={{ marginBottom: "5px" }}>
              <strong>{seccion.nombre}</strong>
              <button onClick={() => handleEdit(seccion)}>✏️</button>
              <button onClick={() => handleDelete(seccion.id)}>🗑️</button>
            </div>
          ))}
        </div>
      </GoogleMap>
    </LoadScript>
  );
}
