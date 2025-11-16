/**
 * 📄 Fichier: src/features/dashboard/components/CasEvolutionChart.tsx
 * 📝 Description: Graphique d'évolution temporelle des cas
 */

import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CasEvolutionChartProps {
  data: { date: string; count: number }[]
}

const CasEvolutionChart: React.FC<CasEvolutionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Aucune donnée disponible
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getDate()}/${date.getMonth() + 1}`
            }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [`${value} cas`, 'Nombre de cas']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorCas)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CasEvolutionChart
