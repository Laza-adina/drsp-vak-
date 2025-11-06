/**
 * 📄 Fichier: src/main.tsx
 * 📝 Description: Point d'entrée de l'application React
 * 🎯 Usage: Initialisation de l'app avec tous les providers
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// ========================================
// ⚙️ CONFIGURATION REACT QUERY
// ========================================

/**
 * Configuration du client React Query
 * Gère le cache des requêtes API et les états de chargement
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Ne pas refetch au focus de la fenêtre
      retry: 1, // Réessayer 1 fois en cas d'erreur
      staleTime: 5 * 60 * 1000, // Données considérées fraîches pendant 5min
    },
  },
})

// ========================================
// 🚀 RENDU DE L'APPLICATION
// ========================================

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Router pour la navigation */}
    <BrowserRouter>
      {/* Provider React Query pour les requêtes API */}
      <QueryClientProvider client={queryClient}>
        {/* Application principale */}
        <App />
        
        {/* Toaster pour les notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1F4E78',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
