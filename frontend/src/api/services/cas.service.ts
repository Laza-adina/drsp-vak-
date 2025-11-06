/**
 * 📄 Fichier: src/api/services/cas.service.ts
 * 📝 Description: Service de gestion des cas
 * 🎯 Usage: CRUD cas, filtrage, statistiques
 */

import axiosInstance from '../axios.config'
import { CAS_ENDPOINTS } from '../endpoints'
import type { Cas, CreateCasData, UpdateCasData, CasFilters, CasStats } from '@/types/cas.types'

// ========================================
// 🏥 SERVICE CAS
// ========================================

export const casService = {
  /**
   * 📋 Récupérer la liste des cas (avec filtres optionnels)
   * @param filters - Filtres de recherche
   * @returns Liste des cas
   */
  getAll: async (filters?: CasFilters): Promise<Cas[]> => {
    const response = await axiosInstance.get(CAS_ENDPOINTS.LIST, {
      params: filters,
    })
    return response.data
  },

  /**
   * 🔍 Récupérer un cas par ID
   * @param id - ID du cas
   * @returns Détails du cas
   */
  getById: async (id: number): Promise<Cas> => {
    const response = await axiosInstance.get(CAS_ENDPOINTS.GET(id))
    return response.data
  },

  /**
   * ➕ Créer un nouveau cas
   * @param data - Données du cas
   * @returns Cas créé
   */
  create: async (data: CreateCasData): Promise<Cas> => {
    const response = await axiosInstance.post(CAS_ENDPOINTS.CREATE, data)
    return response.data
  },

  /**
   * ✏️ Mettre à jour un cas
   * @param id - ID du cas
   * @param data - Données à mettre à jour
   * @returns Cas mis à jour
   */
  update: async (id: number, data: UpdateCasData): Promise<Cas> => {
    const response = await axiosInstance.put(CAS_ENDPOINTS.UPDATE(id), data)
    return response.data
  },

  /**
   * 🗑️ Supprimer un cas
   * @param id - ID du cas
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(CAS_ENDPOINTS.DELETE(id))
  },

  /**
   * 📊 Récupérer les statistiques des cas
   * @returns Statistiques globales
   */
  getStats: async (): Promise<CasStats> => {
    const response = await axiosInstance.get(CAS_ENDPOINTS.STATS)
    return response.data
  },

  /**
   * 📥 Exporter les cas (CSV/Excel)
   * @param format - Format d'export ('csv' ou 'excel')
   * @param filters - Filtres optionnels
   * @returns Blob du fichier
   */
  export: async (format: 'csv' | 'excel', filters?: CasFilters): Promise<Blob> => {
    const response = await axiosInstance.get(CAS_ENDPOINTS.EXPORT, {
      params: { format, ...filters },
      responseType: 'blob',
    })
    return response.data
  },
}
