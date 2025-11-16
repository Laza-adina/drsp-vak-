/**
 * 📄 Fichier: src/features/dashboard/pages/DashboardPage.tsx
 * 📝 Description: Dashboard avec filtrage par maladie et actions rapides
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'  // ✅ AJOUTER
import { useQuery } from '@tanstack/react-query'
import { 
  Activity, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,           // ✅ AJOUTER
  FileText,       // ✅ AJOUTER
  Download        // ✅ AJOUTER
} from 'lucide-react'
import { referentielsService } from '@/api/services/referentiels.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'  // ✅ AJOUTER
import Loading from '@/components/common/Loading'
import StatsCard from '../components/StatsCard'
import MaladieSelector from '../components/MaladieSelector'
import AlerteSection from '../components/AlerteSection'
import CasEvolutionChart from '../components/CasEvolutionChart'
import CasDistrictChart from '../components/CasDistrictChart'
import CasStatutChart from '../components/CasStatutChart'
import axiosInstance from '@/api/axios.config'

// Types
interface DashboardStats {
  total_cas: number
  cas_actifs: number
  cas_gueris: number
  cas_decedes: number
  taux_guerison: number
  taux_mortalite: number
  nouveaux_cas_7j: number
  evolution_7j: number
  cas_par_district: { district: string; count: number }[]
  cas_par_statut: { statut: string; count: number }[]
  evolution_temporelle: { date: string; count: number }[]
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()  // ✅ AJOUTER
  const [selectedMaladieId, setSelectedMaladieId] = useState<number | null>(null)

  // Récupérer les maladies
  const { data: maladies = [] } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  // Récupérer les stats pour la maladie sélectionnée
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', selectedMaladieId],
    queryFn: async () => {
      const params = selectedMaladieId ? { maladie_id: selectedMaladieId } : {}
      const response = await axiosInstance.get<DashboardStats>('/statistiques/dashboard', { params })
      return response.data
    },
  })

  // Trouver la maladie sélectionnée
  const selectedMaladie = maladies.find(m => m.id === selectedMaladieId)

  // Calculer le statut d'alerte
  const getAlerteStatus = () => {
    if (!selectedMaladie || !stats) return null

    const { total_cas } = stats
    const { seuil_alerte, seuil_epidemie } = selectedMaladie

    if (total_cas >= seuil_epidemie) {
      return { 
        niveau: 'epidemie', 
        color: 'red', 
        label: '🚨 ÉPIDÉMIE', 
        message: `Seuil épidémie dépassé (${total_cas}/${seuil_epidemie})` 
      }
    } else if (total_cas >= seuil_alerte) {
      return { 
        niveau: 'alerte', 
        color: 'orange', 
        label: '⚠️ ALERTE', 
        message: `Seuil d'alerte dépassé (${total_cas}/${seuil_alerte})` 
      }
    } else {
      return { 
        niveau: 'normal', 
        color: 'green', 
        label: '✅ Normal', 
        message: `Situation sous contrôle (${total_cas}/${seuil_alerte})` 
      }
    }
  }

  const alerteStatus = getAlerteStatus()

  return (
    <div className="space-y-6">
      {/* ========================================
          📋 EN-TÊTE AVEC ACTIONS RAPIDES
          ======================================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📊 Tableau de Bord Épidémiologique
          </h1>
          <p className="text-gray-600">
            Surveillance et analyse des maladies à Vakinankaratra
          </p>
        </div>

        {/* ✅ BOUTONS D'ACTION RAPIDE */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/cas/nouveau')}
          >
            <Plus size={20} className="mr-2" />
            Déclarer un cas
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/cas')}
          >
            <FileText size={20} className="mr-2" />
            Voir tous les cas
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/rapports')}
          >
            <Download size={20} className="mr-2" />
            Rapports
          </Button>
        </div>
      </div>

      {/* Sélecteur de maladie */}
      <MaladieSelector
        maladies={maladies}
        selectedId={selectedMaladieId}
        onChange={setSelectedMaladieId}
      />

      {/* Loading */}
      {isLoading && <Loading />}

      {/* Contenu */}
      {!isLoading && stats && (
        <>
          {/* Section Alerte */}
          {selectedMaladie && alerteStatus && (
            <AlerteSection
              maladie={selectedMaladie}
              stats={stats}
              alerteStatus={alerteStatus}
            />
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Cas"
              value={stats.total_cas}
              icon={<Activity size={24} />}
              color="blue"
              trend={stats.evolution_7j}
              subtitle={`+${stats.nouveaux_cas_7j} (7 derniers jours)`}
            />

            <StatsCard
              title="Cas Actifs"
              value={stats.cas_actifs}
              icon={<AlertTriangle size={24} />}
              color="orange"
              subtitle="En cours de traitement"
            />

            <StatsCard
              title="Guéris"
              value={stats.cas_gueris}
              icon={<CheckCircle size={24} />}
              color="green"
              percentage={stats.taux_guerison}
              subtitle={`${stats.taux_guerison.toFixed(1)}% de guérison`}
            />

            <StatsCard
              title="Décès"
              value={stats.cas_decedes}
              icon={<XCircle size={24} />}
              color="red"
              percentage={stats.taux_mortalite}
              subtitle={`${stats.taux_mortalite.toFixed(1)}% de mortalité`}
            />
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution temporelle */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                📈 Évolution des Cas
              </h3>
              <CasEvolutionChart data={stats.evolution_temporelle} />
            </Card>

            {/* Répartition par district */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                🗺️ Répartition par District
              </h3>
              <CasDistrictChart data={stats.cas_par_district} />
            </Card>
          </div>

          {/* Statuts des cas */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              📊 Répartition par Statut
            </h3>
            <CasStatutChart data={stats.cas_par_statut} />
          </Card>
        </>
      )}

      {/* Message si aucune donnée */}
      {!isLoading && !stats && (
        <Card>
          <div className="text-center py-12">
            <Activity size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              {selectedMaladieId
                ? 'Aucune donnée disponible pour cette maladie'
                : 'Sélectionnez une maladie pour voir les statistiques'}
            </p>
            
            {/* ✅ BOUTON D'ACTION SI AUCUNE DONNÉE */}
            <Button
              variant="primary"
              onClick={() => navigate('/cas/nouveau')}
            >
              <Plus size={20} className="mr-2" />
              Déclarer le premier cas
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default DashboardPage
