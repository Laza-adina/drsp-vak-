import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Filter, RefreshCw, X, AlertTriangle } from 'lucide-react'
import { alertesService } from '@/api/services/alertes.service'
import { referentielsService } from '@/api/services/referentiels.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import toast from 'react-hot-toast'
import type { AlerteFilters, StatutAlerte, NiveauAlerte } from '@/types/alertes.types'
import AlerteCard from '../components/AlerteCard'
import AlerteModal from '../components/AlerteModal'

const AlertesPage: React.FC = () => {
  const queryClient = useQueryClient()
  
  // États
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<AlerteFilters>({})
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAlerte, setSelectedAlerte] = useState<number | null>(null)

  // Queries
  const { data: alertes = [], isLoading } = useQuery({
    queryKey: ['alertes', filters],
    queryFn: () => alertesService.getAll(filters),
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  })

  const { data: maladies = [] } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Mutations
  const checkThresholdsMutation = useMutation({
    mutationFn: () => alertesService.checkThresholds(),
    onSuccess: (newAlertes) => {
      queryClient.invalidateQueries({ queryKey: ['alertes'] })
      if (newAlertes.length > 0) {
        toast.success(`${newAlertes.length} nouvelle(s) alerte(s) détectée(s)`)
      } else {
        toast.success('Aucune nouvelle alerte. Tous les seuils sont respectés.')
      }
    },
    onError: () => {
      toast.error('Erreur lors de la vérification des seuils')
    },
  })
  

  const deleteMutation = useMutation({
    mutationFn: (id: number) => alertesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertes'] })
      toast.success('Alerte supprimée')
    },
  })

  // Compteurs par gravité
  const critiques = alertes.filter(a => a.niveau_gravite === 'critique' && a.statut === 'active').length
  const alertesNiveau = alertes.filter(a => a.niveau_gravite === 'alerte' && a.statut === 'active').length
  const avertissements = alertes.filter(a => a.niveau_gravite === 'avertissement' && a.statut === 'active').length
  const resolues = alertes.filter(a => a.statut === 'resolue').length  // ✅ Toutes les résolues
  return (
    <div className="space-y-6">
      {/* EN-TÊTE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🚨 Alertes épidémiologiques</h1>
          <p className="text-gray-600">
            {alertes.length} alerte{alertes.length > 1 ? 's' : ''} • {critiques} critique{critiques > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filtres
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => checkThresholdsMutation.mutate()}
            loading={checkThresholdsMutation.isPending}
          >
            <RefreshCw size={18} className="mr-2" />
            Vérifier les seuils
          </Button>

          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} className="mr-2" />
            Nouvelle alerte
          </Button>
        </div>
      </div>

      {/* STATISTIQUES RAPIDES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-red-600">
          <p className="text-sm text-gray-600">Critiques actives</p>
          <p className="text-3xl font-bold text-red-600">{critiques}</p>
        </Card>
        <Card className="border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">Alertes actives</p>
          <p className="text-3xl font-bold text-orange-500">{alertesNiveau}</p>
        </Card>
        <Card className="border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Avertissements</p>
          <p className="text-3xl font-bold text-yellow-500">{avertissements}</p>
        </Card>
        <Card className="border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Résolues (7j)</p>
          <p className="text-3xl font-bold text-green-600">{resolues}</p>  {/* ✅ Afficher toutes les résolues */}
        </Card>
      </div>

      {/* FILTRES */}
      {showFilters && (
        <Card className="bg-blue-50 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filters.statut || ''}
                onChange={(e) => setFilters({ ...filters, statut: e.target.value as StatutAlerte || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                <option value="active">Active</option>
                <option value="en_cours">En cours</option>
                <option value="resolue">Résolue</option>
                <option value="fausse_alerte">Fausse alerte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gravité</label>
              <select
                value={filters.niveau_gravite || ''}
                onChange={(e) => setFilters({ ...filters, niveau_gravite: e.target.value as NiveauAlerte || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Toutes</option>
                <option value="critique">🔴 Critique</option>
                <option value="alerte">🟠 Alerte</option>
                <option value="avertissement">🟡 Avertissement</option>
                <option value="info">🔵 Info</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maladie</label>
              <select
                value={filters.maladie_id || ''}
                onChange={(e) => setFilters({ ...filters, maladie_id: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Toutes</option>
                {maladies.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select
                value={filters.district_id || ''}
                onChange={(e) => setFilters({ ...filters, district_id: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous</option>
                {districts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilters({ statut: 'active' })}
            >
              <X size={16} className="mr-2" />
              Réinitialiser
            </Button>
          </div>
        </Card>
      )}

      {/* LISTE DES ALERTES */}
      {isLoading ? (
        <Loading message="Chargement des alertes..." />
      ) : alertes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucune alerte trouvée</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertes.map((alerte) => (
            <AlerteCard
              key={alerte.id}
              alerte={alerte}
              onClick={() => setSelectedAlerte(alerte.id)}
              onDelete={() => deleteMutation.mutate(alerte.id)}
            />
          ))}
        </div>
      )}

      {/* MODAL CRÉATION */}
      {showCreateModal && (
        <AlerteModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            queryClient.invalidateQueries({ queryKey: ['alertes'] })
          }}
        />
      )}

      {/* MODAL DÉTAILS */}
      {selectedAlerte && (
        <AlerteModal
          alerteId={selectedAlerte}
          onClose={() => setSelectedAlerte(null)}
          onSuccess={() => {
            setSelectedAlerte(null)
            queryClient.invalidateQueries({ queryKey: ['alertes'] })
          }}
        />
      )}
    </div>
  )
}

export default AlertesPage
