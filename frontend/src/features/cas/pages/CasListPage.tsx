/**
 * 📄 Fichier: src/features/cas/pages/CasListPage.tsx
 * 📝 Description: Page de gestion des cas avec filtre par dates
 * 🎯 Usage: Liste avec filtres incluant les dates d'apparition des symptômes
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Filter, X, Search, Calendar } from 'lucide-react'
import { casService } from '@/api/services/cas.service'
import { referentielsService } from '@/api/services/users.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import CasList from '../components/CasList'
import toast from 'react-hot-toast'
import type { CasFilters as CasFiltersType } from '@/types/cas.types'

const CasListPage: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // États
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<CasFiltersType>({})
  const [searchTerm, setSearchTerm] = useState('')

  // ========================================
  // 📡 QUERIES
  // ========================================

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
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })

  // ========================================
  // 🎯 HANDLERS
  // ========================================

  const handleView = (id: number) => navigate(`/cas/${id}`)
  const handleEdit = (id: number) => navigate(`/cas/${id}/modifier`)
  const handleDelete = (id: number) => {
    if (window.confirm('Supprimer ce cas ?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFilterChange = (key: keyof CasFiltersType, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }))
  }

  const handleResetFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  // Filtrage local
  const filteredCas = cas.filter(c => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      c.numero_cas.toLowerCase().includes(search) ||
      c.maladie?.nom.toLowerCase().includes(search)
    )
  })

  // Compter les filtres actifs
  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length

  // ========================================
  // ⏳ ÉTATS SPÉCIAUX
  // ========================================

  if (isLoading) return <Loading message="Chargement..." />
  if (error) return <ErrorMessage message="Erreur" onRetry={refetch} />

  // ========================================
  // 🎨 RENDU
  // ========================================

  return (
    <div className="space-y-6">
      {/* EN-TÊTE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📋 Gestion des Cas
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredCas.length} cas enregistré{filteredCas.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} className="mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate('/cas/nouveau')}
          >
            <Plus size={20} className="mr-2" />
            Déclarer un cas
          </Button>
        </div>
      </div>

      {/* RECHERCHE & FILTRES */}
      <Card>
        {/* Barre de recherche */}
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
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Ligne 1 : Maladie, District, Statut */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Maladie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maladie
                </label>
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

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
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

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
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

            {/* ✅ LIGNE 2 : DATES D'APPARITION DES SYMPTÔMES */}
            <div>
              <div className="flex items-center mb-3">
                <Calendar size={18} className="text-gray-600 mr-2" />
                <label className="text-sm font-medium text-gray-700">
                  Période d'apparition des symptômes
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date de début */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Du
                  </label>
                  <input
                    type="date"
                    value={filters.date_symptomes_debut || ''}
                    onChange={(e) => handleFilterChange('date_symptomes_debut', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date de fin */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Au
                  </label>
                  <input
                    type="date"
                    value={filters.date_symptomes_fin || ''}
                    onChange={(e) => handleFilterChange('date_symptomes_fin', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Bouton Reset */}
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={handleResetFilters}
              >
                <X size={18} className="mr-2" />
                Réinitialiser tous les filtres
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* LISTE DES CAS */}
      <CasList
        cas={filteredCas}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default CasListPage
