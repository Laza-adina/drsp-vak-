/**
 * 📄 Fichier: src/features/dashboard/components/AlerteSection.tsx
 * 📝 Description: Section alertes avec seuils
 */

import React from 'react'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import type { Maladie } from '@/types/cas.types'

interface AlerteSectionProps {
  maladie: Maladie
  stats: any
  alerteStatus: {
    niveau: string
    color: string
    label: string
    message: string
  }
}

const AlerteSection: React.FC<AlerteSectionProps> = ({
  maladie,
  stats,
  alerteStatus
}) => {
  const colors = {
    red: 'bg-red-50 border-red-200 text-red-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    green: 'bg-green-50 border-green-200 text-green-800'
  }

  const progressPercent = Math.min(
    (stats.total_cas / maladie.seuil_epidemie) * 100,
    100
  )

  return (
    <div className={`rounded-lg border-2 p-6 ${colors[alerteStatus.color as keyof typeof colors]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle size={32} />
          <div>
            <h3 className="text-xl font-bold">{alerteStatus.label}</h3>
            <p className="text-sm mt-1">{alerteStatus.message}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium">Seuils</p>
          <p className="text-xs">Alerte: {maladie.seuil_alerte} cas</p>
          <p className="text-xs">Épidémie: {maladie.seuil_epidemie} cas</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mt-4">
        <div className="h-3 bg-white bg-opacity-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-current transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>0</span>
          <span>{maladie.seuil_alerte} (Alerte)</span>
          <span>{maladie.seuil_epidemie} (Épidémie)</span>
        </div>
      </div>
    </div>
  )
}

export default AlerteSection
