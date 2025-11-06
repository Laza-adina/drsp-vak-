/**
 * 📄 Fichier: src/features/alertes/components/AlertesList.tsx
 * 📝 Description: Liste des alertes sous forme de cartes
 * 🎯 Usage: Afficher les alertes avec indicateurs visuels
 */

import React from 'react'
import { AlertTriangle, Calendar, MapPin, TrendingUp } from 'lucide-react'
import Card from '@/components/common/Card'
import { formatDate } from '@/utils/formatters'
import { getGraviteColor } from '@/utils/helpers'
import type { Alerte } from '@/types/alertes.types'

// ========================================
// 🎨 INTERFACE
// ========================================

interface AlertesListProps {
  alertes: Alerte[]
  onDelete?: (id: number) => void
}

// ========================================
// 📋 COMPOSANT ALERTES LIST
// ========================================

const AlertesList: React.FC<AlertesListProps> = ({ alertes, onDelete }) => {
  if (alertes.length === 0) {
    return (
      <Card>
        <div className="text-center py-12 text-gray-500">
          Aucune alerte
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {alertes.map((alerte) => (
        <Card
          key={alerte.id}
          className={`border-l-4 border-${getGraviteColor(alerte.niveau_gravite)}-500`}
        >
          {/* En-tête */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-${getGraviteColor(alerte.niveau_gravite)}-100 mr-3`}>
                <AlertTriangle className={`text-${getGraviteColor(alerte.niveau_gravite)}-600`} size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{alerte.type_alerte}</h3>
                <p className="text-sm text-gray-600">{alerte.maladie_nom}</p>
              </div>
            </div>
            
            <span className={`badge badge-${getGraviteColor(alerte.niveau_gravite)}`}>
              {alerte.niveau_gravite}
            </span>
          </div>

          {/* Informations */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2" />
              {alerte.district_nom}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp size={16} className="mr-2" />
              {alerte.nombre_cas} cas détectés
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2" />
              Détectée le {formatDate(alerte.date_detection)}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4">
            {alerte.description}
          </p>

          {/* Statut */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              alerte.statut === 'Active' ? 'text-danger-600' : 'text-success-600'
            }`}>
              {alerte.statut}
            </span>

            {onDelete && (
              <button
                onClick={() => onDelete(alerte.id)}
                className="text-sm text-danger-600 hover:text-danger-800"
              >
                Supprimer
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default AlertesList
