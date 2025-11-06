/**
 * 📄 Fichier: src/components/common/Pagination.tsx
 * 📝 Description: Composant de pagination
 * 🎯 Usage: Navigation entre les pages de données
 */

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
}

// ========================================
// 📄 COMPOSANT PAGINATION
// ========================================

/**
 * Pagination pour naviguer entre les pages
 * 
 * @example
 * <Pagination
 *   currentPage={page}
 *   totalPages={10}
 *   onPageChange={setPage}
 *   totalItems={200}
 * />
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}) => {
  // ========================================
  // 🔢 GÉNÉRATION DES NUMÉROS DE PAGE
  // ========================================
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 // Nombre de pages à afficher

    if (totalPages <= showPages) {
      // Afficher toutes les pages si moins de 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Afficher avec ellipses si plus de 5 pages
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      {/* ========================================
          📊 INFORMATION
          ======================================== */}
      {totalItems && pageSize && (
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Affichage de{' '}
            <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
            {' à '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>
            {' sur '}
            <span className="font-medium">{totalItems}</span> résultats
          </p>
        </div>
      )}

      {/* ========================================
          🔢 NAVIGATION
          ======================================== */}
      <div className="flex items-center space-x-2">
        {/* Bouton Précédent */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-md',
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Numéros de page */}
        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium',
                currentPage === page
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-gray-500">
              {page}
            </span>
          )
        )}

        {/* Bouton Suivant */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-md',
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
