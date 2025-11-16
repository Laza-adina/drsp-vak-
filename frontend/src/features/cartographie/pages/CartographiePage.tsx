/**
 * 📄 Fichier: src/features/cartographie/pages/CartographiePage.tsx
 * 📝 Description: Page de cartographie interactive
 */

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { casService } from '@/api/services/cas.service'
import { referentielsService } from '@/api/services/referentiels.service'
import Card from '@/components/common/Card'
import Loading from '@/components/common/Loading'
import MapWithMarkers from '../components/MapWithMarkers'
import HeatmapView from '../components/HeatmapView'
import { Map, TrendingUp } from 'lucide-react'

const CartographiePage: React.FC = () => {
  const navigate = useNavigate()
  
  // États
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers')
  const [maladieId, setMaladieId] = useState<number | undefined>()
  const [districtId, setDistrictId] = useState<number | undefined>()
  const [statut, setStatut] = useState<string | undefined>()

  // Chargement des données
  const { data: cas = [], isLoading } = useQuery({
    queryKey: ['cas', { maladie_id: maladieId, district_id: districtId, statut }],
    queryFn: () => casService.getAll({ maladie_id: maladieId, district_id: districtId, statut }),
  })

  const { data: maladies = [] } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Filtrer les cas qui ont des coordonnées
  const casAvecCoordonnees = cas.filter(c => c.latitude && c.longitude)

  return (
    <div className="space-y-6">
      {/* EN-TÊTE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🗺️ Cartographie</h1>
        <p className="text-gray-600">
          Visualisation géographique des cas - {casAvecCoordonnees.length} cas localisés
        </p>
      </div>

      {/* FILTRES & MODES */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Maladie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maladie</label>
            <select
              value={maladieId || ''}
              onChange={(e) => setMaladieId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes</option>
              {maladies.map((m: any) => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select
              value={districtId || ''}
              onChange={(e) => setDistrictId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              {districts.map((d: any) => (
                <option key={d.id} value={d.id}>{d.nom}</option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={statut || ''}
              onChange={(e) => setStatut(e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value="suspect">🟡 Suspect</option>
              <option value="probable">🟠 Probable</option>
              <option value="confirme">🔴 Confirmé</option>
              <option value="gueri">🟢 Guéri</option>
              <option value="decede">⚫ Décédé</option>
            </select>
          </div>

          {/* Mode d'affichage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Affichage</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('markers')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'markers'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Map size={18} />
                <span className="text-sm">Marqueurs</span>
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'heatmap'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp size={18} />
                <span className="text-sm">Chaleur</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* CARTE */}
      <Card padding={false}>
        {isLoading ? (
          <div className="h-[600px] flex items-center justify-center">
            <Loading message="Chargement de la carte..." />
          </div>
        ) : viewMode === 'markers' ? (
          <MapWithMarkers cas={casAvecCoordonnees} onMarkerClick={(id) => navigate(`/cas/${id}`)} />
        ) : (
          <HeatmapView cas={casAvecCoordonnees} districts={districts} />
        )}
      </Card>

      {/* STATISTIQUES */}
      {casAvecCoordonnees.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <p className="text-xs text-gray-600">Total cas</p>
            <p className="text-2xl font-bold text-gray-900">{casAvecCoordonnees.length}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600">Suspects</p>
            <p className="text-2xl font-bold text-yellow-600">
              {casAvecCoordonnees.filter(c => c.statut === 'suspect').length}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600">Probables</p>
            <p className="text-2xl font-bold text-orange-600">
              {casAvecCoordonnees.filter(c => c.statut === 'probable').length}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600">Confirmés</p>
            <p className="text-2xl font-bold text-red-600">
              {casAvecCoordonnees.filter(c => c.statut === 'confirme').length}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600">Guéris</p>
            <p className="text-2xl font-bold text-green-600">
              {casAvecCoordonnees.filter(c => c.statut === 'gueri').length}
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CartographiePage
