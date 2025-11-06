/**
 * 📄 Fichier: src/hooks/useLocalStorage.ts
 * 📝 Description: Hook pour gérer le localStorage de manière réactive
 * 🎯 Usage: Persister des données localement avec un état React
 */

import { useState } from 'react'

// ========================================
// 💾 HOOK LOCAL STORAGE
// ========================================

/**
 * Hook qui synchronise un état React avec le localStorage
 * Permet de persister des données entre les sessions
 * 
 * @param key - Clé de stockage dans le localStorage
 * @param initialValue - Valeur initiale si rien n'est stocké
 * @returns [valeur, setter] - Comme useState
 * 
 * @example
 * const [filters, setFilters] = useLocalStorage('cas-filters', {})
 * // Les filtres sont automatiquement sauvegardés dans localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // ========================================
  // 📊 ÉTAT INITIAL
  // ========================================
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Récupérer la valeur du localStorage
      const item = window.localStorage.getItem(key)
      
      // Parser la valeur ou retourner la valeur initiale
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Erreur lecture localStorage (${key}):`, error)
      return initialValue
    }
  })

  // ========================================
  // 💾 FONCTION DE SAUVEGARDE
  // ========================================
  /**
   * Fonction qui met à jour l'état ET le localStorage
   * @param value - Nouvelle valeur à stocker
   */
  const setValue = (value: T) => {
    try {
      // Sauvegarder l'état
      setStoredValue(value)
      
      // Sauvegarder dans le localStorage
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Erreur écriture localStorage (${key}):`, error)
    }
  }

  return [storedValue, setValue]
}
