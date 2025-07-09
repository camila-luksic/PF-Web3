import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { PersonaVotanteResponse } from '../models/PersonaVotanteResponse';
import type { RecintoResponse } from '../models/RecintoResponse';
import { PersonaVotanteService } from '../services/personaVotanteService';
import { RecintoService } from '../services/recintoService';

import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const VoterSearchPage: React.FC = () => {
    const [ci, setCi] = useState('');
    const [personaVotante, setPersonaVotante] = useState<PersonaVotanteResponse | null>(null);
    const [recinto, setRecinto] = useState<RecintoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const personaVotanteService = new PersonaVotanteService();
    const recintoService = new RecintoService();

    const handleSearch = async () => {
        if (!ci.trim()) {
            setError("Por favor, ingrese un número de CI.");
            setPersonaVotante(null);
            return;
        }

        setLoading(true);
        setError(null);
        setPersonaVotante(null);
        setRecinto(null);

        try {
            const data = await personaVotanteService.getPersonaVotante(ci.trim());
            setPersonaVotante(data);

            if (data.idRecinto) {
                const recintoData = await recintoService.getRecinto(data.idRecinto.toString());
                setRecinto(recintoData);
            }
        } catch (err: any) {
            console.error("Error al buscar:", err);
            if (err.message.includes("404")) {
                setError(`El CI "${ci.trim()}" no se encuentra registrado.`);
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card title="Búsqueda de Votantes">
                <div className="mb-6">
                    <label htmlFor="ciInput" className="block mb-2">Ingrese su CI:</label>
                    <input
                        type="text"
                        id="ciInput"
                        className="border rounded w-full p-3"
                        placeholder="Ej. 1234567"
                        value={ci}
                        onChange={(e) => setCi(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    />
                </div>
                <div className="flex justify-center mb-6">
                    <Button title={loading ? "Buscando..." : "Buscar"} variant="primary" onClick={handleSearch} />
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
                )}

                {personaVotante && (
                    <div className="bg-blue-50 p-6 rounded shadow mb-6">
                        <h3 className="text-lg font-bold mb-4 text-center">Datos del Votante</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>CI:</strong> {personaVotante.ci}</p>
                            <p><strong>Nombres:</strong> {personaVotante.nombres}</p>
                             <p><strong>Apellidos:</strong> {personaVotante.apellidos}</p>
                            <p><strong>ID Recinto:</strong> {personaVotante.idRecinto}</p>
                        </div>
                    </div>
                )}

                {recinto && (
                    <div className="mb-6">
                        <h4 className="text-center text-blue-700 font-semibold mb-2">Ubicación del Recinto: {recinto.nombre}</h4>
                        <MapContainer
                         center={[
                    Number(recinto.latitud),
                    Number(recinto.longitud),
                  ]}
                            zoom={16}
                            style={{ height: '300px', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker  position={[
                      Number(recinto.latitud),
                      Number(recinto.longitud),
                    ]}>
                                <Popup>{recinto.nombre}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                )}

                {loading && (
                    <div className="text-center text-blue-600">Cargando datos...</div>
                )}
            </Card>
        </Container>
    );
};

export default VoterSearchPage;
