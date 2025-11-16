/**
 * 📄 Fichier: src/features/admin/components/UsersManagementTab.tsx
 * 📝 Description: Onglet gestion des utilisateurs
 * 🎯 Usage: CRUD utilisateurs avec sélection de rôle
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import UserForm from './UserForm'
import toast from 'react-hot-toast'
import type { User } from '@/types/auth.types'
import axiosInstance from '@/api/axios.config'

// Service users
const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users')
    return response.data
  },
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`)
  }
}

// Labels pour affichage
const roleLabels: Record<string, string> = {
  'ADMINISTRATEUR': 'Administrateur',
  'EPIDEMIOLOGISTE': 'Épidémiologiste',
  'AGENT_SAISIE': 'Agent de saisie',
  'LECTEUR': 'Lecteur'
}

const UsersManagementTab: React.FC = () => {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Récupération
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  })

  // Suppression
  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Utilisateur supprimé')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  // Handlers
  const handleAdd = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Gestion des Utilisateurs
          </h2>
          <p className="text-sm text-gray-600">
            {users.length} utilisateur{users.length > 1 ? 's' : ''}
          </p>
        </div>

        {!showForm && (
          <Button variant="primary" onClick={handleAdd}>
            <Plus size={20} className="mr-2" />
            Nouvel utilisateur
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h3>
          <UserForm
            initialData={editingUser || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingUser(null)
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
                Nom Complet
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.prenom} {user.nom}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {roleLabels[user.role] || user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    user.is_active || user.actif
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(user.is_active || user.actif) ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Modifier"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
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

export default UsersManagementTab
