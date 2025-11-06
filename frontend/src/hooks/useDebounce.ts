/**
 * 📄 Fichier: src/hooks/useDebounce.ts
 * 📝 Description: Hook pour debouncer une valeur
 * 🎯 Usage: Éviter les appels API trop fréquents lors de la saisie utilisateur
 */

import { useState, useEffect } from 'react'

// ========================================
// ⏱️ HOOK DEBOUNCE
// ========================================

/**
 * Hook qui retarde la mise à jour d'une valeur
 * Utile pour les champs de recherche en temps réel
 * 
 * @param value - Valeur à debouncer
 * @param delay - Délai en millisecondes (défaut: 500ms)
 * @returns Valeur debouncée
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 * 
 * useEffect(() => {
 *   // Cet effet ne se déclenche que 500ms après la fin de la saisie
 *   if (debouncedSearchTerm) {
 *     searchAPI(debouncedSearchTerm)
 *   }
 * }, [debouncedSearchTerm])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Créer un timer qui met à jour la valeur après le délai
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Nettoyer le timer si la valeur change avant la fin du délai
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
