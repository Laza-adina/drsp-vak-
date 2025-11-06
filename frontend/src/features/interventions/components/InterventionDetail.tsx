import React from 'react'
import { Intervention } from '@/types/interventions.types'
import Card from '@components/common/Card'
import { formatDate, formatCurrency, formatNumber } from '@utils/formatters'
import { Calendar, User, MapPin, DollarSign, Users, Briefcase } from 'lucide-react'
import { getStatusColor } from '@utils/helpers'

interface InterventionDetailProps {
  intervention: Intervention
}

const InterventionDetail: React.FC<InterventionDetailProps> = ({ intervention }) => {
  const statusColor = getStatusColor(intervention.statut)
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-800 border-primary-200',
    success: 'bg-success-100 text-success-800 border-success-200',
    warning: 'bg-warning-100 text-warning-800 border-warning-200',
    danger: 'bg-danger-100 text-danger-800 border-danger-200',
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Informations générales</h2>
          <span className={`px-4 py-2 rounded-lg border font-medium ${colorClasses[statusColor]}`}>
            {intervention.statut}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <Briefcase size={16} className="mr-2" />
              <span className="text-sm">Type d'intervention</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{intervention.type_intervention}</p>
          </div>

          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm">District</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{intervention.district_nom}</p>
          </div>

          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <User size={16} className="mr-2" />
              <span className="text-sm">Responsable</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{intervention.responsable}</p>
          </div>

          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm">Date de début</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{formatDate(intervention.date_debut)}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-2">Description</p>
          <p className="text-gray-900">{intervention.description}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center text-gray-600 mb-2">
            <Users size={16} className="mr-2" />
            <span className="text-sm">Personnes ciblées</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {intervention.nombre_personnes_ciblees
              ? formatNumber(intervention.nombre_personnes_ciblees)
              : 'N/A'}
          </p>
          {intervention.nombre_personnes_atteintes && (
            <p className="text-sm text-gray-600 mt-1">
              Atteintes: {formatNumber(intervention.nombre_personnes_atteintes)}
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center text-gray-600 mb-2">
            <DollarSign size={16} className="mr-2" />
            <span className="text-sm">Budget prévu</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {intervention.budget_prevu ? formatCurrency(intervention.budget_prevu) : 'N/A'}
          </p>
          {intervention.budget_utilise && (
            <p className="text-sm text-gray-600 mt-1">
              Utilisé: {formatCurrency(intervention.budget_utilise)}
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center text-gray-600 mb-2">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">Date fin prévue</span>
          </div>
          <p className="text-lg font-medium text-gray-900">
            {formatDate(intervention.date_fin_prevue)}
          </p>
          {intervention.date_fin_reelle && (
            <p className="text-sm text-gray-600 mt-1">
              Réelle: {formatDate(intervention.date_fin_reelle)}
            </p>
          )}
        </Card>
      </div>

      {intervention.resultats && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Résultats</h2>
          <p className="text-gray-900">{intervention.resultats}</p>
        </Card>
      )}
    </div>
  )
}

export default InterventionDetail
