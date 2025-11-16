// /frontend/src/components/common/DistrictSelect.tsx

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { referentielsService } from '@/api/services/referentiels.service'

interface DistrictSelectProps {
  value?: number  // ✅ Changer de string à number
  onChange?: (value: number) => void  // ✅ Changer aussi
  disabled?: boolean
  required?: boolean
  error?: string
  name?: string
}

export const DistrictSelect: React.FC<DistrictSelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  name = 'district_id'
}) => {
  // ✅ Charger les districts depuis le backend
  const { data: districts = [], isLoading } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        District
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={(e) => onChange?.(Number(e.target.value))}  // ✅ Convertir en number
        disabled={disabled || isLoading}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        <option value="">
          {isLoading ? 'Chargement...' : 'Sélectionner un district'}
        </option>
        {districts.map((district) => (
          <option key={district.id} value={district.id}>  {/* ✅ Utiliser l'ID */}
            {district.nom}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default DistrictSelect
