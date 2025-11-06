/**
 * 📄 Fichier: src/hooks/usePermissions.ts
 * 📝 Description: Hook pour vérifier les permissions utilisateur
 * 🎯 Usage: Contrôle d'accès aux fonctionnalités selon le rôle
 */

import { useAuthStore } from '@/store/authStore'
import { ROLE_PERMISSIONS } from '@/types/auth.types'
import type { Permission } from '@/types/auth.types'

// ========================================
// 🔐 HOOK PERMISSIONS
// ========================================

/**
 * Hook qui vérifie si l'utilisateur a une permission spécifique
 * 
 * @example
 * const { hasPermission, canEdit, canDelete } = usePermissions()
 * 
 * if (hasPermission('cas:edit')) {
 *   // Afficher le bouton modifier
 * }
 * 
 * if (canDelete) {
 *   // Afficher le bouton supprimer
 * }
 */
export function usePermissions() {
  const { user } = useAuthStore()

  // ========================================
  // ✅ VÉRIFICATION PERMISSION
  // ========================================
  /**
   * Vérifie si l'utilisateur a une permission donnée
   * @param permission - Permission à vérifier
   * @returns true si l'utilisateur a la permission
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || []
    return userPermissions.includes(permission)
  }

  // ========================================
  // 🎯 PERMISSIONS SPÉCIFIQUES (raccourcis)
  // ========================================
  
  // Permissions CAS
  const canViewCas = hasPermission('cas:view')
  const canCreateCas = hasPermission('cas:create')
  const canEditCas = hasPermission('cas:edit')
  const canDeleteCas = hasPermission('cas:delete')

  // Permissions ALERTES
  const canViewAlertes = hasPermission('alertes:view')
  const canCreateAlertes = hasPermission('alertes:create')
  const canManageAlertes = hasPermission('alertes:manage')

  // Permissions INTERVENTIONS
  const canViewInterventions = hasPermission('interventions:view')
  const canCreateInterventions = hasPermission('interventions:create')
  const canManageInterventions = hasPermission('interventions:manage')

  // Permissions STATISTIQUES
  const canViewStatistiques = hasPermission('statistiques:view')

  // Permissions RAPPORTS
  const canViewRapports = hasPermission('rapports:view')
  const canExportRapports = hasPermission('rapports:export')

  // Permissions ADMIN
  const canManageUsers = hasPermission('admin:users')
  const canManageSettings = hasPermission('admin:settings')

  // ========================================
  // 🎭 VÉRIFICATION RÔLE
  // ========================================
  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param role - Rôle à vérifier
   * @returns true si l'utilisateur a ce rôle
   */
  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const isAdmin = hasRole('Admin')
  const isEpidemiologue = hasRole('Épidémiologiste')
  const isAgentSaisie = hasRole('Agent de saisie')
  const isLecteur = hasRole('Lecteur')

  // ========================================
  // 📤 RETOUR DES FONCTIONS ET DONNÉES
  // ========================================
  return {
    // Fonction générique
    hasPermission,
    hasRole,

    // Rôles
    isAdmin,
    isEpidemiologue,
    isAgentSaisie,
    isLecteur,

    // Permissions CAS
    canViewCas,
    canCreateCas,
    canEditCas,
    canDeleteCas,

    // Permissions ALERTES
    canViewAlertes,
    canCreateAlertes,
    canManageAlertes,

    // Permissions INTERVENTIONS
    canViewInterventions,
    canCreateInterventions,
    canManageInterventions,

    // Permissions STATISTIQUES
    canViewStatistiques,

    // Permissions RAPPORTS
    canViewRapports,
    canExportRapports,

    // Permissions ADMIN
    canManageUsers,
    canManageSettings,
  }
}
