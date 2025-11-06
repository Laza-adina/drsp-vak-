import React from 'react'
import Table from '@components/common/Table'
import { formatNumber } from '@utils/formatters'

interface District {
  id: number
  nom: string
  population?: number
  latitude?: number
  longitude?: number
}

interface DistrictsListProps {
  data: District[]
  loading?: boolean
}

const DistrictsList: React.FC<DistrictsListProps> = ({ data, loading }) => {
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: District) => `#${item.id}`,
    },
    {
      key: 'nom',
      header: 'Nom',
    },
    {
      key: 'population',
      header: 'Population',
      render: (item: District) =>
        item.population ? formatNumber(item.population) : 'N/A',
    },
    {
      key: 'coordonnees',
      header: 'Coordonnées GPS',
      render: (item: District) =>
        item.latitude && item.longitude
          ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
          : 'N/A',
    },
  ]

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      loading={loading}
      emptyMessage="Aucun district trouvé"
    />
  )
}

export default DistrictsList
