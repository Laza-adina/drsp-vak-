/**
 * 📄 Fichier: src/features/cartographie/pages/CartographiePage.tsx
 * 📝 Description: Page de cartographie interactive
 * 🎯 Usage: Visualisation géographique des cas sur une carte
 */

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { cartographieService } from '@/api/services/cartographie.service'
import { referentielsService } from '@/api/services/users.service'
import Card from '@/components/common/Card'
import Select from '@/components/common/Select'
import Loading from '@/components/common/Loading'
import MapContainer from '@/components/maps/MapContainer'
import MarkerCluster from '@/components/maps/MarkerCluster'
import MapControls from '../components/MapControls'
import MapLegend from '../components/MapLegend'

// ========================================
// 🗺️ PAGE CARTOGRAPHIE
// ========================================

/**
 * Page de cartographie avec filtres et différentes visualisations
 */
const CartographiePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // État des filtres
  const [maladieId, setMaladieId] = useState<number | undefined>(
    searchParams.get('maladie') ? Number(searchParams.get('maladie')) : undefined
  )
  const [districtId, setDistrictId] = useState<number | undefined>(
    searchParams.get('district') ? Number(searchParams.get('district')) : undefined
  )
  
  // Type de visualisation
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers')

  // ========================================
  // 📡 CHARGEMENT DES DONNÉES
  // ========================================
  
  // Référentiels
  const { data: maladies } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Marqueurs de cas
  const { data: markers, isLoading } = useQuery({
    queryKey: ['cartographie-markers', maladieId, districtId],
    queryFn: () => cartographieService.getMarkers(maladieId, districtId),
  })

  // ========================================
  // 🎯 HANDLERS
  // ========================================
  const handleMarkerClick = (marker: any) => {
    navigate(`/cas/${marker.id}`)
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="space-y-6">
      {/* ========================================
          📋 EN-TÊTE
          ======================================== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cartographie</h1>
        <p className="text-gray-600">
          Visualisation géographique des cas - {markers?.length || 0} cas localisés
        </p>
      </div>

      {/* ========================================
          🔍 FILTRES
          ======================================== */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Maladie"
            placeholder="Toutes les maladies"
            value={maladieId || ''}
            onChange={(e) => setMaladieId(e.target.value ? Number(e.target.value) : undefined)}
            options={maladies?.map((m: any) => ({ value: m.id, label: m.nom })) || []}
          />

          <Select
            label="District"
            placeholder="Tous les districts"
            value={districtId || ''}
            onChange={(e) => setDistrictId(e.target.value ? Number(e.target.value) : undefined)}
            options={districts?.map((d: any) => ({ value: d.id, label: d.nom })) || []}
          />

          <Select
            label="Affichage"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'markers' | 'heatmap')}
            options={[
              { value: 'markers', label: 'Marqueurs' },
              { value: 'heatmap', label: 'Carte de chaleur' },
            ]}
          />
        </div>
      </Card>

      {/* ========================================
          🗺️ CARTE
          ======================================== */}
      <Card padding={false}>
        {isLoading ? (
          <div className="h-[600px] flex items-center justify-center">
            <Loading message="Chargement de la carte..." />
          </div>
        ) : (
          <div className="relative">
            <MapContainer height="600px">
              {viewMode === 'markers' && markers && (
                <MarkerCluster
                  markers={markers}
                  onMarkerClick={handleMarkerClick}
                />
              )}
            </MapContainer>

            {/* Contrôles de la carte */}
            <div className="absolute top-4 right-4 z-10">
              <MapControls />
            </div>

            {/* Légende */}
            <div className="absolute bottom-4 left-4 z-10">
              <MapLegend />
            </div>
          </div>
        )}
      </Card>

      {/* ========================================
          📊 STATISTIQUES
          ======================================== */}
      {markers && markers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-gray-600">Cas sur la carte</p>
            <p className="text-3xl font-bold text-gray-900">{markers.length}</p>
          </Card>
          
          <Card>
            <p className="text-sm text-gray-600">Cas confirmés</p>
            <p className="text-3xl font-bold text-danger-600">
              {markers.filter(m => m.cas_confirme).length}
            </p>
          </Card>
          
          <Card>
            <p className="text-sm text-gray-600">Décès</p>
            <p className="text-3xl font-bold text-gray-900">
              {markers.filter(m => m.cas_deces).length}
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CartographiePage
