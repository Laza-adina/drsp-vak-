/**
 * 📄 Fichier: src/features/admin/components/DistrictsTab.tsx
 * 📝 Description: Onglet de gestion des districts
 * 🎯 Usage: CRUD districts
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import DistrictForm from './DistrictForm'
import toast from 'react-hot-toast'
import type { District } from '@/types/cas.types'

const DistrictsTab: React.FC = () => {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null)

  // Récupération
  const { data: districts = [], isLoading } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Suppression
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referentielsService.deleteDistrict(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] })
      toast.success('District supprimé')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })

  // Handlers
  const handleAdd = () => {
    setEditingDistrict(null)
    setShowForm(true)
  }

  const handleEdit = (district: District) => {
    setEditingDistrict(district)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Supprimer ce district ?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingDistrict(null)
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Districts de Vakinankaratra
          </h2>
          <p className="text-sm text-gray-600">
            {districts.length} district{districts.length > 1 ? 's' : ''}
          </p>
        </div>

        {!showForm && (
          <Button variant="primary" onClick={handleAdd}>
            <Plus size={20} className="mr-2" />
            Nouveau
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingDistrict ? 'Modifier' : 'Nouveau district'}
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

      {/* Tableau */}
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
                    ? `${district.latitude.toFixed(4)}, ${district.longitude.toFixed(4)}`
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(district)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(district.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DistrictsTab
