/**
 * 📄 Fichier: src/features/interventions/components/InterventionsList.tsx
 * 📝 Description: Liste des interventions
 * 🎯 Usage: Afficher les interventions planifiées et en cours
 */

import React from 'react'
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react'
import Card from '@/components/common/Card'
import { formatDate } from '@/utils/formatters'
import { getStatusColor } from '@/utils/helpers'
import type { Intervention } from '@/types/interventions.types'

interface InterventionsListProps {
  interventions: Intervention[]
  onDelete?: (id: number) => void
}

const InterventionsList: React.FC<InterventionsListProps> = ({ interventions, onDelete }) => {
  if (interventions.length === 0) {
    return (
      <Card>
        <div className="text-center py-12 text-gray-500">
          Aucune intervention
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {interventions.map((intervention) => (
        <Card key={intervention.id} hover>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {intervention.type_intervention}
                </h3>
                <span className={`ml-3 badge badge-${getStatusColor(intervention.statut)}`}>
                  {intervention.statut}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{intervention.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  {intervention.district_nom}
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(intervention.date_debut)}
                </div>

                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2" />
                  {intervention.nombre_personnes_ciblees || 0} personnes
                </div>

                {intervention.budget_prevu && (
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    {intervention.budget_prevu.toLocaleString()} Ar
                  </div>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <span className="font-medium">Responsable:</span> {intervention.responsable}
              </div>
            </div>

            {onDelete && (
              <button
                onClick={() => onDelete(intervention.id)}
                className="text-danger-600 hover:text-danger-800 ml-4"
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

export default InterventionsList
