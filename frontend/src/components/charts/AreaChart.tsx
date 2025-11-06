/**
 * 📄 Fichier: src/components/charts/AreaChart.tsx
 * 📝 Description: Graphique en aire (zone remplie)
 * 🎯 Usage: Évolution avec zone colorée sous la courbe
 */

import React from 'react'
import {
  AreaChart as RechartsAreaChart,
  Area,
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

interface AreaChartProps {
  data: any[]
  xKey: string
  yKey: string
  xLabel?: string
  yLabel?: string
  height?: number
  color?: string
}

// ========================================
// 📈 COMPOSANT AREA CHART
// ========================================

/**
 * Graphique en aire avec Recharts
 * 
 * @example
 * <AreaChart
 *   data={evolutionData}
 *   xKey="date"
 *   yKey="nombre_cas"
 *   yLabel="Nombre de cas"
 *   height={300}
 * />
 */
const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  height = 300,
  color = '#1F4E78',
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {/* Dégradé de couleur */}
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {/* Grille */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        {/* Axe X */}
        <XAxis
          dataKey={xKey}
          label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5 } : undefined}
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />

        {/* Axe Y */}
        <YAxis
          label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft' } : undefined}
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />

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

        {/* Zone */}
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

export default AreaChart
