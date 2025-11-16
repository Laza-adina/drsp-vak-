/**
 * 📄 Fichier: src/features/admin/pages/DistrictsPage.tsx
 * 📝 Description: Gestion des districts
 * 🎯 Usage: CRUD districts de Vakinankaratra
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import DistrictForm from '../components/DistrictForm'
import toast from 'react-hot-toast'
import type { District } from '@/types/cas.types'

// ========================================
// 📋 PAGE DISTRICTS
// ========================================

const DistrictsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null)

  // ========================================
  // 📡 RÉCUPÉRATION DES DISTRICTS
  // ========================================
  const {
    data: districts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // ========================================
  // 🗑️ MUTATION SUPPRESSION
  // ========================================
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referentielsService.deleteDistrict(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] })
      toast.success('District supprimé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })

  // ========================================
  // 🎯 HANDLERS
  // ========================================
  const handleAdd = () => {
    setEditingDistrict(null)
    setShowForm(true)
  }

  const handleEdit = (district: District) => {
    setEditingDistrict(district)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce district ?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingDistrict(null)
  }

  // ========================================
  // ⏳ ÉTAT DE CHARGEMENT
  // ========================================
  if (isLoading) {
    return <Loading message="Chargement des districts..." />
  }

  // ========================================
  // ❌ GESTION D'ERREUR
  // ========================================
  if (error) {
    return <ErrorMessage message="Erreur lors du chargement des districts" />
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
          <h2 className="text-lg font-semibold text-gray-900">
            Districts de Vakinankaratra
          </h2>
          <p className="text-sm text-gray-600">
            {districts.length} district{districts.length > 1 ? 's' : ''} enregistré{districts.length > 1 ? 's' : ''}
          </p>
        </div>

        {!showForm && (
          <Button variant="primary" onClick={handleAdd}>
            <Plus size={20} className="mr-2" />
            Nouveau district
          </Button>
        )}
      </div>

      {/* ========================================
          📝 FORMULAIRE
          ======================================== */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingDistrict ? 'Modifier le district' : 'Nouveau district'}
          </h3>
          <DistrictForm
            initialData={editingDistrict || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingDistrict(null)
            }}
          />
        </div>
      )}

      {/* ========================================
          📊 TABLEAU DES DISTRICTS
          ======================================== */}
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Population
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Coordonnées
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {districts.map((district) => (
              <tr key={district.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {district.nom}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {district.code || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {district.population?.toLocaleString() || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {district.latitude && district.longitude
                    ? `${district.latitude}, ${district.longitude}`
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(district)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(district.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DistrictsPage
