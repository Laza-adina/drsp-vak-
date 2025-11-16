/**
 * 📄 Fichier: src/components/common/FormSelects.tsx
 * 📝 Description: Tous les composants Select pour formulaires
 * 🎯 Usage: Importer les selects dont vous avez besoin
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { referentielsService } from '@/api/services/referentiels.service'

// ========================================
// 🦠 SELECT MALADIES
// ========================================

interface MaladieSelectProps {
  value?: number
  onChange?: (value: number) => void
  disabled?: boolean
  required?: boolean
  error?: string
  name?: string
}

export const MaladieSelect: React.FC<MaladieSelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  name = 'maladie_id'
}) => {
  const { data: maladies = [], isLoading } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Maladie
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={(e) => onChange?.(Number(e.target.value))}
        disabled={disabled || isLoading}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        <option value="">
          {isLoading ? 'Chargement...' : 'Sélectionner une maladie'}
        </option>
        {maladies.map((maladie) => (
          <option key={maladie.id} value={maladie.id}>
            {maladie.nom}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

// ========================================
// 🏥 SELECT CENTRES DE SANTÉ
// ========================================

interface CentreSanteSelectProps {
  value?: number
  onChange?: (value: number) => void
  districtId?: number  // ✅ CHANGÉ de string à number
  disabled?: boolean
  required?: boolean
  error?: string
  name?: string
}

export const CentreSanteSelect: React.FC<CentreSanteSelectProps> = ({
  value,
  onChange,
  districtId,
  disabled = false,
  required = false,
  error,
  name = 'centre_sante_id'
}) => {
  const { data: centres = [], isLoading } = useQuery({
    queryKey: ['centres-sante', districtId],
    queryFn: () => referentielsService.getCentresSante(districtId),  // ✅ districtId est un number
    enabled: !!districtId,
  })

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Centre de Santé
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={(e) => onChange?.(Number(e.target.value))}
        disabled={disabled || isLoading || !districtId}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        <option value="">
          {!districtId
            ? 'Sélectionner un district d\'abord'
            : isLoading
            ? 'Chargement...'
            : 'Sélectionner un centre'}
        </option>
        {centres.map((centre) => (
          <option key={centre.id} value={centre.id}>
            {centre.nom}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

// ========================================
// 📊 SELECT STATUT CAS
// ========================================

interface StatutSelectProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  error?: string
  name?: string
}

export const StatutSelect: React.FC<StatutSelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  name = 'statut'
}) => {
  const statuts = referentielsService.getStatutsCas()
  
  const statutLabels: Record<string, string> = {
    'suspect': '🟡 Suspect',
    'probable': '🟠 Probable',
    'confirme': '🔴 Confirmé',
    'gueri': '🟢 Guéri',
    'decede': '⚫ Décédé'
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Statut
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        <option value="">Sélectionner un statut</option>
        {statuts.map((statut) => (
          <option key={statut} value={statut}>
            {statutLabels[statut] || statut}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

// ========================================
// 👤 SELECT SEXE
// ========================================

interface SexeSelectProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  name?: string
}

export const SexeSelect: React.FC<SexeSelectProps> = ({
  value,
  onChange,
  disabled = false,
  error,
  name = 'sexe'
}) => {
  const options = referentielsService.getOptionsSexe()

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sexe
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        <option value="">Sélectionner un sexe</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}
