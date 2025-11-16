/**
 * 📄 Fichier: src/features/dashboard/components/CasStatutChart.tsx
 * 📝 Description: Graphique répartition par statut
 */

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface CasStatutChartProps {
  data: { statut: string; count: number }[]
}

const STATUT_COLORS: Record<string, string> = {
  'suspect': '#FCD34D',
  'probable': '#FBBF24',
  'confirme': '#EF4444',
  'gueri': '#10B981',
  'decede': '#374151'
}

const STATUT_LABELS: Record<string, string> = {
  'suspect': 'Suspect',
  'probable': 'Probable',
  'confirme': 'Confirmé',
  'gueri': 'Guéri',
  'decede': 'Décédé'
}

const CasStatutChart: React.FC<CasStatutChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Aucune donnée disponible
      </div>
    )
  }

  const formattedData = data.map(item => ({
    ...item,
    name: STATUT_LABELS[item.statut] || item.statut,
    fill: STATUT_COLORS[item.statut] || '#6B7280'
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} cas`, 'Nombre']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CasStatutChart
