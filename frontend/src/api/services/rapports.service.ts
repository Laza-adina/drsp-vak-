/**
 * 📄 Fichier: src/api/services/rapports.service.ts
 * 📝 Description: Service de génération de rapports
 * 🎯 Usage: Export rapports PDF, Excel, CSV
 */

import axiosInstance from '../axios.config'

// ========================================
// 📄 SERVICE RAPPORTS
// ========================================

export const rapportsService = {
  /**
   * 📊 Rapport hebdomadaire
   */
  getRapportHebdomadaire: async (): Promise<any> => {
    const response = await axiosInstance.get('/rapports/hebdomadaire')  // ✅ OK
    return response.data
  },

  /**
   * 📊 Rapport mensuel
   */
  getRapportMensuel: async (): Promise<any> => {
    const response = await axiosInstance.get('/rapports/mensuel')  // ✅ OK
    return response.data
  },

  /**
   * 📥 Export Excel
   */
  exportExcel: async (dateDebut?: string, dateFin?: string, maladieId?: number): Promise<Blob> => {
    const response = await axiosInstance.get('/export/cas/excel', {  // ✅ Changé
      params: { date_debut: dateDebut, date_fin: dateFin, maladie_id: maladieId },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 📥 Export CSV
   */
  exportCSV: async (dateDebut?: string, dateFin?: string, maladieId?: number): Promise<Blob> => {
    const response = await axiosInstance.get('/export/cas/csv', {  // ✅ Changé
      params: { date_debut: dateDebut, date_fin: dateFin, maladie_id: maladieId },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 📥 Export PDF (si disponible dans le backend)
   */
  exportPDF: async (dateDebut?: string, dateFin?: string, maladieId?: number): Promise<Blob> => {
    // Note: Endpoint PDF non présent dans votre backend actuellement
    throw new Error('Export PDF non disponible')
  },
}
