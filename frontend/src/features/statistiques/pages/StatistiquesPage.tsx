// src/features/statistiques/pages/StatistiquesPage.tsx
/**
 * 📄 Fichier: src/features/statistiques/pages/StatistiquesPage.tsx
 * 📝 Description: Page complète d'analyses statistiques et prédictions IA
 * 🎯 Usage: Visualisation avancée des données épidémiologiques
 */

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Activity, Users, AlertTriangle, BarChart3, Filter } from 'lucide-react'
import { statistiquesService } from '@/api/services/statistiques.service'
import { referentielsService } from '@/api/services/referentiels.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import PredictionsChart from '../components/PredictionsChart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const StatistiquesPage: React.FC = () => {
  const [maladieId, setMaladieId] = useState<number | undefined>()
  const [districtId, setDistrictId] = useState<number | undefined>()
  const [showFilters, setShowFilters] = useState(true)

  // Queries référentiels
  const { data: maladies = [] } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Queries statistiques
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ['statistiques-dashboard', maladieId],
    queryFn: () => statistiquesService.getDashboard(maladieId),
  })

  const { data: tendance, isLoading: tendanceLoading } = useQuery({
    queryKey: ['statistiques-tendance', maladieId, districtId],
    queryFn: () => statistiquesService.getTendance(maladieId, districtId, 14),
    enabled: !!maladieId || !!districtId,
  })

  const { data: distributionAge, isLoading: ageLoading } = useQuery({
    queryKey: ['statistiques-age', maladieId, districtId],
    queryFn: () => statistiquesService.getDistributionAge(maladieId, districtId),
  })

  // Couleurs pour les graphiques
  const COLORS = ['#1F4E78', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  const STATUS_COLORS: Record<string, string> = {
    suspect: '#f59e0b',
    probable: '#f97316',
    confirme: '#ef4444',
    gueri: '#22c55e',
    decede: '#6b7280'
  }

  return (
    <div className="space-y-6">
      {/* EN-TÊTE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Statistiques & Prédictions</h1>
          <p className="text-gray-600">
            Analyses épidémiologiques avancées avec prédictions IA
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="mr-2" />
          {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
        </Button>
      </div>

      {/* FILTRES */}
      {showFilters && (
        <Card className="bg-blue-50 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maladie
              </label>
              <select
                value={maladieId || ''}
                onChange={(e) => setMaladieId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Toutes les maladies</option>
                {maladies.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                value={districtId || ''}
                onChange={(e) => setDistrictId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous les districts</option>
                {districts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.nom}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* INDICATEURS CLÉS */}
      {dashboardLoading ? (
        <Loading message="Chargement des statistiques..." />
      ) : dashboard ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total cas</p>
                <p className="text-3xl font-bold text-blue-600">{dashboard.total_cas}</p>
              </div>
              <Activity size={32} className="text-blue-500" />
            </div>
          </Card>

          <Card className="border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cas actifs</p>
                <p className="text-3xl font-bold text-orange-600">{dashboard.cas_actifs}</p>
              </div>
              <AlertTriangle size={32} className="text-orange-500" />
            </div>
          </Card>

          <Card className="border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux guérison</p>
                <p className="text-3xl font-bold text-green-600">{dashboard.taux_guerison}%</p>
              </div>
              <Users size={32} className="text-green-500" />
            </div>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nouveaux (7j)</p>
                <p className="text-3xl font-bold text-purple-600">{dashboard.nouveaux_cas_7j}</p>
                <p className={`text-sm font-medium ${
                  dashboard.evolution_7j > 0 ? 'text-red-600' : 
                  dashboard.evolution_7j < 0 ? 'text-green-600' : 
                  'text-gray-600'
                }`}>
                  {dashboard.evolution_7j > 0 ? '+' : ''}{dashboard.evolution_7j}%
                </p>
              </div>
              <TrendingUp size={32} className="text-purple-500" />
            </div>
          </Card>
        </div>
      ) : null}

      {/* 🤖 PRÉDICTIONS IA */}
      {maladieId && (
        <PredictionsChart 
          maladieId={maladieId} 
          districtId={districtId}
        />
      )}

      {/* ÉVOLUTION TEMPORELLE */}
      {dashboard && dashboard.evolution_temporelle && dashboard.evolution_temporelle.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Évolution temporelle (30 derniers jours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboard.evolution_temporelle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#1F4E78" 
                strokeWidth={2}
                name="Nombre de cas"
                dot={{ fill: '#1F4E78', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* GRILLE GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CAS PAR DISTRICT */}
        {dashboard && dashboard.cas_par_district && dashboard.cas_par_district.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📍 Répartition par district
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboard.cas_par_district} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="district" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1F4E78" name="Nombre de cas" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* CAS PAR STATUT */}
        {dashboard && dashboard.cas_par_statut && dashboard.cas_par_statut.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🎯 Répartition par statut
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboard.cas_par_statut}
                  dataKey="count"
                  nameKey="statut"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.statut}: ${entry.count}`}
                >
                  {dashboard.cas_par_statut.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.statut] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* DISTRIBUTION PAR ÂGE */}
        {distributionAge && distributionAge.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              👥 Distribution par tranche d'âge
            </h3>
            {ageLoading ? (
              <Loading />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionAge}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="tranche_age" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="nombre_cas" fill="#22c55e" name="Nombre de cas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        )}

        {/* ANALYSE DE TENDANCE */}
        {tendance && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Analyse de tendance (14 jours)
            </h3>
            {tendanceLoading ? (
              <Loading />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Période 1</p>
                    <p className="text-2xl font-bold text-blue-600">{tendance.periode1_cas}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tendance.date_debut).toLocaleDateString('fr-FR')} - {new Date(tendance.date_milieu).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Période 2</p>
                    <p className="text-2xl font-bold text-purple-600">{tendance.periode2_cas}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tendance.date_milieu).toLocaleDateString('fr-FR')} - {new Date(tendance.date_fin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  tendance.tendance === 'croissante' ? 'bg-red-50' :
                  tendance.tendance === 'decroissante' ? 'bg-green-50' :
                  'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tendance</p>
                      <p className={`text-xl font-bold capitalize ${
                        tendance.tendance === 'croissante' ? 'text-red-600' :
                        tendance.tendance === 'decroissante' ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {tendance.tendance === 'croissante' ? '📈 Croissante' :
                         tendance.tendance === 'decroissante' ? '📉 Décroissante' :
                         '➡️ Stable'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Variation</p>
                      <p className={`text-2xl font-bold ${
                        tendance.variation_pourcent > 0 ? 'text-red-600' :
                        tendance.variation_pourcent < 0 ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {tendance.variation_pourcent > 0 ? '+' : ''}{tendance.variation_pourcent}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* MESSAGE SI PAS DE MALADIE SÉLECTIONNÉE */}
      {!maladieId && (
        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-900">
                Sélectionne une maladie pour voir les prédictions IA
              </p>
              <p className="text-sm text-yellow-700">
                Les prédictions Prophet nécessitent une maladie spécifique
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default StatistiquesPage
