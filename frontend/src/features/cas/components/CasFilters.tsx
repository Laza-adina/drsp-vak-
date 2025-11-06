/**
 * 📄 Fichier: src/features/cas/components/CasFilters.tsx
 * 📝 Description: Filtres pour la liste des cas
 * 🎯 Usage: Filtrer par maladie, district, statut, dates
 */

import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { referentielsService } from '@/api/services/users.service'
import Select from '@/components/common/Select'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { Search, X } from 'lucide-react'
import type { CasFilters as CasFiltersType } from '@/types/cas.types'

// ========================================
// 🎨 INTERFACE
// ========================================

interface CasFiltersProps {
  filters: CasFiltersType
  onFilterChange: (filters: CasFiltersType) => void
}

// ========================================
// 🔍 COMPOSANT CAS FILTERS
// ========================================

/**
 * Composant de filtrage pour les cas
 * Filtres : maladie, district, statut, dates, recherche
 */
const CasFilters: React.FC<CasFiltersProps> = ({ filters, onFilterChange }) => {
  // État local pour le formulaire
  const [localFilters, setLocalFilters] = useState<CasFiltersType>(filters)

  // ========================================
  // 📡 CHARGEMENT DES RÉFÉRENTIELS
  // ========================================
  const { data: maladies } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // ========================================
  // 🔄 SYNCHRONISATION
  // ========================================
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // ========================================
  // 🎯 HANDLERS
  // ========================================
  const handleChange = (key: keyof CasFiltersType, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onFilterChange(localFilters)
  }

  const handleReset = () => {
    const emptyFilters: CasFiltersType = {}
    setLocalFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>

      {/* ========================================
          📋 LIGNE 1 : Maladie, District, Statut
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Maladie */}
        <Select
          label="Maladie"
          placeholder="Toutes les maladies"
          value={localFilters.maladie_id || ''}
          onChange={(e) => handleChange('maladie_id', e.target.value ? Number(e.target.value) : undefined)}
          options={
            maladies?.map((m: any) => ({
              value: m.id,
              label: m.nom,
            })) || []
          }
        />

        {/* District */}
        <Select
          label="District"
          placeholder="Tous les districts"
          value={localFilters.district_id || ''}
          onChange={(e) => handleChange('district_id', e.target.value ? Number(e.target.value) : undefined)}
          options={
            districts?.map((d: any) => ({
              value: d.id,
              label: d.nom,
            })) || []
          }
        />

        {/* Statut */}
        <Select
          label="Statut"
          placeholder="Tous les statuts"
          value={localFilters.statut || ''}
          onChange={(e) => handleChange('statut', e.target.value || undefined)}
          options={[
            { value: 'Suspect', label: 'Suspect' },
            { value: 'Confirmé', label: 'Confirmé' },
            { value: 'Écarté', label: 'Écarté' },
            { value: 'En cours', label: 'En cours' },
          ]}
        />
      </div>

      {/* ========================================
          📋 LIGNE 2 : Dates
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date début */}
        <Input
          label="Date de début"
          type="date"
          value={localFilters.date_debut || ''}
          onChange={(e) => handleChange('date_debut', e.target.value || undefined)}
        />

        {/* Date fin */}
        <Input
          label="Date de fin"
          type="date"
          value={localFilters.date_fin || ''}
          onChange={(e) => handleChange('date_fin', e.target.value || undefined)}
        />
      </div>

      {/* ========================================
          🔍 RECHERCHE
          ======================================== */}
      <div>
        <Input
          label="Recherche"
          type="text"
          placeholder="Rechercher par nom de patient..."
          value={localFilters.search || ''}
          onChange={(e) => handleChange('search', e.target.value || undefined)}
        />
      </div>

      {/* ========================================
          🔘 BOUTONS
          ======================================== */}
      <div className="flex items-center space-x-3">
        <Button
          variant="primary"
          onClick={handleApply}
        >
          <Search size={16} className="mr-2" />
          Appliquer
        </Button>

        <Button
          variant="secondary"
          onClick={handleReset}
        >
          <X size={16} className="mr-2" />
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}

export default CasFilters
