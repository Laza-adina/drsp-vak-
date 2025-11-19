// src/components/interventions/InterventionCard.tsx
import React from 'react'
import { Calendar, MapPin, Users, DollarSign, Trash2, Sparkles } from 'lucide-react'
import Card from '@/components/common/Card'
import type { Intervention } from '@/types/interventions.types'

interface InterventionCardProps {
  intervention: Intervention
  onClick: () => void
  onDelete: () => void
}

const InterventionCard: React.FC<InterventionCardProps> = ({ 
  intervention, 
  onClick, 
  onDelete 
}) => {
  // Couleurs selon statut
  const statutColors = {
    planifiee: 'bg-blue-100 text-blue-800 border-blue-300',
    en_cours: 'bg-orange-100 text-orange-800 border-orange-300',
    terminee: 'bg-green-100 text-green-800 border-green-300',
    annulee: 'bg-gray-100 text-gray-800 border-gray-300',
  }

  // Icônes selon type
  const typeLabels = {
    vaccination: '💉 Vaccination',
    sensibilisation: '📢 Sensibilisation',
    desinfection: '🧹 Désinfection',
    distribution_medicaments: '💊 Distribution médicaments',
    formation_personnel: '👨‍🏫 Formation personnel',
    enquete_terrain: '🔍 Enquête terrain',
    autre: '📋 Autre',
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer relative">
      {/* Badge IA si généré par IA */}
      {intervention.generee_par_ia && (
        <div className="absolute top-3 right-3">
          <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Sparkles size={12} />
            IA
          </div>
        </div>
      )}

      <div onClick={onClick}>
        {/* EN-TÊTE */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-8">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {intervention.titre}
            </h3>
            <span className="text-sm text-gray-600">
              {typeLabels[intervention.type]}
            </span>
          </div>
        </div>

        {/* STATUT */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statutColors[intervention.statut]}`}>
            {intervention.statut === 'planifiee' && '📅 Planifiée'}
            {intervention.statut === 'en_cours' && '⏳ En cours'}
            {intervention.statut === 'terminee' && '✅ Terminée'}
            {intervention.statut === 'annulee' && '❌ Annulée'}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {intervention.description}
        </p>

        {/* INFOS */}
        <div className="space-y-2 text-sm">
          {intervention.maladie && (
            <div className="flex items-center text-gray-700">
              <span className="font-medium mr-2">🦠 Maladie:</span>
              <span>{intervention.maladie.nom}</span>
            </div>
          )}

          {intervention.district && (
            <div className="flex items-center text-gray-700">
              <MapPin size={14} className="mr-2" />
              <span>{intervention.district.nom}</span>
            </div>
          )}

          <div className="flex items-center text-gray-700">
            <Calendar size={14} className="mr-2" />
            <span>
              Planifiée: {new Date(intervention.date_planifiee).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {intervention.population_cible && (
            <div className="flex items-center text-gray-700">
              <Users size={14} className="mr-2" />
              <span>
                {intervention.population_atteinte || 0} / {intervention.population_cible} personnes
              </span>
            </div>
          )}

          {intervention.budget_alloue && (
            <div className="flex items-center text-gray-700">
              <DollarSign size={14} className="mr-2" />
              <span>{intervention.budget_alloue.toLocaleString()} Ar</span>
            </div>
          )}

          {intervention.efficacite_score && (
            <div className="flex items-center text-gray-700">
              <span className="mr-2">⭐ Efficacité:</span>
              <span className="font-semibold">{intervention.efficacite_score}/5</span>
            </div>
          )}
        </div>
      </div>

      {/* BOUTON SUPPRESSION */}
      <div className="mt-4 pt-4 border-t flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (window.confirm('Supprimer cette intervention ?')) {
              onDelete()
            }
          }}
          className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
        >
          <Trash2 size={14} />
          Supprimer
        </button>
      </div>
    </Card>
  )
}

export default InterventionCard
