/**
 * 📄 Fichier: src/features/admin/components/CentresSanteTab.tsx
 * 📝 Description: Onglet gestion des centres de santé
 * 🎯 Usage: CRUD centres de santé
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import CentreSanteForm from './CentreSanteForm'
import toast from 'react-hot-toast'
import type { CentreSante } from '@/types/cas.types'

const CentresSanteTab: React.FC = () => {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingCentre, setEditingCentre] = useState<CentreSante | null>(null)

  // Récupération
  const { data: centres = [], isLoading } = useQuery({
    queryKey: ['centres-sante'],
    queryFn: () => referentielsService.getCentresSante(),
  })

  // Récupération des districts pour affichage
  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Suppression
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referentielsService.deleteCentreSante(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centres-sante'] })
      toast.success('Centre de santé supprimé')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })

  // Handlers
  const handleAdd = () => {
    setEditingCentre(null)
    setShowForm(true)
  }

  const handleEdit = (centre: CentreSante) => {
    setEditingCentre(centre)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Supprimer ce centre de santé ?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCentre(null)
  }

  // Helper pour trouver le nom du district
  const getDistrictName = (districtId: number) => {
    const district = districts.find(d => d.id === districtId)
    return district?.nom || 'N/A'
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Centres de Santé
          </h2>
          <p className="text-sm text-gray-600">
            {centres.length} centre{centres.length > 1 ? 's' : ''}
          </p>
        </div>

        {!showForm && (
          <Button variant="primary" onClick={handleAdd}>
            <Plus size={20} className="mr-2" />
            Nouveau centre
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCentre ? 'Modifier' : 'Nouveau centre de santé'}
          </h3>
          <CentreSanteForm
            initialData={editingCentre || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingCentre(null)
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
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                District
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
            {centres.map((centre) => (
              <tr key={centre.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {centre.nom}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {centre.type?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {getDistrictName(centre.district_id)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {centre.latitude && centre.longitude
                    ? `${centre.latitude.toFixed(4)}, ${centre.longitude.toFixed(4)}`
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(centre)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(centre.id)}
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

export default CentresSanteTab
