import React from 'react'
import { User } from '@/types/auth.types'
import Table from '@components/common/Table'
import { formatDate } from '@utils/formatters'
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'

interface UsersListProps {
  data: User[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  loading?: boolean
}

const UsersList: React.FC<UsersListProps> = ({ data, onEdit, onDelete, loading }) => {
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
          Admin: 'bg-danger-100 text-danger-800',
          Épidémiologiste: 'bg-primary-100 text-primary-800',
          'Agent de saisie': 'bg-warning-100 text-warning-800',
          Lecteur: 'bg-gray-100 text-gray-800',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[item.role]}`}>
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
              <CheckCircle size={16} className="text-success-500 mr-2" />
              <span className="text-success-700">Actif</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-danger-500 mr-2" />
              <span className="text-danger-700">Inactif</span>
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
            onClick={() => onEdit(item.id)}
            className="text-warning-600 hover:text-warning-800"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-danger-600 hover:text-danger-800"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      loading={loading}
      emptyMessage="Aucun utilisateur trouvé"
    />
  )
}

export default UsersList
