/**
 * 📄 Fichier: src/components/common/Select.tsx
 * 📝 Description: Composant select réutilisable
 * 🎯 Usage: Listes déroulantes avec label et gestion d'erreurs
 */

import React, { forwardRef } from 'react'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
}

// ========================================
// 📋 COMPOSANT SELECT
// ========================================

/**
 * Select réutilisable avec label et gestion d'erreurs
 * Compatible avec react-hook-form via forwardRef
 * 
 * @example
 * <Select
 *   label="Maladie"
 *   placeholder="Sélectionner une maladie"
 *   options={maladies.map(m => ({ value: m.id, label: m.nom }))}
 *   error={errors.maladie_id?.message}
 *   {...register('maladie_id')}
 * />
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, required, className, ...props }, ref) => {
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
            📋 SELECT
            ======================================== */}
        <select
          ref={ref}
          className={cn(
            'input',
            error && 'input-error border-danger-500 focus:ring-danger-500',
            className
          )}
          {...props}
        >
          {/* Option par défaut (placeholder) */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {/* Options */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* ========================================
            ⚠️ MESSAGE D'ERREUR
            ======================================== */}
        {error && (
          <p className="mt-1 text-sm text-danger-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
