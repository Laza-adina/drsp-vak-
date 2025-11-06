/**
 * 📄 Fichier: src/types/auth.types.ts
 * 📝 Description: Types liés à l'authentification et aux utilisateurs
 * 🎯 Usage: Typage des données utilisateur, login, permissions
 */

// ========================================
// 👤 ENUM & TYPES UTILISATEUR
// ========================================

/**
 * Enum des rôles (correspond EXACTEMENT aux valeurs backend)
 */
export enum UserRole {
  Administrateur = "administrateur",
  Epidemiologiste = "epidemiologiste",
  AgentSaisie = "agent_saisie",
  Lecteur = "lecteur"
}

/**
 * Labels pour affichage lisible des rôles
 */
export const UserRoleLabels: Record<string, string> = {
  "administrateur": "Administrateur",
  "epidemiologiste": "Épidémiologiste",
  "agent_saisie": "Agent de saisie",
  "lecteur": "Lecteur"
}

/**
 * Type string union pour les rôles
 */
export type UserRoleString = "administrateur" | "epidemiologiste" | "agent_saisie" | "lecteur"

/**
 * Structure d'un utilisateur
 */
export interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: string  // Utilise les valeurs de l'enum backend
  actif?: boolean
  is_active?: boolean  // Alias pour compatibilité backend
  date_creation?: string
  created_at?: string  // Alias pour compatibilité backend
  derniere_connexion?: string
  last_login?: string  // Alias pour compatibilité backend
  avatar_url?: string
}

/**
 * Données pour créer un utilisateur
 */
export interface CreateUserData {
  nom: string
  prenom: string
  email: string
  password: string
  role: string
  actif?: boolean
  district_id?: number
  centre_sante_id?: number
}

/**
 * Données pour mettre à jour un utilisateur
 */
export interface UpdateUserData {
  nom?: string
  prenom?: string
  email?: string
  password?: string
  role?: string
  actif?: boolean
  is_active?: boolean
  district_id?: number
  centre_sante_id?: number
}

// ========================================
// 🔐 TYPES AUTHENTIFICATION
// ========================================

/**
 * Données de connexion
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Réponse du serveur après connexion
 */
export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

/**
 * Données d'inscription
 */
export interface RegisterData {
  nom: string
  prenom: string
  email: string
  password: string
  role?: string  // Optionnel, défaut: "lecteur"
}

// ========================================
// 🔑 TYPES PERMISSIONS
// ========================================

/**
 * Actions possibles dans le système
 */
export type Permission =
  | 'cas:view'
  | 'cas:create'
  | 'cas:edit'
  | 'cas:delete'
  | 'alertes:view'
  | 'alertes:create'
  | 'alertes:manage'
  | 'interventions:view'
  | 'interventions:create'
  | 'interventions:manage'
  | 'statistiques:view'
  | 'rapports:view'
  | 'rapports:export'
  | 'admin:users'
  | 'admin:settings'

/**
 * Matrice de permissions par rôle
 * ✅ Utilise les valeurs exactes du backend (minuscules)
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  "administrateur": [
    'cas:view',
    'cas:create',
    'cas:edit',
    'cas:delete',
    'alertes:view',
    'alertes:create',
    'alertes:manage',
    'interventions:view',
    'interventions:create',
    'interventions:manage',
    'statistiques:view',
    'rapports:view',
    'rapports:export',
    'admin:users',
    'admin:settings',
  ],
  "epidemiologiste": [
    'cas:view',
    'cas:create',
    'cas:edit',
    'cas:delete',
    'alertes:view',
    'alertes:create',
    'alertes:manage',
    'interventions:view',
    'interventions:create',
    'interventions:manage',
    'statistiques:view',
    'rapports:view',
    'rapports:export',
  ],
  "agent_saisie": [
    'cas:view',
    'cas:create',
    'cas:edit',
    'alertes:view',
    'interventions:view',
  ],
  "lecteur": [
    'cas:view',
    'statistiques:view',
    'rapports:view',
  ],
}

/**
 * Vérifie si un utilisateur a une permission donnée
 */
export function hasPermission(userRole: string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission)
}

/**
 * Obtient toutes les permissions d'un rôle
 */
export function getRolePermissions(userRole: string): Permission[] {
  return ROLE_PERMISSIONS[userRole] || []
}

/**
 * Vérifie si un rôle est admin
 */
export function isAdmin(userRole: string): boolean {
  return userRole === UserRole.Administrateur
}

/**
 * Obtient le label lisible d'un rôle
 */
export function getRoleLabel(userRole: string): string {
  return UserRoleLabels[userRole] || userRole
}
