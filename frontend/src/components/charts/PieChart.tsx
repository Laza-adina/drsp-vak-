/**
 * 📄 Fichier: src/components/charts/PieChart.tsx
 * 📝 Description: Graphique circulaire (camembert)
 * 🎯 Usage: Répartition en pourcentages (ex: cas par maladie)
 */

import React from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ========================================
// 🎨 INTERFACE
// ========================================

interface PieChartProps {
  data: any[]
  nameKey: string
  valueKey: string
  height?: number
  colors?: string[]
}

// ========================================
// 🎨 COULEURS PAR DÉFAUT
// ========================================

const DEFAULT_COLORS = [
  '#1F4E78', // Bleu DRSP
  '#22c55e', // Vert
  '#eab308', // Jaune
  '#ef4444', // Rouge
  '#8b5cf6', // Violet
  '#ec4899', // Rose
  '#06b6d4', // Cyan
  '#f97316', // Orange
]

// ========================================
// 🥧 COMPOSANT PIE CHART
// ========================================

/**
 * Graphique circulaire avec Recharts
 * 
 * @example
 * <PieChart
 *   data={maladiesData}
 *   nameKey="maladie_nom"
 *   valueKey="nombre_cas"
 *   height={300}
 * />
 */
const PieChart: React.FC<PieChartProps> = ({
  data,
  nameKey,
  valueKey,
  height = 300,
  colors = DEFAULT_COLORS,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        {/* Camembert */}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry[nameKey]} (${entry[valueKey]})`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueKey}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>

        {/* Tooltip */}
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '10px',
          }}
        />

        {/* Légende */}
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

export default PieChart
