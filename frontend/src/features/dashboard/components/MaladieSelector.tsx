/**
 * 📄 Fichier: src/features/dashboard/components/MaladieSelector.tsx
 * 📝 Description: Sélecteur de maladie avec onglets
 */

import React from 'react'
import type { Maladie } from '@/types/cas.types'

interface MaladieSelectorProps {
  maladies: Maladie[]
  selectedId: number | null
  onChange: (id: number | null) => void
}

const MaladieSelector: React.FC<MaladieSelectorProps> = ({
  maladies,
  selectedId,
  onChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Option "Toutes les maladies" */}
        <button
          onClick={() => onChange(null)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedId === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
           Toutes les maladies
        </button>

        {/* Options par maladie */}
        {maladies.map((maladie) => (
          <button
            key={maladie.id}
            onClick={() => onChange(maladie.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedId === maladie.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
             {maladie.nom}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MaladieSelector
