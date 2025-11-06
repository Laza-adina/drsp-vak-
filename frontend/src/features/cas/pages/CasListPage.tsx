/**
 * 📄 Fichier: src/features/cas/pages/CasListPage.tsx
 * 📝 Description: Page de liste des cas
 * 🎯 Usage: Afficher, filtrer et gérer tous les cas de maladies
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { casService } from '@/api/services/cas.service'
import { usePermissions } from '@/hooks/usePermissions'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import CasList from '../components/CasList'
import CasFilters from '../components/CasFilters'
import toast from 'react-hot-toast'
import type { CasFilters as CasFiltersType } from '@/types/cas.types'

// ========================================
// 📋 PAGE CAS LIST
// ========================================

/**
 * Page de gestion des cas avec filtres et actions CRUD
 */
const CasListPage: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { canCreateCas, canDeleteCas } = usePermissions()
  
  // État des filtres
  const [filters, setFilters] = useState<CasFiltersType>({})

  // ========================================
  // 📡 RÉCUPÉRATION DES CAS
  // ========================================
  const {
    data: cas,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cas', filters],
    queryFn: () => casService.getAll(filters),
  })

  // ========================================
  // 🗑️ MUTATION SUPPRESSION
  // ========================================
  const deleteMutation = useMutation({
    mutationFn: (id: number) => casService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cas'] })
      toast.success('Cas supprimé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du cas')
    },
  })

  // ========================================
  // 🎯 HANDLERS
  // ========================================
  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas ?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleView = (id: number) => {
    navigate(`/cas/${id}`)
  }

  const handleEdit = (id: number) => {
    navigate(`/cas/${id}/modifier`)
  }

  // ========================================
  // ⏳ ÉTAT DE CHARGEMENT
  // ========================================
  if (isLoading) {
    return <Loading message="Chargement des cas..." />
  }

  // ========================================
  // ❌ GESTION D'ERREUR
  // ========================================
  if (error) {
    return (
      <ErrorMessage
        message="Erreur lors du chargement des cas"
        onRetry={() => refetch()}
      />
    )
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="space-y-6">
      {/* ========================================
          📋 EN-TÊTE
          ======================================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des cas
          </h1>
          <p className="text-gray-600">
            {cas?.length || 0} cas enregistré{(cas?.length || 0) > 1 ? 's' : ''}
          </p>
        </div>

        {/* Bouton nouveau cas */}
        {canCreateCas && (
          <Button
            variant="primary"
            onClick={() => navigate('/cas/nouveau')}
          >
            <Plus size={20} className="mr-2" />
            Nouveau cas
          </Button>
        )}
      </div>

      {/* ========================================
          🔍 FILTRES
          ======================================== */}
      <Card>
        <CasFilters
          filters={filters}
          onFilterChange={setFilters}
        />
      </Card>

      {/* ========================================
          📊 LISTE DES CAS
          ======================================== */}
      <Card padding={false}>
        <CasList
          cas={cas || []}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={canDeleteCas ? handleDelete : undefined}
        />
      </Card>
    </div>
  )
}

export default CasListPage
