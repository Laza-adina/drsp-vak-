/**
 * 📄 Fichier: src/api/endpoints.ts
 * 📝 Description: URLs centralisées de tous les endpoints API
 * 🎯 Usage: Import des URLs dans les services pour éviter la duplication
 */

// ========================================
// 🔐 ENDPOINTS AUTHENTIFICATION
// ========================================
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
}

// ========================================
// 🏥 ENDPOINTS CAS
// ========================================
export const CAS_ENDPOINTS = {
  LIST: '/cas',
  GET: (id: number) => `/cas/${id}`,
  CREATE: '/cas',
  UPDATE: (id: number) => `/cas/${id}`,
  DELETE: (id: number) => `/cas/${id}`,
  STATS: '/cas/statistiques',
  EXPORT: '/cas/export',
}

// ========================================
// 📊 ENDPOINTS DASHBOARD
// ========================================
export const DASHBOARD_ENDPOINTS = {
  STATS: '/dashboard/statistiques',
  EVOLUTION: '/dashboard/evolution',
  TOP_DISTRICTS: '/dashboard/top-districts',
  DISTRIBUTION_MALADIES: '/dashboard/distribution-maladies',
}

// ========================================
// 🗺️ ENDPOINTS CARTOGRAPHIE
// ========================================
export const CARTOGRAPHIE_ENDPOINTS = {
  MARKERS: '/cartographie/marqueurs',
  HEATMAP: '/cartographie/heatmap',
  CHOROPLETH: '/cartographie/choropleth',
  CLUSTERS: '/cartographie/clusters',
}

// ========================================
// 🚨 ENDPOINTS ALERTES
// ========================================
export const ALERTES_ENDPOINTS = {
  LIST: '/alertes',
  GET: (id: number) => `/alertes/${id}`,
  CREATE: '/alertes',
  UPDATE: (id: number) => `/alertes/${id}`,
  DELETE: (id: number) => `/alertes/${id}`,
  ACTIVES: '/alertes/actives',
}

// ========================================
// 💼 ENDPOINTS INTERVENTIONS
// ========================================
export const INTERVENTIONS_ENDPOINTS = {
  LIST: '/interventions',
  GET: (id: number) => `/interventions/${id}`,
  CREATE: '/interventions',
  UPDATE: (id: number) => `/interventions/${id}`,
  DELETE: (id: number) => `/interventions/${id}`,
  RAPPORT: (id: number) => `/interventions/${id}/rapport`,
}

// ========================================
// 📈 ENDPOINTS STATISTIQUES
// ========================================
export const STATISTIQUES_ENDPOINTS = {
  TENDANCE: '/statistiques/tendance',
  TAUX_INCIDENCE: '/statistiques/taux-incidence',
  DISTRIBUTION_AGE: '/statistiques/distribution-age',
  DISTRIBUTION_SEXE: '/statistiques/distribution-sexe',
  PREDICTIONS: '/statistiques/predictions',
}

// ========================================
// 📄 ENDPOINTS RAPPORTS
// ========================================
export const RAPPORTS_ENDPOINTS = {
  GENERATE: '/rapports/generer',
  PREVIEW: '/rapports/apercu',
  EXPORT_PDF: '/rapports/export/pdf',
  EXPORT_EXCEL: '/rapports/export/excel',
  EXPORT_CSV: '/rapports/export/csv',
}

// ========================================
// 👥 ENDPOINTS UTILISATEURS
// ========================================
export const USERS_ENDPOINTS = {
  LIST: '/utilisateurs',
  GET: (id: number) => `/utilisateurs/${id}`,
  CREATE: '/utilisateurs',
  UPDATE: (id: number) => `/utilisateurs/${id}`,
  DELETE: (id: number) => `/utilisateurs/${id}`,
  PROFILE: '/utilisateurs/profil',
}

// ========================================
// 📚 ENDPOINTS RÉFÉRENTIELS
// ========================================
export const REFERENTIELS_ENDPOINTS = {
  MALADIES: '/referentiels/maladies',
  DISTRICTS: '/referentiels/districts',
  CENTRES_SANTE: '/referentiels/centres-sante',
  CENTRES_BY_DISTRICT: (districtId: number) => `/referentiels/centres-sante/district/${districtId}`,
}
