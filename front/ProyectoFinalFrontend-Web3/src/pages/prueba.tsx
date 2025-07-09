import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

export default function MapaSeccion() {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8001/adminElectoral/secciones/')
      .then(res => res.json())
      .then(data => {
        try {
          const formatted = data.map((item: any) =>
        parseGeoJsonString(item.geojson)
        );
          setPaths(formatted);
        } catch (e) {
          console.error("Error al parsear geojson:", e);
        }
      });
  }, []);
  

  function parseGeoJsonString(str: string): { lat: number; lng: number }[] {
  try {
    // Limpiar saltos de línea
    const clean = str.replace(/[\r\n]/g, "").trim();

    // Asegurar que esté encerrado en corchetes si no lo está
    const wrapped = clean.startsWith("[") ? clean : `[${clean}]`;

    // Reemplazar lat: y lng: por "lat": y "lng":
    const quotedKeys = wrapped
      .replace(/([{,]\s*)lat\s*:/g, '$1"lat":')
      .replace(/([{,]\s*)lng\s*:/g, '$1"lng":');

    return JSON.parse(quotedKeys);
  } catch (error) {
    console.error("Error al parsear geojson:", str, error);
    return [];
  }
}

  return (
    <LoadScript googleMapsApiKey="AIzaSyDwzmR5amAqzcIOSywVjjquY4xGtwHP6bc">
      <GoogleMap
        center={{ lat: -17.8, lng: -63.1 }}
        zoom={7}
        mapContainerStyle={{ width: '100%', height: '500px' }}
      >
        {paths.length > 0 && (
          <Polygon
            path={paths}
            options={{
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              strokeColor: '#FF0000',
              strokeWeight: 2
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
