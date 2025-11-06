/**
 * 📄 Fichier: src/components/charts/BarChart.tsx
 * 📝 Description: Graphique en barres
 * 🎯 Usage: Comparer des valeurs entre catégories (ex: cas par district)
 */

import React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ========================================
// 🎨 INTERFACE
// ========================================

interface BarChartProps {
  data: any[]
  xKey: string
  yKey: string
  xLabel?: string
  yLabel?: string
  height?: number
  color?: string
  horizontal?: boolean
}

// ========================================
// 📊 COMPOSANT BAR CHART
// ========================================

/**
 * Graphique en barres avec Recharts
 * 
 * @example
 * <BarChart
 *   data={districtData}
 *   xKey="district_nom"
 *   yKey="nombre_cas"
 *   yLabel="Nombre de cas"
 *   height={300}
 * />
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  height = 300,
  color = '#1F4E78',
  horizontal = false,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout={horizontal ? 'vertical' : 'horizontal'}
      >
        {/* Grille */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        {/* Axes */}
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              dataKey={xKey}
              type="category"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              width={120}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5 } : undefined}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
          </>
        )}

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

        {/* Barres */}
        <Bar
          dataKey={yKey}
          fill={color}
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export default BarChart
