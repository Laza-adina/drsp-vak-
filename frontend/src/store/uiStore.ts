/**
 * 📄 Fichier: src/store/uiStore.ts
 * 📝 Description: Store Zustand pour l'état de l'interface utilisateur
 * 🎯 Usage: Gestion de l'UI (sidebar, theme, modales, loading global)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ========================================
// 🎨 INTERFACE DU STORE UI
// ========================================

interface UIState {
  // État de la sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean

  // Thème
  theme: 'light' | 'dark'

  // Loading global
  isLoading: boolean
  loadingMessage: string

  // Modales
  modalOpen: boolean
  modalContent: React.ReactNode | null

  // Actions
  toggleSidebar: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (isLoading: boolean, message?: string) => void
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
}

// ========================================
// 🏪 CRÉATION DU STORE UI
// ========================================

/**
 * Store de l'interface utilisateur
 * Gère l'état de la sidebar, du thème, des modales et du loading global
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // ========================================
      // 📊 ÉTAT INITIAL
      // ========================================
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'light',
      isLoading: false,
      loadingMessage: '',
      modalOpen: false,
      modalContent: null,

      // ========================================
      // 📂 ACTIONS SIDEBAR
      // ========================================
      /**
       * Bascule l'ouverture/fermeture de la sidebar (mobile)
       */
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      /**
       * Réduit la sidebar (desktop)
       */
      collapseSidebar: () => {
        set({ sidebarCollapsed: true })
      },

      /**
       * Agrandit la sidebar (desktop)
       */
      expandSidebar: () => {
        set({ sidebarCollapsed: false })
      },

      // ========================================
      // 🎨 ACTIONS THÈME
      // ========================================
      /**
       * Change le thème de l'application
       * @param theme - 'light' ou 'dark'
       */
      setTheme: (theme) => {
        set({ theme })
        // Appliquer la classe au document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      // ========================================
      // ⏳ ACTIONS LOADING
      // ========================================
      /**
       * Active/désactive le loading global
       * @param isLoading - État du loading
       * @param message - Message à afficher (optionnel)
       */
      setLoading: (isLoading, message = '') => {
        set({ isLoading, loadingMessage: message })
      },

      // ========================================
      // 🪟 ACTIONS MODALE
      // ========================================
      /**
       * Ouvre une modale avec un contenu personnalisé
       * @param content - Contenu React à afficher
       */
      openModal: (content) => {
        set({ modalOpen: true, modalContent: content })
      },

      /**
       * Ferme la modale
       */
      closeModal: () => {
        set({ modalOpen: false, modalContent: null })
      },
    }),
    {
      name: 'ui-storage',
      // Ne persister que certaines propriétés
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
)
