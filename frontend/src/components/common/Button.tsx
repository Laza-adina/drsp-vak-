/**
 * 📄 Fichier: src/components/common/Button.tsx
 * 📝 Description: Composant bouton réutilisable
 * 🎯 Usage: Boutons stylisés avec variants et états de chargement
 */

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
  fullWidth?: boolean
}

// ========================================
// 🔘 COMPOSANT BUTTON
// ========================================

/**
 * Bouton réutilisable avec différents variants et tailles
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Enregistrer
 * </Button>
 * 
 * <Button variant="danger" loading={isLoading}>
 *   Supprimer
 * </Button>
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  fullWidth = false,
  className,
  ...props
}) => {
  // ========================================
  // 🎨 STYLES DE BASE
  // ========================================
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  // ========================================
  // 🎨 VARIANTS
  // ========================================
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 active:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400',
    success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 active:bg-success-700',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 active:bg-danger-700',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100',
  }

  // ========================================
  // 📏 TAILLES
  // ========================================
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // ========================================
  // 📐 LARGEUR
  // ========================================
  const widthClass = fullWidth ? 'w-full' : ''

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        widthClass,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Icône de chargement */}
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      
      {/* Contenu du bouton */}
      {children}
    </button>
  )
}

export default Button
