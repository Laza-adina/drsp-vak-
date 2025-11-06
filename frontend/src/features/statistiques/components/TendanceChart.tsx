import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { statistiquesService } from '@api/services/statistiques.service'
import Card from '@components/common/Card'
import LineChart from '@components/charts/LineChart'
import Loading from '@components/common/Loading'
import ErrorMessage from '@components/common/ErrorMessage'

const TendanceChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tendance'],
    queryFn: () => statistiquesService.getTendance(),
  })

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage message="Erreur de chargement de la tendance" />

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse de tendance</h3>
      <LineChart
        data={data || []}
        xKey="periode"
        lines={[{ dataKey: 'nombre_cas', stroke: '#1F4E78', name: 'Cas' }]}
        height={350}
      />
    </Card>
  )
}

export default TendanceChart
