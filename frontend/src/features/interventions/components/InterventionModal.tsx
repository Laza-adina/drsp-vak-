// src/components/interventions/InterventionModal.tsx
import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { interventionsService } from '@/api/services/interventions.service'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Loading from '@/components/common/Loading'
import toast from 'react-hot-toast'
import type { InterventionCreate, TypeIntervention, InterventionStatut } from '@/types/interventions.types'

interface InterventionModalProps {
  interventionId?: number
  onClose: () => void
  onSuccess: () => void
}

const InterventionModal: React.FC<InterventionModalProps> = ({
  interventionId,
  onClose,
  onSuccess,
}) => {
  const isEdit = !!interventionId

  const [formData, setFormData] = useState<InterventionCreate>({
    titre: '',
    description: '',
    type: 'enquete_terrain',
    district_id: 0,
    maladie_id: undefined,
    date_planifiee: new Date().toISOString().split('T')[0],
    population_cible: undefined,
    budget_alloue: undefined,
  })

  // Queries
  const { data: intervention, isLoading } = useQuery({
    queryKey: ['intervention', interventionId],
    queryFn: () => interventionsService.getById(interventionId!),
    enabled: isEdit,
  })

  const { data: maladies = [] } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Remplir le formulaire en mode édition
  useEffect(() => {
    if (intervention) {
      setFormData({
        titre: intervention.titre,
        description: intervention.description,
        type: intervention.type,
        district_id: intervention.district_id,
        maladie_id: intervention.maladie_id,
        date_planifiee: intervention.date_planifiee,
        chef_equipe: intervention.chef_equipe,
        population_cible: intervention.population_cible,
        budget_alloue: intervention.budget_alloue,
      })
    }
  }, [intervention])

  // Mutations
  const createMutation = useMutation({
    mutationFn: interventionsService.create,
    onSuccess: () => {
      toast.success('Intervention créée')
      onSuccess()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => interventionsService.update(interventionId!, data),
    onSuccess: () => {
      toast.success('Intervention mise à jour')
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isEdit) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-2xl w-full mx-4">
          <Loading message="Chargement..." />
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-3xl w-full my-8">
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? '✏️ Modifier l\'intervention' : '➕ Nouvelle intervention'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Type et District */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TypeIntervention })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="vaccination">💉 Vaccination</option>
                <option value="sensibilisation">📢 Sensibilisation</option>
                <option value="desinfection">🧹 Désinfection</option>
                <option value="distribution_medicaments">💊 Distribution médicaments</option>
                <option value="formation_personnel">👨‍🏫 Formation personnel</option>
                <option value="enquete_terrain">🔍 Enquête terrain</option>
                <option value="autre">📋 Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District *
              </label>
              <select
                value={formData.district_id}
                onChange={(e) => setFormData({ ...formData, district_id: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value={0}>Sélectionner</option>
                {districts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Maladie et Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maladie (optionnel)
              </label>
              <select
                value={formData.maladie_id || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maladie_id: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Aucune</option>
                {maladies.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date planifiée *
              </label>
              <input
                type="date"
                value={formData.date_planifiee}
                onChange={(e) => setFormData({ ...formData, date_planifiee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Chef équipe et Population */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chef d'équipe
              </label>
              <input
                type="text"
                value={formData.chef_equipe || ''}
                onChange={(e) => setFormData({ ...formData, chef_equipe: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Population cible
              </label>
              <input
                type="number"
                value={formData.population_cible || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  population_cible: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget alloué (Ar)
            </label>
            <input
              type="number"
              value={formData.budget_alloue || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                budget_alloue: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* BOUTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={onClose} type="button">
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default InterventionModal
