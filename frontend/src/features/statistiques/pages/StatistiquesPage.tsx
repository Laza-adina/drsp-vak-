/**
 * 📄 Fichier: src/features/statistiques/pages/StatistiquesPage.tsx
 * 📝 Description: Page d'analyses statistiques
 * 🎯 Usage: Visualisation avancée des données épidémiologiques
 */

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { statistiquesService } from '@/api/services/statistiques.service'
import { referentielsService } from '@/api/services/users.service'
import Card from '@/components/common/Card'
import Select from '@/components/common/Select'
import Loading from '@/components/common/Loading'
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'

const StatistiquesPage: React.FC = () => {
  const [maladieId, setMaladieId] = useState<number>()
  const [periode, setPeriode] = useState('30j')

  const { data: maladies } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: tendance, isLoading: tendanceLoading } = useQuery({
    queryKey: ['statistiques-tendance', maladieId, periode],
    queryFn: () => statistiquesService.getTendance(maladieId, periode),
  })

  const { data: incidence, isLoading: incidenceLoading } = useQuery({
    queryKey: ['statistiques-incidence', maladieId],
    queryFn: () => statistiquesService.getTauxIncidence(maladieId),
  })

  const { data: age, isLoading: ageLoading } = useQuery({
    queryKey: ['statistiques-age', maladieId],
    queryFn: () => statistiquesService.getDistributionAge(maladieId),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600">Analyses épidémiologiques détaillées</p>
      </div>

      {/* Filtres */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Maladie"
            placeholder="Toutes les maladies"
            value={maladieId || ''}
            onChange={(e) => setMaladieId(e.target.value ? Number(e.target.value) : undefined)}
            options={maladies?.map((m: any) => ({ value: m.id, label: m.nom })) || []}
          />

          <Select
            label="Période"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            options={[
              { value: '7j', label: '7 derniers jours' },
              { value: '30j', label: '30 derniers jours' },
              { value: '90j', label: '90 derniers jours' },
              { value: '1an', label: '1 an' },
            ]}
          />
        </div>
      </Card>

      {/* Tendance */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendance temporelle</h3>
        {tendanceLoading ? (
          <Loading />
        ) : (
          <LineChart
            data={tendance || []}
            xKey="periode"
            yKey="nombre_cas"
            yKey2="nombre_deces"
            height={300}
          />
        )}
      </Card>

      {/* Taux d'incidence */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Taux d'incidence par district (/ 100k hab.)
        </h3>
        {incidenceLoading ? (
          <Loading />
        ) : (
          <BarChart
            data={incidence || []}
            xKey="zone_nom"
            yKey="taux_incidence"
            height={300}
            horizontal
          />
        )}
      </Card>

      {/* Distribution par âge */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribution par tranche d'âge
        </h3>
        {ageLoading ? (
          <Loading />
        ) : (
          <PieChart
            data={age || []}
            nameKey="tranche_age"
            valueKey="nombre_cas"
            height={300}
          />
        )}
      </Card>
    </div>
  )
}

export default StatistiquesPage
