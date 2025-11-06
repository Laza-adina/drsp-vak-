import React from 'react'
import Table from '@components/common/Table'

interface Maladie {
  id: number
  nom: string
  code?: string
  description?: string
  seuil_alerte?: number
}

interface MaladiesListProps {
  data: Maladie[]
  loading?: boolean
}

const MaladiesList: React.FC<MaladiesListProps> = ({ data, loading }) => {
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: Maladie) => `#${item.id}`,
    },
    {
      key: 'nom',
      header: 'Nom',
    },
    {
      key: 'code',
      header: 'Code',
      render: (item: Maladie) => item.code || 'N/A',
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: Maladie) => item.description || '-',
    },
    {
      key: 'seuil_alerte',
      header: "Seuil d'alerte",
      render: (item: Maladie) => (item.seuil_alerte ? `${item.seuil_alerte} cas` : 'N/A'),
    },
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      loading={loading}
      emptyMessage="Aucune maladie trouvée"
    />
  )
}

export default MaladiesList
