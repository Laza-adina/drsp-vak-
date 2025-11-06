/**
 * 📄 Fichier: src/features/dashboard/pages/DashboardPage.tsx
 * 📝 Description: Dashboard principal amélioré
 * 🎯 Usage: Vue d'ensemble complète avec actions rapides
 */

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Activity,
  Plus,
  FileText,
  MapPin,
  Calendar
} from 'lucide-react'
import { dashboardService } from '@/api/services/dashboard.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [periode, setPeriode] = useState('30')

  // ========================================
  // 📡 CHARGEMENT DES DONNÉES
  // ========================================
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  })

  const { data: evolution, isLoading: evolutionLoading } = useQuery({
    queryKey: ['dashboard-evolution', periode],
    queryFn: () => dashboardService.getEvolution(`${periode}j`),
  })

  const { data: topDistricts, isLoading: districtsLoading } = useQuery({
    queryKey: ['dashboard-top-districts'],
    queryFn: () => dashboardService.getTopDistricts(),
  })

  const { data: maladies, isLoading: maladiesLoading } = useQuery({
    queryKey: ['dashboard-maladies'],
    queryFn: () => dashboardService.getDistributionMaladies(),
  })

  // ========================================
  // ⏳ ÉTAT DE CHARGEMENT
  // ========================================
  if (statsLoading) {
    return <Loading message="Chargement du dashboard..." />
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="space-y-6">
      {/* ========================================
          📊 EN-TÊTE + ACTIONS RAPIDES
          ======================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de la surveillance épidémiologique
          </p>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/cas/nouveau')}
          >
            <Plus size={18} className="mr-2" />
            Nouveau cas
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/cartographie')}
          >
            <MapPin size={18} className="mr-2" />
            Voir la carte
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/rapports')}
          >
            <FileText size={18} className="mr-2" />
            Rapports
          </Button>
        </div>
      </div>

      {/* ========================================
          📈 STATISTIQUES PRINCIPALES (KPIs)
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total des cas */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total des cas</p>
              <h3 className="text-3xl font-bold mt-2">
                {stats?.total_cas || 0}
              </h3>
              <div className="flex items-center mt-2 text-sm text-blue-100">
                <TrendingUp size={16} className="mr-1" />
                <span>+{stats?.nouveaux_cas?.['7j'] || 0} cette semaine</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Activity size={24} />
            </div>
          </div>
        </Card>

        {/* Nouveaux cas 24h */}
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Dernières 24h</p>
              <h3 className="text-3xl font-bold mt-2">
                {stats?.nouveaux_cas?.['24h'] || 0}
              </h3>
              <div className="flex items-center mt-2 text-sm text-orange-100">
                <Calendar size={16} className="mr-1" />
                <span>Nouveaux cas signalés</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        {/* Alertes actives */}
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Alertes actives</p>
              <h3 className="text-3xl font-bold mt-2">
                {Object.values(stats?.alertes_actives || {}).reduce((a, b) => a + b, 0)}
              </h3>
              <div className="flex items-center mt-2 text-sm text-red-100">
                <AlertTriangle size={16} className="mr-1" />
                <span>Nécessitent une action</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>

        {/* Districts touchés */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Districts touchés</p>
              <h3 className="text-3xl font-bold mt-2">
                {topDistricts?.length || 0}
              </h3>
              <div className="flex items-center mt-2 text-sm text-green-100">
                <MapPin size={16} className="mr-1" />
                <span>Sur 7 districts</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Users size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================
          📊 GRAPHIQUES ET TABLEAUX
          ======================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique d'évolution (2/3 de largeur) */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Évolution des cas
            </h3>
            <div className="flex gap-2">
              {['7', '30', '90'].map((days) => (
                <button
                  key={days}
                  onClick={() => setPeriode(days)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    periode === days
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {days}j
                </button>
              ))}
            </div>
          </div>

          {evolutionLoading ? (
            <Loading />
          ) : evolution && evolution.length > 0 ? (
            <div className="h-64">
              {/* Graphique simple en barres */}
              <div className="flex items-end justify-between h-full gap-1">
                {evolution.slice(-14).map((item, index) => {
                  const maxCas = Math.max(...evolution.map(e => e.nombre_cas))
                  const height = (item.nombre_cas / maxCas) * 100
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-colors cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`${new Date(item.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}: ${item.nombre_cas} cas`}
                      />
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(item.date).getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </Card>

        {/* Top 5 districts */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Districts les plus touchés
          </h3>

          {districtsLoading ? (
            <Loading />
          ) : topDistricts && topDistricts.length > 0 ? (
            <div className="space-y-3">
              {topDistricts.slice(0, 5).map((district, index) => (
                <div key={district.district_id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {district.district_nom}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{
                            width: `${(district.nombre_cas / topDistricts[0].nombre_cas) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {district.nombre_cas}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              Aucun cas enregistré
            </div>
          )}

          <Button
            variant="secondary"
            fullWidth
            className="mt-4"
            onClick={() => navigate('/statistiques')}
          >
            Voir toutes les statistiques
          </Button>
        </Card>
      </div>

      {/* ========================================
          🦠 RÉPARTITION PAR MALADIE
          ======================================== */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par maladie
        </h3>

        {maladiesLoading ? (
          <Loading />
        ) : maladies && maladies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {maladies.map((maladie, index) => {
              const colors = [
                'bg-blue-100 text-blue-800',
                'bg-green-100 text-green-800',
                'bg-purple-100 text-purple-800',
                'bg-pink-100 text-pink-800',
                'bg-yellow-100 text-yellow-800',
              ]
              const color = colors[index % colors.length]

              return (
                <div
                  key={maladie.maladie_id}
                  className={`${color} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => navigate(`/cas?maladie=${maladie.maladie_id}`)}
                >
                  <p className="text-sm font-medium opacity-80">
                    {maladie.maladie_nom}
                  </p>
                  <div className="flex items-baseline mt-2">
                    <h4 className="text-3xl font-bold">
                      {maladie.nombre_cas}
                    </h4>
                    <span className="ml-2 text-sm opacity-80">
                      cas ({maladie.pourcentage?.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune maladie enregistrée
          </div>
        )}
      </Card>
    </div>
  )
}

export default DashboardPage
