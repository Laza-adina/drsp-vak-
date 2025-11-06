/**
 * 📄 Fichier: src/utils/constants.ts
 * 📝 Description: Constantes globales de l'application
 * 🎯 Usage: Import centralisé des valeurs fixes (URLs, config, limites)
 */

// ========================================
// 🌐 CONFIGURATION API
// ========================================
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
export const API_TIMEOUT = 30000 // 30 secondes

// ========================================
// 🗺️ CONFIGURATION CARTE
// ========================================
export const MAP_CONFIG = {
  CENTER_LAT: -19.5, // Latitude Vakinankaratra
  CENTER_LNG: 46.95, // Longitude Vakinankaratra
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 8,
  MAX_ZOOM: 18,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}

// ========================================
// 👥 RÔLES UTILISATEUR
// ========================================
export const USER_ROLES = {
  ADMIN: 'Admin',
  EPIDEMIOLOGISTE: 'Épidémiologiste',
  AGENT_SAISIE: 'Agent de saisie',
  LECTEUR: 'Lecteur',
} as const

// ========================================
// 🎨 COULEURS PAR STATUT
// ========================================
export const STATUS_COLORS = {
  Suspect: 'warning',
  Confirmé: 'danger',
  Écarté: 'success',
  'En cours': 'primary',
} as const

// ========================================
// 🚨 COULEURS PAR GRAVITÉ
// ========================================
export const SEVERITY_COLORS = {
  Faible: 'success',
  Modéré: 'warning',
  Élevé: 'danger',
  Critique: 'danger',
} as const

// ========================================
// 📊 PAGINATION
// ========================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
}

// ========================================
// 📅 FORMATS DE DATE
// ========================================
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_TIME: "yyyy-MM-dd'T'HH:mm:ss",
}

// ========================================
// 📁 LIMITES UPLOAD
// ========================================
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'pdf', 'xlsx', 'csv'],
}

// ========================================
// ⏱️ DÉLAIS & TIMEOUTS
// ========================================
export const TIMEOUTS = {
  TOAST_DURATION: 4000, // 4 secondes
  DEBOUNCE_SEARCH: 300, // 300ms
  AUTO_SAVE: 30000, // 30 secondes
  SESSION_WARNING: 5 * 60 * 1000, // 5 minutes avant expiration
}

// ========================================
// 📱 RESPONSIVE BREAKPOINTS
// ========================================
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}
