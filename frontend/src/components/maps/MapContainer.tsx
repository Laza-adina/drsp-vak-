/**
 * 📄 Fichier: src/components/maps/MapContainer.tsx
 * 📝 Description: Container principal de la carte Leaflet
 * 🎯 Usage: Carte interactive avec contrôles et marqueurs
 */

import React, { useEffect } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, useMap } from 'react-leaflet'
import { MAP_CONFIG } from '@/utils/constants'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix pour les icônes Leaflet avec Vite
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

// ========================================
// 🎨 INTERFACE
// ========================================

interface MapContainerProps {
  children?: React.ReactNode
  center?: [number, number]
  zoom?: number
  height?: string | number
  onMapReady?: (map: L.Map) => void
}

// ========================================
// 🗺️ COMPOSANT MAP READY
// ========================================

/**
 * Composant helper pour récupérer l'instance de la carte
 */
const MapReady: React.FC<{ onMapReady?: (map: L.Map) => void }> = ({ onMapReady }) => {
  const map = useMap()

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map)
    }
  }, [map, onMapReady])

  return null
}

// ========================================
// 🗺️ COMPOSANT MAP CONTAINER
// ========================================

/**
 * Container de carte Leaflet avec configuration par défaut
 * 
 * @example
 * <MapContainer center={[-19.5, 46.95]} zoom={10}>
 *   <MarkerCluster markers={casMarkers} />
 * </MapContainer>
 */
const MapContainer: React.FC<MapContainerProps> = ({
  children,
  center = [MAP_CONFIG.CENTER_LAT, MAP_CONFIG.CENTER_LNG],
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  height = '500px',
  onMapReady,
}) => {
  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '8px' }}
      className="z-0"
    >
      {/* ========================================
          🗺️ TILE LAYER (fond de carte OpenStreetMap)
          ======================================== */}
      <TileLayer
        attribution={MAP_CONFIG.ATTRIBUTION}
        url={MAP_CONFIG.TILE_URL}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
        minZoom={MAP_CONFIG.MIN_ZOOM}
      />

      {/* ========================================
          📍 CONTENU PERSONNALISÉ (markers, etc.)
          ======================================== */}
      {children}

      {/* Helper pour callback onMapReady */}
      {onMapReady && <MapReady onMapReady={onMapReady} />}
    </LeafletMapContainer>
  )
}

export default MapContainer
