/**
 * 📄 Fichier: src/features/dashboard/components/EvolutionChart.tsx
 * 📝 Description: Graphique d'évolution des cas dans le temps
 * 🎯 Usage: Visualiser la tendance des cas sur 30 jours
 */

import React from 'react'
import Card from '@/components/common/Card'
import LineChart from '@/components/charts/LineChart'
import Loading from '@/components/common/Loading'
import type { EvolutionData } from '@/types/dashboard.types'

// ========================================
// 🎨 INTERFACE
// ========================================

interface EvolutionChartProps {
  data: EvolutionData[]
  loading?: boolean
}

// ========================================
// 📈 COMPOSANT EVOLUTION CHART
// ========================================

/**
 * Graphique d'évolution temporelle des cas
 * Affiche l'évolution sur les 30 derniers jours
 */
const EvolutionChart: React.FC<EvolutionChartProps> = ({ data, loading }) => {
  // ========================================
  // ⏳ ÉTAT DE CHARGEMENT
  // ========================================
  if (loading) {
    return (
      <Card>
        <Loading message="Chargement du graphique..." />
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
          Évolution des cas (30 jours)
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
        Évolution des cas (30 jours)
      </h3>

      {/* Graphique */}
      <LineChart
        data={data}
        xKey="date"
        yKey="nombre_cas"
        yKey2="nombre_deces"
        height={300}
        color="#1F4E78"
        color2="#ef4444"
      />

      {/* Légende personnalisée */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600">Cas</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-danger-500 rounded-full mr-2" />
          <span className="text-sm text-gray-600">Décès</span>
        </div>
      </div>
    </Card>
  )
}

export default EvolutionChart
