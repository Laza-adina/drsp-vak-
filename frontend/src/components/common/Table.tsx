/**
 * 📄 Fichier: src/components/common/Table.tsx
 * 📝 Description: Composant tableau réutilisable
 * 🎯 Usage: Affichage de listes de données en tableau
 */

import React from 'react'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
}

// ========================================
// 📊 COMPOSANT TABLE
// ========================================

/**
 * Tableau réutilisable avec colonnes configurables
 * 
 * @example
 * <Table
 *   data={cas}
 *   columns={[
 *     { key: 'id', header: 'ID', render: (item) => `#${item.id}` },
 *     { key: 'patient_nom', header: 'Patient' },
 *     { key: 'maladie_nom', header: 'Maladie' },
 *   ]}
 *   keyExtractor={(item) => item.id}
 *   onRowClick={(item) => navigate(`/cas/${item.id}`)}
 * />
 */
function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  loading = false,
  emptyMessage = 'Aucune donnée disponible',
}: TableProps<T>) {
  // ========================================
  // ⏳ ÉTAT DE CHARGEMENT
  // ========================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner w-8 h-8" />
        <span className="ml-3 text-gray-600">Chargement...</span>
      </div>
    )
  }

  // ========================================
  // 📭 ÉTAT VIDE
  // ========================================
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    )
  }

  // ========================================
  // 🎨 RENDU DU TABLEAU
  // ========================================
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* ========================================
            📋 EN-TÊTE
            ======================================== */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* ========================================
            📄 CORPS
            ======================================== */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                onRowClick && 'cursor-pointer hover:bg-gray-50 transition-colors'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {/* Utiliser le render personnalisé ou la valeur brute */}
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
