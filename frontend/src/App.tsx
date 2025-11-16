/**
 * 📄 Fichier: src/App.tsx
 * 📝 Description: Composant principal de l'application
 * 🎯 Usage: Configuration des routes et structure globale
 */

import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Loading from '@/components/common/Loading'

// ========================================
// 📄 IMPORTS DES PAGES
// ========================================
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import CasListPage from '@/features/cas/pages/CasListPage'
import CasFormPage from '@/features/cas/pages/CasFormPage'
import CasDetail from '@/features/cas/components/CasDetail'
import CartographiePage from '@/features/cartographie/pages/CartographiePage'
import AlertesPage from '@/features/alertes/pages/AlertesPage'
import InterventionsPage from '@/features/interventions/pages/InterventionsPage'
import StatistiquesPage from '@/features/statistiques/pages/StatistiquesPage'
import RapportsPage from '@/features/rapports/pages/RapportsPage'
import AdminPage from '@/features/admin/pages/AdminPage'

// ========================================
// 📂 IMPORTS LAYOUT & ROUTES
// ========================================
import Layout from '@/components/layout/Layout'
import { ProtectedRoute } from '@/routes'

// ========================================
// 🚀 COMPOSANT APP
// ========================================

/**
 * Composant principal de l'application
 * Gère l'initialisation et le routing
 */
function App() {
  const { isAuthenticated, isInitialized } = useAuthStore()
  const [isReady, setIsReady] = useState(false)

  // ========================================
  // 🔄 INITIALISATION
  // ========================================
  useEffect(() => {
    // Attendre que le store soit initialisé
    if (isInitialized) {
      setIsReady(true)
    }
  }, [isInitialized])

  // ========================================
  // ⏳ ÉCRAN DE CHARGEMENT
  // ========================================
  // Afficher un loader pendant l'initialisation du store
  if (!isReady) {
    return <Loading fullScreen message="Initialisation..." />
  }

  // ========================================
  // 🗺️ CONFIGURATION DES ROUTES
  // ========================================
  return (
    <Routes>
      {/* ==================== ROUTES PUBLIQUES ==================== */}
      
      {/* Page de connexion */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
      />

      {/* Page d'inscription */}
      <Route
        path="/register"
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
      />

      {/* ==================== ROUTES PROTÉGÉES ==================== */}
      
      {/* Toutes les routes ci-dessous nécessitent une authentification */}
      <Route element={<ProtectedRoute />}>
        {/* Layout commun avec sidebar et navbar */}
        <Route element={<Layout />}>
          
          {/* 📊 DASHBOARD */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* 🏥 GESTION DES CAS */}
          <Route path="/cas" element={<CasListPage />} />
          <Route path="/cas/nouveau" element={<CasFormPage />} />
          <Route path="/cas/:id" element={<CasDetail />} />
          <Route path="/cas/:id/modifier" element={<CasFormPage />} />

          {/* 🗺️ CARTOGRAPHIE */}
          <Route path="/cartographie" element={<CartographiePage />} />

          {/* 🚨 ALERTES */}
          <Route path="/alertes" element={<AlertesPage />} />

          {/* 💼 INTERVENTIONS */}
          <Route path="/interventions" element={<InterventionsPage />} />

          {/* 📈 STATISTIQUES */}
          <Route path="/statistiques" element={<StatistiquesPage />} />

          {/* 📄 RAPPORTS */}
          <Route path="/rapports" element={<RapportsPage />} />

          {/* ==================== ROUTES ADMIN ==================== */}
          {/* ✅ SANS PROTECTION - Pour tester/développer */}
          <Route path="/admin" element={<AdminPage />} />

          {/* ⚠️ TODO: Ajouter la protection plus tard */}
          {/* <Route element={<RoleBasedRoute allowedRoles={['administrateur']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route> */}

        </Route>
      </Route>

      {/* ==================== REDIRECTIONS ==================== */}
      
      {/* Rediriger la racine vers le dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Rediriger toutes les routes inconnues vers le dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
