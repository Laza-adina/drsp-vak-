// src/pages/InterventionsPage.tsx
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Filter, Lightbulb, X, Briefcase } from 'lucide-react'
import { interventionsService } from '@/api/services/interventions.service'
import { referentielsService } from '@/api/services/referentiels.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import toast from 'react-hot-toast'
import type { InterventionFilters, InterventionStatut } from '@/types/interventions.types'
import InterventionCard from '../components/InterventionCard'
import InterventionModal from '../components/InterventionModal'
import AIRecommendationsDialog from '../components/AIRecommendationsDialog'

const InterventionsPage: React.FC = () => {
  const queryClient = useQueryClient()
  
  // États
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<InterventionFilters>({})
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState<number | null>(null)
  const [aiRequestParams, setAiRequestParams] = useState<{
    maladie_id: number | null
    district_id: number | null
  }>({
    maladie_id: null,
    district_id: null,
  })

  // Queries
  const { data: interventions = [], isLoading } = useQuery({
    queryKey: ['interventions', filters],
    queryFn: () => interventionsService.getAll(filters),
  })

  const { data: maladies = [] } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Mutations
  const generateAIMutation = useMutation({
    mutationFn: interventionsService.genererRecommandationsIA,
    onSuccess: (data) => {
      if (data.success) {
        setShowAIDialog(true)
        toast.success('Recommandations IA générées')
      } else {
        toast.error(data.error || 'Erreur IA')
      }
    },
    onError: () => {
      toast.error('Erreur lors de la génération des recommandations')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => interventionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] })
      toast.success('Intervention supprimée')
    },
  })

  // Compteurs
  const planifiees = interventions.filter(i => i.statut === 'planifiee').length
  const enCours = interventions.filter(i => i.statut === 'en_cours').length
  const terminees = interventions.filter(i => i.statut === 'terminee').length
  const genereeIA = interventions.filter(i => i.generee_par_ia).length

  const handleGenerateAI = () => {
    if (!aiRequestParams.maladie_id || !aiRequestParams.district_id) {
      toast.error('Sélectionne une maladie et un district')
      return
    }
    generateAIMutation.mutate({
      maladie_id: aiRequestParams.maladie_id,
      district_id: aiRequestParams.district_id,
    })
  }

  return (
    <div className="space-y-6">
      {/* EN-TÊTE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💼 Interventions sanitaires</h1>
          <p className="text-gray-600">
            {interventions.length} intervention{interventions.length > 1 ? 's' : ''} • {enCours} en cours
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filtres
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} className="mr-2" />
            Nouvelle intervention
          </Button>
        </div>
      </div>

      {/* STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Planifiées</p>
          <p className="text-3xl font-bold text-blue-600">{planifiees}</p>
        </Card>
        <Card className="border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">En cours</p>
          <p className="text-3xl font-bold text-orange-500">{enCours}</p>
        </Card>
        <Card className="border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Terminées</p>
          <p className="text-3xl font-bold text-green-600">{terminees}</p>
        </Card>
        <Card className="border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">🤖 Générées par IA</p>
          <p className="text-3xl font-bold text-purple-600">{genereeIA}</p>
        </Card>
      </div>

      {/* 🤖 SECTION RECOMMANDATIONS IA */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Lightbulb size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Recommandations IA</h3>
              <p className="text-sm text-gray-600">
                Génère des suggestions d'interventions basées sur l'analyse épidémiologique
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <select
              value={aiRequestParams.maladie_id || ''}
              onChange={(e) => setAiRequestParams({ 
                ...aiRequestParams, 
                maladie_id: Number(e.target.value) || null 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Sélectionne une maladie</option>
              {maladies.map((m: any) => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>

            <select
              value={aiRequestParams.district_id || ''}
              onChange={(e) => setAiRequestParams({ 
                ...aiRequestParams, 
                district_id: Number(e.target.value) || null 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Sélectionne un district</option>
              {districts.map((d: any) => (
                <option key={d.id} value={d.id}>{d.nom}</option>
              ))}
            </select>

            <Button
              variant="primary"
              onClick={handleGenerateAI}
              loading={generateAIMutation.isPending}
              disabled={!aiRequestParams.maladie_id || !aiRequestParams.district_id}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Lightbulb size={18} className="mr-2" />
              Générer recommandations
            </Button>
          </div>
        </div>
      </Card>

      {/* FILTRES */}
      {showFilters && (
        <Card className="bg-blue-50 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filters.statut || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  statut: e.target.value as InterventionStatut || undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                <option value="planifiee">Planifiée</option>
                <option value="en_cours">En cours</option>
                <option value="terminee">Terminée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maladie</label>
              <select
                value={filters.maladie_id || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  maladie_id: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Toutes</option>
                {maladies.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select
                value={filters.district_id || ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  district_id: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                {districts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilters({})}
            >
              <X size={16} className="mr-2" />
              Réinitialiser
            </Button>
          </div>
        </Card>
      )}

      {/* LISTE DES INTERVENTIONS */}
      {isLoading ? (
        <Loading message="Chargement des interventions..." />
      ) : interventions.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucune intervention trouvée</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interventions.map((intervention) => (
            <InterventionCard
              key={intervention.id}
              intervention={intervention}
              onClick={() => setSelectedIntervention(intervention.id)}
              onDelete={() => deleteMutation.mutate(intervention.id)}
            />
          ))}
        </div>
      )}

      {/* MODAL CRÉATION */}
      {showCreateModal && (
        <InterventionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            queryClient.invalidateQueries({ queryKey: ['interventions'] })
          }}
        />
      )}

      {/* MODAL DÉTAILS */}
      {selectedIntervention && (
        <InterventionModal
          interventionId={selectedIntervention}
          onClose={() => setSelectedIntervention(null)}
          onSuccess={() => {
            setSelectedIntervention(null)
            queryClient.invalidateQueries({ queryKey: ['interventions'] })
          }}
        />
      )}

      {/* 🤖 DIALOG RECOMMANDATIONS IA */}
      {showAIDialog && generateAIMutation.data && (
        <AIRecommendationsDialog
          data={generateAIMutation.data}
          maladieId={aiRequestParams.maladie_id!}
          districtId={aiRequestParams.district_id!}
          onClose={() => setShowAIDialog(false)}
          onSuccess={() => {
            setShowAIDialog(false)
            queryClient.invalidateQueries({ queryKey: ['interventions'] })
          }}
        />
      )}
    </div>
  )
}

export default InterventionsPage
