/**
 * 📄 Fichier: src/features/cas/components/CasList.tsx
 * 📝 Description: Liste des cas en tableau
 * 🎯 Usage: Afficher les cas avec actions (voir, modifier, supprimer)
 */

import React from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/formatters'
import { getStatusColor } from '@/utils/helpers'
import type { Cas } from '@/types/cas.types'

// ========================================
// 🎨 INTERFACE
// ========================================

interface CasListProps {
  cas: Cas[]
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete?: (id: number) => void
}

// ========================================
// 📋 COMPOSANT CAS LIST
// ========================================

/**
 * Tableau des cas avec actions
 */
const CasList: React.FC<CasListProps> = ({ cas, onView, onEdit, onDelete }) => {
  // ========================================
  // 📭 ÉTAT VIDE
  // ========================================
  if (cas.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun cas trouvé
      </div>
    )
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* ========================================
            📋 EN-TÊTE
            ======================================== */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Maladie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              District
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* ========================================
            📄 CORPS
            ======================================== */}
        <tbody className="bg-white divide-y divide-gray-200">
          {cas.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* ID */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{item.id}
              </td>

              {/* Patient */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.patient_nom}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.patient_age} ans • {item.patient_sexe === 'M' ? 'Masculin' : 'Féminin'}
                  </div>
                </div>
              </td>

              {/* Maladie */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.maladie_nom}
              </td>

              {/* District */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.district_nom}
              </td>

              {/* Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(item.date_debut_symptomes)}
              </td>

              {/* Statut */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`badge badge-${getStatusColor(item.statut)}`}>
                  {item.statut}
                </span>
                {item.cas_deces && (
                  <span className="ml-1 badge bg-gray-800 text-white">
                    Décès
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  {/* Voir */}
                  <button
                    onClick={() => onView(item.id)}
                    className="text-primary-600 hover:text-primary-900"
                    title="Voir les détails"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Modifier */}
                  <button
                    onClick={() => onEdit(item.id)}
                    className="text-warning-600 hover:text-warning-900"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>

                  {/* Supprimer */}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-danger-600 hover:text-danger-900"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CasList
