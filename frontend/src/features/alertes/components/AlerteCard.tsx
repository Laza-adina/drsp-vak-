// src/components/alertes/AlerteCard.tsx
import React, { useState } from 'react'
import { AlertTriangle, MapPin, Calendar, TrendingUp, CheckCircle, Clock, XCircle, Lightbulb } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import Card from '@/components/common/Card'
import { formatDate } from '@/utils/formatters'
import { alertesService } from '@/api/services/alertes.service'
import type { Alerte } from '@/types/alertes.types'

interface AlerteCardProps {
  alerte: Alerte
  onClick?: () => void
  onDelete?: () => void
}

const AlerteCard: React.FC<AlerteCardProps> = ({ alerte, onClick, onDelete }) => {
  const [actionIA, setActionIA] = useState<string | null>(null)
  const [showActionIA, setShowActionIA] = useState(false)

  const graviteConfig = {
    critique: { color: 'red', icon: '🔴', bg: 'bg-red-50', border: 'border-red-500' },
    alerte: { color: 'orange', icon: '🟠', bg: 'bg-orange-50', border: 'border-orange-500' },
    avertissement: { color: 'yellow', icon: '🟡', bg: 'bg-yellow-50', border: 'border-yellow-500' },
    info: { color: 'blue', icon: '🔵', bg: 'bg-blue-50', border: 'border-blue-500' },
  }

  const statutConfig = {
    active: { icon: AlertTriangle, text: 'Active', color: 'text-red-600' },
    en_cours: { icon: Clock, text: 'En cours', color: 'text-orange-600' },
    resolue: { icon: CheckCircle, text: 'Résolue', color: 'text-green-600' },
    fausse_alerte: { icon: XCircle, text: 'Fausse alerte', color: 'text-gray-600' },
  }

  const config = graviteConfig[alerte.niveau_gravite]
  const StatutIcon = statutConfig[alerte.statut].icon

  // 🤖 Mutation pour suggérer action IA
  const suggererActionMutation = useMutation({
    mutationFn: () => alertesService.suggererActionIA(alerte.id),
    onSuccess: (data) => {
      setActionIA(data.action_suggeree)
      setShowActionIA(true)
    },
    onError: () => {
      setActionIA("Erreur lors de la génération de la suggestion")
      setShowActionIA(true)
    },
  })

  return (
    <Card
      className={`${config.bg} border-l-4 ${config.border} cursor-pointer hover:shadow-lg transition-all`}
      onClick={onClick}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${config.color}-100`}>
            <AlertTriangle className={`text-${config.color}-600`} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{alerte.type_alerte}</h3>
            <p className="text-sm text-gray-600">{alerte.maladie?.nom}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
          {config.icon} {alerte.niveau_gravite}
        </span>
      </div>

      {/* Informations */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2" />
          <span>{alerte.district?.nom}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp size={16} className="mr-2" />
          <span className="font-semibold text-gray-900">{alerte.nombre_cas} cas</span>
          <span className="mx-2">•</span>
          <span>Seuil: {alerte.seuil_declenche}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>Détectée le {formatDate(alerte.date_detection)}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
        {alerte.description}
      </p>

      {/* 🤖 ACTION IA SUGGÉRÉE */}
      {showActionIA && actionIA && (
        <div className="mb-4 p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
          <div className="flex items-start gap-2">
            <Lightbulb size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-purple-900 mb-1">🤖 Recommandation IA</p>
              <p className="text-sm text-purple-800">{actionIA}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowActionIA(false)
              }}
              className="text-purple-600 hover:text-purple-800"
            >
              <XCircle size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <StatutIcon size={16} className={statutConfig[alerte.statut].color} />
          <span className={`text-sm font-medium ${statutConfig[alerte.statut].color}`}>
            {statutConfig[alerte.statut].text}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 🤖 BOUTON IA (visible seulement si alerte active ou en_cours) */}
          {(alerte.statut === 'active' || alerte.statut === 'en_cours') && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                suggererActionMutation.mutate()
              }}
              disabled={suggererActionMutation.isPending}
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium"
            >
              <Lightbulb size={14} />
              {suggererActionMutation.isPending ? 'Génération...' : 'Action IA'}
            </button>
          )}

          {/* Bouton supprimer */}
          {onDelete && alerte.statut !== 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Supprimer cette alerte ?')) {
                  onDelete()
                }
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default AlerteCard
