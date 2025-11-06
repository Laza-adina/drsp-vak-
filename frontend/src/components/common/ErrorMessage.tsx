/**
 * 📄 Fichier: src/components/common/ErrorMessage.tsx
 * 📝 Description: Composant d'affichage d'erreur
 * 🎯 Usage: Afficher les messages d'erreur de manière cohérente
 */

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

// ========================================
// 🎨 INTERFACE
// ========================================

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
  fullPage?: boolean
}

// ========================================
// ❌ COMPOSANT ERROR MESSAGE
// ========================================

/**
 * Affiche un message d'erreur avec option de réessayer
 * 
 * @example
 * <ErrorMessage
 *   message="Erreur lors du chargement des données"
 *   onRetry={() => refetch()}
 * />
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Une erreur est survenue',
  onRetry,
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Icône d'erreur */}
      <div className="rounded-full bg-danger-100 p-3 mb-4">
        <AlertCircle className="w-8 h-8 text-danger-600" />
      </div>

      {/* Message d'erreur */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Erreur
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {message}
      </p>

      {/* Bouton réessayer */}
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          <RefreshCw size={16} className="mr-2" />
          Réessayer
        </Button>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {content}
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      {content}
    </div>
  )
}

export default ErrorMessage
