/**
 * 📄 Fichier: src/components/maps/MarkerCluster.tsx
 * 📝 Description: Marqueurs sur la carte
 * 🎯 Usage: Afficher les cas sur la carte
 */

import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import type { MapMarker } from '@/types/cartographie.types'
import { formatDate } from '@/utils/formatters'
import { getStatusColor } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface MarkerClusterProps {
  markers: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
}

// ========================================
// 📍 COMPOSANT MARKER CLUSTER
// ========================================

/**
 * Marqueurs de cas simples (sans clustering)
 * Si vous voulez le clustering, installez: npm install react-leaflet-markercluster
 */
const MarkerCluster: React.FC<MarkerClusterProps> = ({ markers, onMarkerClick }) => {
  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          eventHandlers={{
            click: () => onMarkerClick?.(marker),
          }}
        >
          {/* ========================================
              💬 POPUP D'INFORMATION
              ======================================== */}
          <Popup>
            <div className="p-2 min-w-[200px]">
              {/* Titre */}
              <h3 className="font-semibold text-gray-900 mb-2">
                Cas #{marker.id}
              </h3>

              {/* Informations */}
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Patient :</span>{' '}
                  {marker.patient_nom}
                </p>
                <p>
                  <span className="font-medium">Maladie :</span>{' '}
                  {marker.maladie_nom}
                </p>
                <p>
                  <span className="font-medium">District :</span>{' '}
                  {marker.district_nom}
                </p>
                <p>
                  <span className="font-medium">Date :</span>{' '}
                  {formatDate(marker.date_debut_symptomes)}
                </p>

                {/* Badge statut */}
                <div className="mt-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full badge-${getStatusColor(marker.statut)}`}
                  >
                    {marker.statut}
                  </span>

                  {/* Badges complémentaires */}
                  {marker.cas_confirme && (
                    <span className="ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full bg-danger-100 text-danger-800">
                      Confirmé
                    </span>
                  )}
                  {marker.cas_deces && (
                    <span className="ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-white">
                      Décès
                    </span>
                  )}
                </div>
              </div>

              {/* Bouton voir détails */}
              {onMarkerClick && (
                <button
                  onClick={() => onMarkerClick(marker)}
                  className="mt-3 w-full btn btn-primary text-xs py-1"
                >
                  Voir les détails
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default MarkerCluster
