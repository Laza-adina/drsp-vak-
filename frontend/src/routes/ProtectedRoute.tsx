/**
 * 📄 Fichier: src/routes/ProtectedRoute.tsx
 * 📝 Description: Route protégée nécessitant une authentification
 * 🎯 Usage: Wrapper pour protéger les routes privées
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// ========================================
// 🔐 COMPOSANT PROTECTED ROUTE
// ========================================

/**
 * Route protégée qui vérifie l'authentification
 * Redirige vers /login si l'utilisateur n'est pas connecté
 * 
 * @example
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore()

  // Si non authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si authentifié, afficher les routes enfants
  return <Outlet />
}

export default ProtectedRoute
