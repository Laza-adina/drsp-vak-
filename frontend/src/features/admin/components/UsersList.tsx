import React, { useState } from 'react'
import { User } from '@/types/auth.types'
import Table from '@components/common/Table'
import { formatDate } from '@utils/formatters'
import { Edit, Trash2, CheckCircle, XCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface UsersListProps {
  data: User[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  loading?: boolean
}

const UsersList: React.FC<UsersListProps> = ({ data, onEdit, onDelete, loading }) => {
  // ========================================
  // 🎯 STATE POUR LE MODAL
  // ========================================
  const [showModal, setShowModal] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    type: 'delete' | 'edit'
    user: User | null
  }>({ type: 'delete', user: null })
  const [isLoading, setIsLoading] = useState(false)

  // ========================================
  // 🗑️ OUVRIR MODAL SUPPRESSION
  // ========================================
  const openDeleteModal = (user: User) => {
    setModalConfig({ type: 'delete', user })
    setShowModal(true)
  }

  // ========================================
  // ✏️ OUVRIR MODAL MODIFICATION
  // ========================================
  const openEditModal = (user: User) => {
    setModalConfig({ type: 'edit', user })
    setShowModal(true)
  }

  // ========================================
  // ✅ CONFIRMER L'ACTION
  // ========================================
  const handleConfirm = async () => {
    if (!modalConfig.user) return

    try {
      setIsLoading(true)
      
      if (modalConfig.type === 'delete') {
        await onDelete(modalConfig.user.id)
        toast.success(`Utilisateur ${modalConfig.user.prenom} ${modalConfig.user.nom} supprimé`)
      } else {
        onEdit(modalConfig.user.id)
        toast.success('Ouverture du formulaire de modification')
      }
      
      setShowModal(false)
    } catch (error) {
      toast.error('Une erreur est survenue')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // ========================================
  // ❌ ANNULER
  // ========================================
  const handleCancel = () => {
    setShowModal(false)
    setModalConfig({ type: 'delete', user: null })
  }

  // ========================================
  // 📊 COLONNES DU TABLEAU
  // ========================================
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: User) => `#${item.id}`,
    },
    {
      key: 'nom',
      header: 'Nom',
      render: (item: User) => `${item.prenom} ${item.nom}`,
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (item: User) => {
        const roleColors: Record<string, string> = {
          'ADMINISTRATEUR': 'bg-red-100 text-red-800',
          'EPIDEMIOLOGISTE': 'bg-blue-100 text-blue-800',
          'AGENT_SAISIE': 'bg-yellow-100 text-yellow-800',
          'LECTEUR': 'bg-gray-100 text-gray-800',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[item.role] || 'bg-gray-100 text-gray-800'}`}>
            {item.role}
          </span>
        )
      },
    },
    {
      key: 'actif',
      header: 'Statut',
      render: (item: User) => (
        <div className="flex items-center">
          {item.actif ? (
            <>
              <CheckCircle size={16} className="text-green-500 mr-2" />
              <span className="text-green-700">Actif</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-red-500 mr-2" />
              <span className="text-red-700">Inactif</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'date_creation',
      header: 'Date création',
      render: (item: User) => formatDate(item.date_creation),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: User) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(item)}
            className="text-yellow-600 hover:text-yellow-800"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => openDeleteModal(item)}
            className="text-red-600 hover:text-red-800"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ]

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <>
      {/* Table */}
      <Table
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        loading={loading}
        emptyMessage="Aucun utilisateur trouvé"
      />

      {/* ✅ MODAL PERSONNALISÉ */}
      {showModal && modalConfig.user && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCancel}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${modalConfig.type === 'delete' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                    <span className="text-2xl">{modalConfig.type === 'delete' ? '🗑️' : '⚠️'}</span>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {modalConfig.type === 'delete' ? 'Supprimer l\'utilisateur' : 'Modifier l\'utilisateur'}
                  </h3>
                </div>
                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-600">
                  {modalConfig.type === 'delete'
                    ? `Êtes-vous sûr de vouloir supprimer "${modalConfig.user.prenom} ${modalConfig.user.nom}" ? Cette action est irréversible.`
                    : `Voulez-vous modifier "${modalConfig.user.prenom} ${modalConfig.user.nom}" ?`}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 p-6 bg-gray-50 rounded-b-lg">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 text-white rounded-lg ${
                    modalConfig.type === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  {isLoading ? 'Chargement...' : modalConfig.type === 'delete' ? 'Supprimer' : 'Modifier'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default UsersList
