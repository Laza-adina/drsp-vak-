/**
 * 📄 Fichier: src/features/admin/pages/AdminPage.tsx
 * 📝 Description: Page d'administration (réservée aux admins)
 * 🎯 Usage: Gestion des utilisateurs, districts, maladies
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { usersService, referentielsService } from '@/api/services/users.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Loading from '@/components/common/Loading'
import UserForm from '../components/UserForm'
import toast from 'react-hot-toast'
import type { User } from '@/types/auth.types'

const AdminPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'users' | 'districts' | 'maladies'>('users')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // ========================================
  // 📡 RÉCUPÉRATION DES DONNÉES
  // ========================================
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  const { data: maladies } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  // ========================================
  // 🗑️ MUTATION SUPPRESSION UTILISATEUR
  // ========================================
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Utilisateur supprimé')
    },
  })

  // ========================================
  // 🎯 HANDLERS
  // ========================================
  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUserMutation.mutate(id)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="space-y-6">
      {/* EN-TÊTE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-600">Gestion du système et des utilisateurs</p>
      </div>

      {/* TABS */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab('districts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'districts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Districts
          </button>
          <button
            onClick={() => setActiveTab('maladies')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'maladies'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Maladies
          </button>
        </nav>
      </div>

      {/* ========================================
          👥 ONGLET UTILISATEURS
          ======================================== */}
      {activeTab === 'users' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des utilisateurs ({users?.length || 0})
            </h2>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} className="mr-2" />
              Nouvel utilisateur
            </Button>
          </div>

          {usersLoading ? (
            <Loading />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-primary">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge ${
                            user.actif ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {user.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-danger-600 hover:text-danger-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* ========================================
          🗺️ ONGLET DISTRICTS
          ======================================== */}
      {activeTab === 'districts' && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Districts ({districts?.length || 0})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districts?.map((district: any) => (
              <Card key={district.id} className="bg-gray-50">
                <h3 className="font-semibold text-gray-900">{district.nom}</h3>
                {district.population && (
                  <p className="text-sm text-gray-600 mt-1">
                    Population: {district.population.toLocaleString()} hab.
                  </p>
                )}
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* ========================================
          🦠 ONGLET MALADIES
          ======================================== */}
      {activeTab === 'maladies' && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Maladies surveillées ({maladies?.length || 0})
          </h2>
          <div className="space-y-3">
            {maladies?.map((maladie: any) => (
              <Card key={maladie.id} className="bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{maladie.nom}</h3>
                    <p className="text-sm text-gray-600 mt-1">{maladie.code}</p>
                    {maladie.description && (
                      <p className="text-sm text-gray-500 mt-2">{maladie.description}</p>
                    )}
                  </div>
                  {maladie.seuil_alerte && (
                    <span className="badge badge-warning">
                      Seuil: {maladie.seuil_alerte}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* ========================================
          🪟 MODAL UTILISATEUR
          ======================================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        size="lg"
      >
        <UserForm
          initialData={editingUser || undefined}
          onSuccess={() => {
            handleModalClose()
            queryClient.invalidateQueries({ queryKey: ['users'] })
          }}
        />
      </Modal>
    </div>
  )
}

export default AdminPage
