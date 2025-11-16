/**
 * 📄 Fichier: src/features/admin/components/UsersManagementTab.tsx
 * 📝 Description: Onglet gestion des utilisateurs
 * 🎯 Usage: CRUD utilisateurs avec sélection de rôle
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
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
  
  // ========================================
  // ✅ ÉTAT DU MODAL DE CONFIRMATION
  // ========================================
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

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
      toast.success('Utilisateur supprimé avec succès')
      setShowDeleteModal(false)
      setUserToDelete(null)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  // ========================================
  // 📝 HANDLERS
  // ========================================
  const handleAdd = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  // ✅ OUVRIR LE MODAL DE SUPPRESSION
  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  // ✅ CONFIRMER LA SUPPRESSION
  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id)
    }
  }

  // ✅ ANNULER LA SUPPRESSION
  const cancelDelete = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
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
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                    title="Modifier"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
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

      {/* ========================================
          ✅ MODAL DE CONFIRMATION SUPPRESSION
          ======================================== */}
      {showDeleteModal && userToDelete && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={cancelDelete}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                 
                  <h3 className="text-xl font-semibold text-gray-900">
                    Supprimer l'utilisateur
                  </h3>
                </div>
                <button
                  onClick={cancelDelete}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={deleteMutation.isPending}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                  <span className="font-semibold text-gray-900">
                    {userToDelete.prenom} {userToDelete.nom}
                  </span>{' '}
                  ({userToDelete.email}) ?
                </p>
                <p className="text-red-600 text-sm mt-2">
                  ⚠️ Cette action est irréversible.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-lg">
                <button
                  onClick={cancelDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Suppression...</span>
                    </>
                  ) : (
                    <span>Supprimer</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UsersManagementTab
