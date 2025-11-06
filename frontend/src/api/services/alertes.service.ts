/**
 * 📄 Fichier: src/api/services/alertes.service.ts
 * 📝 Description: Service de gestion des alertes
 * 🎯 Usage: CRUD alertes épidémiologiques
 */

import axiosInstance from '../axios.config'
import { ALERTES_ENDPOINTS } from '../endpoints'
import type { Alerte, CreateAlerteData } from '@/types/alertes.types'

// ========================================
// 🚨 SERVICE ALERTES
// ========================================

export const alertesService = {
  /**
   * 📋 Récupérer toutes les alertes
   * @param actives - Filtrer uniquement les alertes actives (optionnel)
   * @returns Liste des alertes
   */
  getAll: async (actives?: boolean): Promise<Alerte[]> => {
    const endpoint = actives ? ALERTES_ENDPOINTS.ACTIVES : ALERTES_ENDPOINTS.LIST
    const response = await axiosInstance.get(endpoint)
    return response.data
  },

  /**
   * 🔍 Récupérer une alerte par ID
   * @param id - ID de l'alerte
   * @returns Détails de l'alerte
   */
  getById: async (id: number): Promise<Alerte> => {
    const response = await axiosInstance.get(ALERTES_ENDPOINTS.GET(id))
    return response.data
  },

  /**
   * ➕ Créer une nouvelle alerte
   * @param data - Données de l'alerte
   * @returns Alerte créée
   */
  create: async (data: CreateAlerteData): Promise<Alerte> => {
    const response = await axiosInstance.post(ALERTES_ENDPOINTS.CREATE, data)
    return response.data
  },

  /**
   * ✏️ Mettre à jour une alerte
   * @param id - ID de l'alerte
   * @param data - Données à mettre à jour
   * @returns Alerte mise à jour
   */
  update: async (id: number, data: Partial<CreateAlerteData>): Promise<Alerte> => {
    const response = await axiosInstance.put(ALERTES_ENDPOINTS.UPDATE(id), data)
    return response.data
  },

  /**
   * 🗑️ Supprimer une alerte
   * @param id - ID de l'alerte
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(ALERTES_ENDPOINTS.DELETE(id))
  },

  /**
   * ✅ Résoudre une alerte (changer le statut en "Résolue")
   * @param id - ID de l'alerte
   * @param resultats - Description des résultats
   * @returns Alerte mise à jour
   */
  resolve: async (id: number, resultats: string): Promise<Alerte> => {
    const response = await axiosInstance.put(ALERTES_ENDPOINTS.UPDATE(id), {
      statut: 'Résolue',
      resultats,
      date_resolution: new Date().toISOString(),
    })
    return response.data
  },
}
