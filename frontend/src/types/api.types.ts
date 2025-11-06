/**
 * 📄 Fichier: src/types/api.types.ts
 * 📝 Description: Types liés aux réponses API
 * 🎯 Usage: Typage des réponses HTTP, erreurs, pagination
 */

// ========================================
// 🌐 TYPES API
// ========================================

/**
 * Réponse API standard
 */
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

/**
 * Erreur API standard
 */
export interface ApiError {
  message: string
  errors?: Record<string, string[]> // Erreurs de validation par champ
  status: number
  code?: string
}

/**
 * Réponse paginée
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
