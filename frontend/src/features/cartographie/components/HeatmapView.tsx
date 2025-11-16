/**
 * 📄 Fichier: src/features/cartographie/components/HeatmapView.tsx
 * 📝 Carte de chaleur par district
 */

import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Cas } from '@/types/cas.types'
import type { District } from '@/types/cas.types'

interface HeatmapViewProps {
  cas: Cas[]
  districts: District[]
}

const FitBounds: React.FC<{ districts: District[] }> = ({ districts }) => {
  const map = useMap()

  React.useEffect(() => {
    if (districts.length > 0) {
      const validDistricts = districts.filter(d => d.latitude && d.longitude)
      if (validDistricts.length > 0) {
        const bounds = L.latLngBounds(
          validDistricts.map(d => [d.latitude!, d.longitude!])
        )
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [districts, map])

  return null
}

const HeatmapView: React.FC<HeatmapViewProps> = ({ cas, districts }) => {
  // Calculer le nombre de cas par district
  const districtStats = useMemo(() => {
    const stats = new Map<number, number>()
    cas.forEach(c => {
      const count = stats.get(c.district_id) || 0
      stats.set(c.district_id, count + 1)
    })
    return stats
  }, [cas])

  // Trouver le max pour normaliser les couleurs
  const maxCas = Math.max(...Array.from(districtStats.values()), 1)

  // Fonction pour obtenir la couleur selon l'intensité
  const getColor = (count: number) => {
    const intensity = count / maxCas
    if (intensity > 0.7) return '#DC2626' // rouge foncé
    if (intensity > 0.5) return '#EF4444' // rouge
    if (intensity > 0.3) return '#F97316' // orange
    if (intensity > 0.1) return '#EAB308' // jaune
    return '#10B981' // vert
  }

  // Fonction pour obtenir la taille du cercle
  const getRadius = (count: number) => {
    const minRadius = 5000
    const maxRadius = 25000
    const ratio = count / maxCas
    return minRadius + (ratio * (maxRadius - minRadius))
  }

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

      {districts
        .filter(d => d.latitude && d.longitude)
        .map((district) => {
          const casCount = districtStats.get(district.id) || 0
          if (casCount === 0) return null

          return (
            <Circle
              key={district.id}
              center={[district.latitude!, district.longitude!]}
              radius={getRadius(casCount)}
              pathOptions={{
                fillColor: getColor(casCount),
                color: getColor(casCount),
                weight: 2,
                opacity: 0.6,
                fillOpacity: 0.4,
              }}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-semibold text-gray-900">{district.nom}</p>
                  <p className="text-sm text-gray-600">Population: {district.population?.toLocaleString()}</p>
                  <p className="text-lg font-bold text-red-600 mt-2">
                    {casCount} cas
                  </p>
                  {district.population && (
                    <p className="text-xs text-gray-500">
                      Taux: {((casCount / district.population) * 100000).toFixed(2)} / 100k hab
                    </p>
                  )}
                </div>
              </Popup>
            </Circle>
          )
        })}

      <FitBounds districts={districts} />

      {/* Légende */}
      <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control bg-white rounded-lg shadow-lg p-4 m-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Intensité</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded" />
              <span className="text-xs text-gray-700">Très élevée (&gt; 70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-xs text-gray-700">Élevée (50-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded" />
              <span className="text-xs text-gray-700">Moyenne (30-50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-xs text-gray-700">Faible (10-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-xs text-gray-700">Très faible (&lt; 10%)</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Max: {maxCas} cas
          </p>
        </div>
      </div>
    </MapContainer>
  )
}

export default HeatmapView
