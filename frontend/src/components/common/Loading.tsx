/**
 * 📄 Fichier: src/components/common/Loading.tsx
 * 📝 Description: Composant de chargement
 * 🎯 Usage: Indicateur de chargement (spinner)
 */

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface LoadingProps {
  fullScreen?: boolean
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

// ========================================
// ⏳ COMPOSANT LOADING
// ========================================

/**
 * Composant de chargement avec spinner animé
 * 
 * @example
 * <Loading message="Chargement des données..." />
 * 
 * <Loading fullScreen message="Initialisation..." />
 */
const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  message,
  size = 'md',
}) => {
  // ========================================
  // 📏 TAILLES DU SPINNER
  // ========================================
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  const content = (
    <div className="flex flex-col items-center justify-center">
      {/* Spinner animé */}
      <Loader2 className={cn(sizes[size], 'text-primary-500 animate-spin')} />
      
      {/* Message optionnel */}
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  )

  // ========================================
  // 🖼️ PLEIN ÉCRAN OU INLINE
  // ========================================
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  )
}

export default Loading
