import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { statistiquesService } from '@api/services/statistiques.service'
import Card from '@components/common/Card'
import BarChart from '@components/charts/BarChart'
import Loading from '@components/common/Loading'
import ErrorMessage from '@components/common/ErrorMessage'

const IncidenceChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tauxIncidence'],
    queryFn: () => statistiquesService.getTauxIncidence(),
  })

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage message="Erreur de chargement du taux d'incidence" />

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux d'incidence par district</h3>
      <BarChart
        data={data || []}
        xKey="district_nom"
        bars={[
          { dataKey: 'taux_incidence', fill: '#1F4E78', name: "Taux d'incidence" },
        ]}
        height={350}
      />
    </Card>
  )
}

export default IncidenceChart
