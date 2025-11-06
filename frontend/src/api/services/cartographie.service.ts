/**
 * 📄 Fichier: src/api/services/cartographie.service.ts
 * 📝 Description: Service de cartographie
 * 🎯 Usage: Récupération des données géographiques
 */

import axiosInstance from '../axios.config'
import type { MapMarker, HeatmapPoint, ChoroplethData, CasCluster } from '@/types/cartographie.types'

// ========================================
// 🗺️ SERVICE CARTOGRAPHIE
// ========================================

export const cartographieService = {
  /**
   * 📍 Récupérer les marqueurs de cas pour la carte
   */
  getMarkers: async (maladieId?: number, districtId?: number): Promise<MapMarker[]> => {
    const response = await axiosInstance.get('/cartographie/markers', {  // ✅ Changé
      params: { 
        maladie_id: maladieId, 
        district_id: districtId 
      },
    })
    return response.data
  },

  /**
   * 🔥 Récupérer les données pour la carte de chaleur
   */
  getHeatmapData: async (maladieId?: number): Promise<HeatmapPoint[]> => {
    const response = await axiosInstance.get('/cartographie/heatmap', {  // ✅ OK
      params: { maladie_id: maladieId },
    })
    return response.data
  },

  /**
   * 🎨 Récupérer les données choroplèthe (districts)
   */
  getChoroplethData: async (maladieId?: number): Promise<ChoroplethData[]> => {
    const response = await axiosInstance.get('/cartographie/districts', {  // ✅ Changé
      params: { maladie_id: maladieId },
    })
    return response.data
  },

  /**
   * 📌 Récupérer les clusters de cas
   */
  getClusters: async (rayonKm: number = 5): Promise<CasCluster[]> => {
    const response = await axiosInstance.get('/cartographie/clusters', {  // ✅ OK
      params: { rayon_km: rayonKm },
    })
    return response.data
  },

  /**
   * 🏥 Récupérer les marqueurs des centres de santé
   */
  getCentresSanteMarkers: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/cartographie/centres-sante')  // ✅ Nouveau
    return response.data
  },
}
