/**
 * 📄 Fichier: src/features/admin/components/MaladiesTab.tsx
 * 📝 Description: Onglet gestion des maladies
 * 🎯 Usage: CRUD maladies
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import MaladieForm from './MaladieForm'
import toast from 'react-hot-toast'
import type { Maladie } from '@/types/cas.types'

const MaladiesTab: React.FC = () => {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingMaladie, setEditingMaladie] = useState<Maladie | null>(null)

  // Récupération
  const { data: maladies = [], isLoading } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  // Suppression
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referentielsService.deleteMaladie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maladies'] })
      toast.success('Maladie supprimée')
    },
  })

  // Handlers
  const handleAdd = () => {
    setEditingMaladie(null)
    setShowForm(true)
  }

  const handleEdit = (maladie: Maladie) => {
    setEditingMaladie(maladie)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Supprimer cette maladie ?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Maladies surveillées
          </h2>
          <p className="text-sm text-gray-600">
            {maladies.length} maladie{maladies.length > 1 ? 's' : ''}
          </p>
        </div>

        {!showForm && (
          <Button variant="primary" onClick={handleAdd}>
            <Plus size={20} className="mr-2" />
            Nouvelle maladie
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingMaladie ? 'Modifier' : 'Nouvelle maladie'}
          </h3>
          <MaladieForm
            initialData={editingMaladie || undefined}
            onSuccess={() => {
              setShowForm(false)
              setEditingMaladie(null)
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingMaladie(null)
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
                Seuil Alerte
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {maladies.map((maladie) => (
              <tr key={maladie.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {maladie.nom}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {maladie.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {maladie.seuil_alerte}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(maladie)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(maladie.id)}
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

export default MaladiesTab
