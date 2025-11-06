import React from 'react'
import { Alerte } from '@/types/alertes.types'
import Card from '@components/common/Card'
import { formatDate } from '@utils/formatters'
import { getGraviteColor } from '@utils/helpers'
import { AlertTriangle, MapPin, Activity } from 'lucide-react'

interface AlerteCardProps {
  alerte: Alerte
  onClick?: () => void
}

const AlerteCard: React.FC<AlerteCardProps> = ({ alerte, onClick }) => {
  const graviteColor = getGraviteColor(alerte.niveau_gravite)
  const colorClasses = {
    primary: 'border-primary-500 bg-primary-50',
    success: 'border-success-500 bg-success-50',
    warning: 'border-warning-500 bg-warning-50',
    danger: 'border-danger-500 bg-danger-50',
  }

  return (
    <Card
      className={`border-l-4 ${colorClasses[graviteColor]} cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-5 h-5 text-${graviteColor}-600`} />
          <h3 className="font-semibold text-gray-900">{alerte.type_alerte}</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-${graviteColor}-800 bg-${graviteColor}-100`}
        >
          {alerte.niveau_gravite}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Activity className="w-4 h-4 mr-2" />
          <span>{alerte.maladie_nom}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{alerte.district_nom}</span>
        </div>
        <p className="text-sm text-gray-700 mt-2">{alerte.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <span className="text-xs text-gray-500">{formatDate(alerte.date_detection)}</span>
          <span className="text-sm font-medium text-gray-900">{alerte.nombre_cas} cas</span>
        </div>
      </div>
    </Card>
  )
}

export default AlerteCard
