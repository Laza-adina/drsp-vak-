/**
 * 📄 Fichier: src/features/dashboard/components/DiseaseDistribution.tsx
 * 📝 Description: Répartition des cas par maladie
 * 🎯 Usage: Graphique circulaire montrant la distribution
 */

import React from 'react'
import Card from '@/components/common/Card'
import PieChart from '@/components/charts/PieChart'
import Loading from '@/components/common/Loading'
import { formatNumber } from '@/utils/formatters'
import type { MaladieDistribution } from '@/types/dashboard.types'

// ========================================
// 🎨 INTERFACE
// ========================================

interface DiseaseDistributionProps {
  data: MaladieDistribution[]
  loading?: boolean
}

// ========================================
// 🥧 COMPOSANT DISEASE DISTRIBUTION
// ========================================

const DiseaseDistribution: React.FC<DiseaseDistributionProps> = ({ data, loading }) => {
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
          Répartition par maladie
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
      {/* Titre */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Répartition par maladie
      </h3>

      {/* Graphique */}
      <PieChart
        data={data}
        nameKey="maladie_nom"
        valueKey="nombre_cas"
        height={250}
      />

      {/* Liste détaillée */}
      <div className="mt-6 space-y-2">
        {data.map((item, index) => (
          <div
            key={item.maladie_id || index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: item.couleur || '#1F4E78' }}
              />
              <span className="text-sm text-gray-700">{item.maladie_nom}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(item.nombre_cas)} cas
              </span>
              <span className="text-sm text-gray-500">
                {/* ✅ FIX : Vérifier que pourcentage existe et n'est pas undefined */}
                {item.pourcentage != null ? item.pourcentage.toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default DiseaseDistribution
