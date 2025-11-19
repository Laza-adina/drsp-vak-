import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, MapPin, TrendingUp, ArrowRight } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import { alertesService } from '@/api/services/alertes.service'
//import type { Alerte } from '@/types/alertes.types'

interface AlertesParDistrictProps {
    maladieId?: number
}

const AlertesParDistrict: React.FC<AlertesParDistrictProps> = ({ maladieId }) => {
  const navigate = useNavigate()

  // Charger les alertes actives
  const { data: alertes = [] } = useQuery({
    queryKey: ['alertes-dashboard', maladieId],
    queryFn: () => alertesService.getAll({ 
      statut: 'active',
      maladie_id: maladieId 
    }),
  })

  const graviteConfig = {
    critique: { color: 'red', icon: '🔴', bg: 'bg-red-50', border: 'border-red-500' },
    alerte: { color: 'orange', icon: '🟠', bg: 'bg-orange-50', border: 'border-orange-500' },
    avertissement: { color: 'yellow', icon: '🟡', bg: 'bg-yellow-50', border: 'border-yellow-500' },
    info: { color: 'blue', icon: '🔵', bg: 'bg-blue-50', border: 'border-blue-500' },
  }

  if (alertes.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune alerte active
          </h3>
          <p className="text-gray-600 text-sm">
            La situation est sous contrôle
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-600" />
          Alertes par district
        </h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/alertes')}
        >
          Voir toutes les alertes
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>

      <div className="space-y-3">
        {alertes.map((alerte) => {
          const config = graviteConfig[alerte.niveau_gravite]
          
          return (
            <div
              key={alerte.id}
              className={`${config.bg} border-l-4 ${config.border} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => navigate('/alertes')}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {alerte.type_alerte}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {alerte.maladie?.nom}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
                  {alerte.niveau_gravite}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{alerte.district?.nom}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  <span className="font-semibold text-gray-900">{alerte.nombre_cas} cas</span>
                </div>
              </div>

              <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                {alerte.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Bouton action rapide */}
      <div className="mt-4 pt-4 border-t">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => {
            // Vérifier les seuils et créer de nouvelles alertes
            alertesService.checkThresholds().then(() => {
              window.location.reload()
            })
          }}
        >
          <AlertTriangle size={16} className="mr-2" />
          Vérifier les seuils automatiquement
        </Button>
      </div>
    </Card>
  )
}

export default AlertesParDistrict
