/**
 * 📄 Fichier: src/components/common/Modal.tsx
 * 📝 Description: Composant modal réutilisable
 * 🎯 Usage: Fenêtres modales pour formulaires, confirmations, etc.
 */

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
}

// ========================================
// 🪟 COMPOSANT MODAL
// ========================================

/**
 * Modal réutilisable avec backdrop et animations
 * 
 * @example
 * const [isOpen, setIsOpen] = useState(false)
 * 
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Ajouter un cas"
 *   size="lg"
 * >
 *   <CasForm onSubmit={handleSubmit} />
 * </Modal>
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
}) => {
  // ========================================
  // 🔒 BLOQUER LE SCROLL DU BODY
  // ========================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ========================================
  // ⌨️ FERMETURE AU CLAVIER (ESC)
  // ========================================
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // ========================================
  // 📏 TAILLES
  // ========================================
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  // Si la modal n'est pas ouverte, ne rien afficher
  if (!isOpen) return null

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* ========================================
          🌑 BACKDROP (fond sombre)
          ======================================== */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* ========================================
          🪟 MODAL CONTENT
          ======================================== */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full bg-white rounded-lg shadow-xl transform transition-all',
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ========================================
              📋 HEADER
              ======================================== */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}

          {/* ========================================
              📄 BODY
              ======================================== */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
