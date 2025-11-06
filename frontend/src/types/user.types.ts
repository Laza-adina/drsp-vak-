/**
 * 📄 Fichier: src/types/user.types.ts
 * 📝 Description: Types complémentaires pour les utilisateurs
 * 🎯 Usage: Profils, préférences, historique
 */

// ========================================
// 👤 TYPES UTILISATEUR COMPLÉMENTAIRES
// ========================================

/**
 * Profil utilisateur complet
 */
export interface UserProfile {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
  telephone?: string
  photo_url?: string
  district_affecte_id?: number
  district_affecte_nom?: string
  date_creation: string
  derniere_connexion?: string
  actif: boolean
}

/**
 * Préférences utilisateur
 */
export interface UserPreferences {
  theme: 'light' | 'dark'
  langue: 'fr' | 'mg'
  notifications_email: boolean
  notifications_push: boolean
  vue_par_defaut: string // Page d'accueil préférée
}

/**
 * Historique d'activité
 */
export interface UserActivity {
  id: number
  utilisateur_id: number
  action: string
  entite_type: string // 'cas', 'alerte', 'intervention'
  entite_id: number
  details?: string
  date_action: string
  ip_address?: string
}
