/**
 * 📄 Fichier: src/store/authStore.ts
 * 📝 Description: Store Zustand pour l'authentification
 * 🎯 Usage: Gestion de l'état d'authentification (user, token, login, logout)
 */

import { create } from 'zustand'
import type { User } from '@/types/auth.types'

// ========================================
// 🔐 INTERFACE DU STORE AUTH
// ========================================

interface AuthState {
  // État
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean

  // Actions
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
  initialize: () => void
}

// ========================================
// 🏪 CRÉATION DU STORE AUTH
// ========================================

export const useAuthStore = create<AuthState>((set) => ({
  // ========================================
  // 📊 ÉTAT INITIAL
  // ========================================
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,

  // ========================================
  // 🔄 INITIALISATION AU CHARGEMENT
  // ========================================
  initialize: () => {
    try {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      // ✅ CORRECTION : Vérifier que userStr n'est pas "undefined" (string)
      if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
        const user = JSON.parse(userStr)
        set({ user, token, isAuthenticated: true, isInitialized: true })
      } else {
        // Nettoyer les données invalides
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true })
      }
    } catch (error) {
      console.error('Erreur parsing user localStorage:', error)
      // Nettoyer les données corrompues
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({ user: null, token: null, isAuthenticated: false, isInitialized: true })
    }
  },

  // ========================================
  // 🔑 CONNEXION
  // ========================================
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  // ========================================
  // 🚪 DÉCONNEXION
  // ========================================
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  // ========================================
  // ✏️ MISE À JOUR UTILISATEUR
  // ========================================
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))

// ========================================
// 🚀 INITIALISATION AUTOMATIQUE
// ========================================
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize()
}
