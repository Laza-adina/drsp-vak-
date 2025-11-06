/**
 * 📄 Fichier: src/features/alertes/pages/AlertesPage.tsx
 * 📝 Description: Page de gestion des alertes
 * 🎯 Usage: Visualiser et gérer les alertes épidémiologiques
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { alertesService } from '@/api/services/alertes.service'
import { usePermissions } from '@/hooks/usePermissions'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Loading from '@/components/common/Loading'
import AlertesList from '../components/AlertesList'
import AlerteForm from '../components/AlerteForm'
import toast from 'react-hot-toast'

// ========================================
// 🚨 PAGE ALERTES
// ========================================

const AlertesPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { canCreateAlertes } = usePermissions()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showOnlyActive, setShowOnlyActive] = useState(true)

  // ========================================
  // 📡 RÉCUPÉRATION DES ALERTES
  // ========================================
  const { data: alertes, isLoading } = useQuery({
    queryKey: ['alertes', showOnlyActive],
    queryFn: () => alertesService.getAll(showOnlyActive),
  })

  // ========================================
  // 🗑️ MUTATION SUPPRESSION
  // ========================================
  const deleteMutation = useMutation({
    mutationFn: (id: number) => alertesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertes'] })
      toast.success('Alerte supprimée')
    },
  })

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="space-y-6">
      {/* EN-TÊTE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertes</h1>
          <p className="text-gray-600">
            {alertes?.length || 0} alerte{(alertes?.length || 0) > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant={showOnlyActive ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowOnlyActive(!showOnlyActive)}
          >
            {showOnlyActive ? 'Alertes actives' : 'Toutes les alertes'}
          </Button>

          {canCreateAlertes && (
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Nouvelle alerte
            </Button>
          )}
        </div>
      </div>

      {/* LISTE */}
      {isLoading ? (
        <Loading />
      ) : (
        <AlertesList
          alertes={alertes || []}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}

      {/* MODAL CRÉATION */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle alerte"
        size="lg"
      >
        <AlerteForm
          onSuccess={() => {
            setIsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['alertes'] })
          }}
        />
      </Modal>
    </div>
  )
}

export default AlertesPage
