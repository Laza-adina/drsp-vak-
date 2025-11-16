/**
 * 📄 Fichier: src/features/cartographie/components/MapWithMarkers.tsx
 * 📝 Carte avec marqueurs colorés selon le statut
 */

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Cas } from '@/types/cas.types'

// Icônes personnalisées selon le statut
const getMarkerIcon = (statut: string) => {
  const colors = {
    suspect: '#EAB308',    // jaune
    probable: '#F97316',   // orange
    confirme: '#EF4444',   // rouge
    gueri: '#10B981',      // vert
    decede: '#374151',     // gris foncé
  }

  const color = colors[statut as keyof typeof colors] || '#6B7280'

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

// Composant pour centrer la carte
const FitBounds: React.FC<{ cas: Cas[] }> = ({ cas }) => {
  const map = useMap()

  React.useEffect(() => {
    if (cas.length > 0) {
      const bounds = L.latLngBounds(
        cas.map(c => [c.latitude!, c.longitude!])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [cas, map])

  return null
}

interface MapWithMarkersProps {
  cas: Cas[]
  onMarkerClick?: (id: number) => void
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ cas, onMarkerClick }) => {
  // Centre par défaut (Madagascar/Vakinankaratra)
  const defaultCenter: [number, number] = [-19.5, 47.0]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={9}
      style={{ height: '600px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {cas.map((c) => (
        <Marker
          key={c.id}
          position={[c.latitude!, c.longitude!]}
          icon={getMarkerIcon(c.statut)}
          eventHandlers={{
            click: () => onMarkerClick?.(c.id),
          }}
        >
          <Popup>
            <div className="p-2">
              <p className="font-semibold text-gray-900">{c.numero_cas}</p>
              {c.nom && <p className="text-sm text-gray-600">{c.nom}</p>}
              <p className="text-sm text-gray-600">{c.maladie?.nom}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className={`px-2 py-1 rounded text-xs ${
                  c.statut === 'confirme' ? 'bg-red-100 text-red-800' :
                  c.statut === 'suspect' ? 'bg-yellow-100 text-yellow-800' :
                  c.statut === 'probable' ? 'bg-orange-100 text-orange-800' :
                  c.statut === 'gueri' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {c.statut}
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      <FitBounds cas={cas} />

      {/* Légende */}
      <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control bg-white rounded-lg shadow-lg p-4 m-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Légende</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" />
              <span className="text-xs text-gray-700">Suspect</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
              <span className="text-xs text-gray-700">Probable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              <span className="text-xs text-gray-700">Confirmé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              <span className="text-xs text-gray-700">Guéri</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-700 rounded-full border-2 border-white" />
              <span className="text-xs text-gray-700">Décédé</span>
            </div>
          </div>
        </div>
      </div>
    </MapContainer>
  )
}

export default MapWithMarkers
