/**
 * 📄 Fichier: src/components/charts/LineChart.tsx
 * 📝 Description: Graphique en ligne (évolution temporelle)
 * 🎯 Usage: Afficher l'évolution des cas dans le temps
 */

import React from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
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

interface LineChartProps {
  data: any[]
  xKey: string
  yKey: string
  yKey2?: string // Deuxième ligne optionnelle
  xLabel?: string
  yLabel?: string
  height?: number
  color?: string
  color2?: string
}

// ========================================
// 📈 COMPOSANT LINE CHART
// ========================================

/**
 * Graphique en ligne avec Recharts
 * 
 * @example
 * <LineChart
 *   data={evolutionData}
 *   xKey="date"
 *   yKey="nombre_cas"
 *   yKey2="nombre_deces"
 *   xLabel="Date"
 *   yLabel="Nombre de cas"
 *   height={300}
 * />
 */
const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  yKey2,
  xLabel,
  yLabel,
  height = 300,
  color = '#1F4E78',
  color2 = '#ef4444',
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
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

        {/* Tooltip au survol */}
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

        {/* Première ligne */}
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />

        {/* Deuxième ligne optionnelle */}
        {yKey2 && (
          <Line
            type="monotone"
            dataKey={yKey2}
            stroke={color2}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export default LineChart
