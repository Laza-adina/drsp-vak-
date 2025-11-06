/**
 * 📄 Fichier: src/features/dashboard/components/TopDistricts.tsx
 * 📝 Description: Top 5 des districts avec le plus de cas
 * 🎯 Usage: Identifier les zones à risque
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from '@/components/common/Card'
import Loading from '@/components/common/Loading'
import { formatNumber } from '@/utils/formatters'
import type { TopDistrict } from '@/types/dashboard.types'

// ========================================
// 🎨 INTERFACE
// ========================================

interface TopDistrictsProps {
  data: TopDistrict[]
  loading?: boolean
}

// ========================================
// 🏆 COMPOSANT TOP DISTRICTS
// ========================================

/**
 * Liste des 5 districts les plus touchés
 * Avec indication de tendance (hausse/baisse)
 */
const TopDistricts: React.FC<TopDistrictsProps> = ({ data, loading }) => {
  const navigate = useNavigate()

  // ========================================
  // ⏳ ÉTAT DE CHARGEMENT
  // ========================================
  if (loading) {
    return (
      <Card>
        <Loading message="Chargement..." />
      </Card>
    )
  }

  // ========================================
  // 📭 ÉTAT VIDE
  // ========================================
  if (!data || data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 5 des districts
        </h3>
        <div className="text-center py-8 text-gray-500">
          Aucune donnée disponible
        </div>
      </Card>
    )
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <Card>
      {/* ========================================
          📋 EN-TÊTE
          ======================================== */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Top 5 des districts
        </h3>
        <button
          onClick={() => navigate('/cartographie')}
          className="text-sm text-primary-500 hover:text-primary-600 font-medium"
        >
          Voir la carte
        </button>
      </div>

      {/* ========================================
          📊 LISTE DES DISTRICTS
          ======================================== */}
      <div className="space-y-3">
        {data.map((district, index) => (
          <div
            key={district.district_id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/cartographie?district=${district.district_id}`)}
          >
            {/* Rang et nom */}
            <div className="flex items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-primary-600">
                  {index + 1}
                </span>
              </div>
              <div>
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-1" />
                  <span className="font-medium text-gray-900">
                    {district.district_nom}
                  </span>
                </div>
                {district.taux_incidence && (
                  <span className="text-xs text-gray-500">
                    Taux: {district.taux_incidence.toFixed(1)} / 100k hab.
                  </span>
                )}
              </div>
            </div>

            {/* Nombre de cas */}
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-gray-900">
                {formatNumber(district.nombre_cas)}
              </span>

              {/* Tendance */}
              {district.tendance === 'hausse' && (
                <div className="flex items-center text-danger-600">
                  <TrendingUp size={18} />
                </div>
              )}
              {district.tendance === 'baisse' && (
                <div className="flex items-center text-success-600">
                  <TrendingDown size={18} />
                </div>
              )}
              {district.tendance === 'stable' && (
                <div className="flex items-center text-gray-400">
                  <Minus size={18} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default TopDistricts
