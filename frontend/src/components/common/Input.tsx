/**
 * 📄 Fichier: src/components/common/Input.tsx
 * 📝 Description: Composant input réutilisable
 * 🎯 Usage: Champs de formulaire avec label et gestion d'erreurs
 */

import React, { forwardRef } from 'react'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

// ========================================
// 📝 COMPOSANT INPUT
// ========================================

/**
 * Input réutilisable avec label et gestion d'erreurs
 * Compatible avec react-hook-form via forwardRef
 * 
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="email@exemple.com"
 *   error={errors.email?.message}
 *   {...register('email')}
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* ========================================
            🏷️ LABEL
            ======================================== */}
        {label && (
          <label className="label">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        {/* ========================================
            📝 INPUT
            ======================================== */}
        <input
          ref={ref}
          className={cn(
            'input',
            error && 'input-error border-danger-500 focus:ring-danger-500',
            className
          )}
          {...props}
        />

        {/* ========================================
            ⚠️ MESSAGE D'ERREUR
            ======================================== */}
        {error && (
          <p className="mt-1 text-sm text-danger-600">
            {error}
          </p>
        )}

        {/* ========================================
            💡 TEXTE D'AIDE
            ======================================== */}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
