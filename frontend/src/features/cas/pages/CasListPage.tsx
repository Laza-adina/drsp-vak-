/**
 * 📄 Fichier: src/features/cas/pages/CasListPage.tsx
 * 📝 Administration : liste des cas déclarés - Design homogène admin
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Filter, X, Search, Calendar, Edit2, Trash2, Eye } from 'lucide-react'
import { casService } from '@/api/services/cas.service'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import toast from 'react-hot-toast'
import type { CasFilters as CasFiltersType, Cas } from '@/types/cas.types'

const CasListPage: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // États
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<CasFiltersType>({})
  const [searchTerm, setSearchTerm] = useState('')
  
  // ✅ AJOUT : Modal de confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [casToDelete, setCasToDelete] = useState<number | null>(null)

  // Queries
  const { data: cas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['cas', filters],
    queryFn: () => casService.getAll(filters),
  })
  const { data: maladies = [] } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })
  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Mutation suppression
  const deleteMutation = useMutation({
    mutationFn: (id: number) => casService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cas'] })
      toast.success('Cas supprimé')
      setShowDeleteConfirm(false)
      setCasToDelete(null)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })

  // Handlers
  const handleView = (id: number) => navigate(`/cas/${id}`)
  const handleEdit = (id: number) => navigate(`/cas/${id}/modifier`)
  
  // ✅ MODIFIÉ : Ouvrir le modal
  const handleDelete = (id: number) => {
    setCasToDelete(id)
    setShowDeleteConfirm(true)
  }

  // ✅ AJOUT : Confirmer la suppression
  const confirmDelete = () => {
    if (casToDelete) {
      deleteMutation.mutate(casToDelete)
    }
  }

  const handleFilterChange = (key: keyof CasFiltersType, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }))
  }
  
  const handleResetFilters = () => {
    setFilters({})
    setSearchTerm('')
  }
  
  const filteredCas = cas.filter(c => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      c.numero_cas?.toLowerCase().includes(search) ||
      c.maladie?.nom?.toLowerCase().includes(search)
    )
  })
  
  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length

  if (isLoading) return <Loading message="Chargement..." />
  if (error) return <ErrorMessage message="Erreur" onRetry={refetch} />

  return (
    <div className="space-y-6">
      {/* EN-TÊTE & BARRE D'ACTIONS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            📋 Gestion des cas
          </h2>
          <p className="text-sm text-gray-600">
            {filteredCas.length} cas enregistré{filteredCas.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={20} className="mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button variant="primary" onClick={() => navigate('/cas/nouveau')}>
            <Plus size={20} className="mr-2" />
            Déclarer un cas
          </Button>
        </div>
      </div>

      {/* RECHERCHE */}
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <input
          type="text"
          placeholder="Rechercher par numéro de cas ou maladie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* FILTRES AVANCÉS */}
      {showFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maladie</label>
              <select
                value={filters.maladie_id || ''}
                onChange={(e) => handleFilterChange('maladie_id', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                onChange={(e) => handleFilterChange('district_id', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous</option>
                {districts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filters.statut || ''}
                onChange={(e) => handleFilterChange('statut', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous</option>
                <option value="suspect">🟡 Suspect</option>
                <option value="probable">🟠 Probable</option>
                <option value="confirme">🔴 Confirmé</option>
                <option value="gueri">🟢 Guéri</option>
                <option value="decede">⚫ Décédé</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center mb-3">
              <Calendar size={18} className="text-gray-600 mr-2" />
              <label className="text-sm font-medium text-gray-700">
                Période d'apparition des symptômes
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Du</label>
                <input
                  type="date"
                  value={filters.date_symptomes_debut || ''}
                  onChange={(e) => handleFilterChange('date_symptomes_debut', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Au</label>
                <input
                  type="date"
                  value={filters.date_symptomes_fin || ''}
                  onChange={(e) => handleFilterChange('date_symptomes_fin', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleResetFilters}>
              <X size={18} className="mr-2" />
              Réinitialiser tous les filtres
            </Button>
          </div>
        </div>
      )}

      {/* TABLEAU DES CAS */}
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">N° Cas</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Maladie</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">District</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Âge/Sexe</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date sympt.</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 text-sm">
                  Aucun cas trouvé
                </td>
              </tr>
            )}
            {filteredCas.map((c: Cas) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{c.numero_cas}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{c.maladie?.nom || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{c.district?.nom || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {c.age} {c.sexe ? `/ ${c.sexe.charAt(0).toUpperCase() + c.sexe.slice(1).toLowerCase()}` : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {c.date_symptomes ? new Date(c.date_symptomes).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {c.statut === 'suspect' && <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Suspect</span>}
                  {c.statut === 'probable' && <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs">Probable</span>}
                  {c.statut === 'confirme' && <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Confirmé</span>}
                  {c.statut === 'gueri' && <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Guéri</span>}
                  {c.statut === 'decede' && <span className="px-2 py-1 rounded-full bg-gray-400 text-white text-xs">Décédé</span>}
                </td>
                <td className="px-6 py-4 flex gap-1">
                  <button
                    onClick={() => handleView(c.id)}
                    title="Voir"
                    className="text-gray-700 hover:text-blue-700 p-1 rounded transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(c.id)}
                    title="Modifier"
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    title="Supprimer"
                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 text-right text-sm text-gray-500 border-t bg-gray-50 rounded-b-lg">
          {filteredCas.length} cas affiché{filteredCas.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* ✅ POP-UP DE CONFIRMATION SIMPLE */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce cas ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CasListPage
