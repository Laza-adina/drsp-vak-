/**
 * 📄 Fichier: src/routes/RoleBasedRoute.tsx
 * 📝 Description: Route protégée par rôle utilisateur
 * 🎯 Usage: Restreindre l'accès selon le rôle (ex: Admin uniquement)
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types/auth.types'

// ========================================
// 🎭 INTERFACE
// ========================================

interface RoleBasedRouteProps {
  allowedRoles: UserRole[]
}

// ========================================
// 🔐 COMPOSANT ROLE BASED ROUTE
// ========================================

/**
 * Route protégée par rôle utilisateur
 * Redirige vers /dashboard si l'utilisateur n'a pas le bon rôle
 * 
 * @param allowedRoles - Liste des rôles autorisés
 * 
 * @example
 * <Route element={<RoleBasedRoute allowedRoles={['Admin']} />}>
 *   <Route path="/admin" element={<AdminPage />} />
 * </Route>
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuthStore()

  // Vérifier si l'utilisateur a un rôle autorisé
  const hasAccess = user && allowedRoles.includes(user.role)

  // Si pas d'accès, rediriger vers le dashboard
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />
  }

  // Si accès autorisé, afficher les routes enfants
  return <Outlet />
}

export default RoleBasedRoute
