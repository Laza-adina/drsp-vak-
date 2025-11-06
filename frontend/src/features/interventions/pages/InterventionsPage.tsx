/**
 * 📄 Fichier: src/features/interventions/pages/InterventionsPage.tsx
 * 📝 Description: Page de gestion des interventions
 * 🎯 Usage: Planifier et suivre les interventions sanitaires
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { interventionsService } from '@/api/services/interventions.service'
import { usePermissions } from '@/hooks/usePermissions'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Loading from '@/components/common/Loading'
import InterventionsList from '../components/InterventionsList'
import InterventionForm from '../components/InterventionForm'
import toast from 'react-hot-toast'

// ========================================
// 💼 PAGE INTERVENTIONS
// ========================================

const InterventionsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { canCreateInterventions } = usePermissions()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStatut, setSelectedStatut] = useState<string>('')

  // Récupération
  const { data: interventions, isLoading } = useQuery({
    queryKey: ['interventions', selectedStatut],
    queryFn: () => interventionsService.getAll(selectedStatut || undefined),
  })

  // Suppression
  const deleteMutation = useMutation({
    mutationFn: (id: number) => interventionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] })
      toast.success('Intervention supprimée')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interventions</h1>
          <p className="text-gray-600">
            {interventions?.length || 0} intervention{(interventions?.length || 0) > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
            className="input"
          >
            <option value="">Tous les statuts</option>
            <option value="Planifiée">Planifiée</option>
            <option value="En cours">En cours</option>
            <option value="Terminée">Terminée</option>
            <option value="Annulée">Annulée</option>
          </select>

          {canCreateInterventions && (
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Nouvelle intervention
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <InterventionsList
          interventions={interventions || []}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle intervention"
        size="lg"
      >
        <InterventionForm
          onSuccess={() => {
            setIsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['interventions'] })
          }}
        />
      </Modal>
    </div>
  )
}

export default InterventionsPage
