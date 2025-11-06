/**
 * 📄 Fichier: src/components/maps/HeatmapLayer.tsx
 * 📝 Description: Carte de chaleur (densité de cas)
 * 🎯 Usage: Visualiser les zones à forte concentration de cas
 */

import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'
import type { HeatmapPoint } from '@/types/cartographie.types'

// ========================================
// 🎨 INTERFACE
// ========================================

interface HeatmapLayerProps {
  points: HeatmapPoint[]
  radius?: number
  blur?: number
  maxZoom?: number
}

// ========================================
// 🔥 COMPOSANT HEATMAP LAYER
// ========================================

/**
 * Couche de carte de chaleur
 * Nécessite leaflet.heat
 * 
 * @example
 * <MapContainer>
 *   <HeatmapLayer
 *     points={heatmapData}
 *     radius={25}
 *     blur={15}
 *   />
 * </MapContainer>
 */
const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  points,
  radius = 25,
  blur = 15,
  maxZoom = 17,
}) => {
  const map = useMap()

  useEffect(() => {
    if (!points || points.length === 0) return

    // Convertir les points au format leaflet.heat
    const heatmapData: [number, number, number][] = points.map((point) => [
      point.lat,
      point.lng,
      point.intensity,
    ])

    // Créer la couche heatmap
    // @ts-ignore (leaflet.heat n'a pas de types TypeScript)
    const heatLayer = L.heatLayer(heatmapData, {
      radius,
      blur,
      maxZoom,
      gradient: {
        0.0: 'blue',
        0.5: 'lime',
        0.7: 'yellow',
        1.0: 'red',
      },
    })

    // Ajouter la couche à la carte
    heatLayer.addTo(map)

    // Nettoyer la couche au démontage
    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, points, radius, blur, maxZoom])

  return null
}

export default HeatmapLayer
