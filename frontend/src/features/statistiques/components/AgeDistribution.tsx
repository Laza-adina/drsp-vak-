import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { statistiquesService } from '@api/services/statistiques.service'
import Card from '@components/common/Card'
import PieChart from '@components/charts/PieChart'
import Loading from '@components/common/Loading'
import ErrorMessage from '@components/common/ErrorMessage'

const AgeDistribution: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['distributionAge'],
    queryFn: () => statistiquesService.getDistributionAge(),
  })

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage message="Erreur de chargement de la distribution par âge" />

  const colors = ['#1F4E78', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution par tranche d'âge</h3>
      <PieChart
        data={data || []}
        dataKey="nombre_cas"
        nameKey="tranche_age"
        colors={colors}
        height={350}
      />
    </Card>
  )
}

export default AgeDistribution
