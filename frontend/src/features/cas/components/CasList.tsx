/**
 * 📄 Fichier: src/features/cas/components/CasList.tsx
 * 📝 Description: Tableau de liste des cas
 * 🎯 Usage: Afficher tous les cas avec actions
 */

import React from 'react'
import { Edit2, Trash2, Eye } from 'lucide-react'
import { CasStatutLabels } from '@/types/referentiels.types'
import Button from '@/components/common/Button'
import type { Cas } from '@/types/cas.types'

interface CasListProps {
  cas: Cas[]
  onView?: (id: number) => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

/**
 * Tableau de liste des cas
 * Affiche les informations principales avec actions
 */
const CasList: React.FC<CasListProps> = ({
  cas,
  onView,
  onEdit,
  onDelete
}) => {
  if (cas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun cas enregistré</p>
      </div>
    )
  }

  return (

    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Numéro
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Maladie
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Âge / Sexe
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              District
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Date Symptômes
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {cas.map((c) => (
            <tr key={c.id} className="border-b hover:bg-gray-50">
              {/* Numéro */}
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {c.numero_cas}
              </td>

              {/* Maladie */}
              <td className="px-6 py-4 text-sm text-gray-600">
                {c.maladie?.nom || 'N/A'}
              </td>

              {/* Âge et Sexe */}
              <td className="px-6 py-4 text-sm text-gray-600">
                {c.age && c.sexe
                  ? `${c.age} ans - ${c.sexe}`
                  : c.age
                  ? `${c.age} ans`
                  : c.sexe || 'N/A'}
              </td>

              {/* District */}
              <td className="px-6 py-4 text-sm text-gray-600">
                {c.district?.nom || 'N/A'}
              </td>

              {/* Date Symptômes */}
              <td className="px-6 py-4 text-sm text-gray-600">
                {c.date_symptomes}
              </td>

              {/* Statut */}
              <td className="px-6 py-4 text-sm">
                <span className="px-3 py-1 rounded-full text-white bg-blue-500">
                  {CasStatutLabels[c.statut] || c.statut}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-sm space-x-2">
                {onView && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onView(c.id)}
                  >
                    <Eye size={16} />
                  </Button>
                )}

                {onEdit && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(c.id)}
                  >
                    <Edit2 size={16} />
                  </Button>
                )}

                {onDelete && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(c.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CasList
