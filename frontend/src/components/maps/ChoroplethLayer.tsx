/**
 * 📄 Fichier: src/components/maps/ChoroplethLayer.tsx
 * 📝 Description: Carte choroplèthe (zones colorées)
 * 🎯 Usage: Colorier les districts selon le nombre de cas
 */

import React from 'react'
import { GeoJSON } from 'react-leaflet'
import type { ChoroplethData } from '@/types/cartographie.types'

// ========================================
// 🎨 INTERFACE
// ========================================

interface ChoroplethLayerProps {
  data: ChoroplethData[]
  geoJsonData: any // GeoJSON des zones géographiques
  onZoneClick?: (data: ChoroplethData) => void
}

// ========================================
// 🎨 COMPOSANT CHOROPLETH LAYER
// ========================================

/**
 * Couche choroplèthe (zones colorées selon valeur)
 * Nécessite des données GeoJSON des districts
 * 
 * @example
 * <MapContainer>
 *   <ChoroplethLayer
 *     data={choroplethData}
 *     geoJsonData={districtsGeoJson}
 *     onZoneClick={(zone) => console.log(zone)}
 *   />
 * </MapContainer>
 */
const ChoroplethLayer: React.FC<ChoroplethLayerProps> = ({
  data,
  geoJsonData,
  onZoneClick,
}) => {
  // ========================================
  // 🎨 STYLE DES ZONES
  // ========================================
  const style = (feature: any) => {
    // Trouver les données correspondantes
    const zoneData = data.find(
      (d) => d.zone_nom === feature.properties.nom
    )

    return {
      fillColor: zoneData?.couleur || '#cccccc',
      weight: 2,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.7,
    }
  }

  // ========================================
  // 📍 ÉVÉNEMENTS
  // ========================================
  const onEachFeature = (feature: any, layer: any) => {
    // Popup au survol
    const zoneData = data.find(
      (d) => d.zone_nom === feature.properties.nom
    )

    if (zoneData) {
      layer.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${zoneData.zone_nom}</h3>
          <p class="text-sm mt-1">
            <strong>Cas :</strong> ${zoneData.valeur}
          </p>
        </div>
      `)
    }

    // Événement clic
    layer.on({
      click: () => {
        if (onZoneClick && zoneData) {
          onZoneClick(zoneData)
        }
      },
      mouseover: () => {
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.9,
        })
      },
      mouseout: () => {
        layer.setStyle({
          weight: 2,
          fillOpacity: 0.7,
        })
      },
    })
  }

  return (
    <GeoJSON
      data={geoJsonData}
      style={style}
      onEachFeature={onEachFeature}
    />
  )
}

export default ChoroplethLayer
