// src/api/services/rapports.service.ts
import axiosInstance from '../axios.config'

export const rapportsService = {
  /**
   * 📄 Rapport hebdomadaire PDF
   */
  getRapportHebdomadairePDF: async (
    dateDebut: string,
    dateFin: string,
    districtId?: number
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    params.append('date_debut', dateDebut)
    params.append('date_fin', dateFin)
    if (districtId) params.append('district_id', districtId.toString())

    const response = await axiosInstance.get('/rapports/hebdomadaire/pdf', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 🎯 Rapport des interventions PDF
   */
  getRapportInterventionsPDF: async (
    dateDebut: string,
    dateFin: string
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    params.append('date_debut', dateDebut)
    params.append('date_fin', dateFin)

    const response = await axiosInstance.get('/rapports/interventions/pdf', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 🤖 Rapport de prédictions PDF
   */
  getRapportPredictionsPDF: async (
    maladieId: number,
    districtId?: number
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    params.append('maladie_id', maladieId.toString())
    if (districtId) params.append('district_id', districtId.toString())

    const response = await axiosInstance.get('/rapports/predictions/pdf', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 📈 Rapport global PDF
   */
  getRapportGlobalPDF: async (
    annee: number,
    trimestre?: number
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    params.append('annee', annee.toString())
    if (trimestre) params.append('trimestre', trimestre.toString())

    const response = await axiosInstance.get('/rapports/global/pdf', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 📊 Export Cas en Excel
   */
  exportExcel: async (
    dateDebut?: string,
    dateFin?: string,
    maladieId?: number
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    if (dateDebut) params.append('date_debut', dateDebut)
    if (dateFin) params.append('date_fin', dateFin)
    if (maladieId) params.append('maladie_id', maladieId.toString())

    const response = await axiosInstance.get('/export/cas/excel', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 📊 Export Cas en CSV
   */
  exportCSV: async (
    dateDebut?: string,
    dateFin?: string,
    maladieId?: number
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    if (dateDebut) params.append('date_debut', dateDebut)
    if (dateFin) params.append('date_fin', dateFin)
    if (maladieId) params.append('maladie_id', maladieId.toString())

    const response = await axiosInstance.get('/export/cas/csv', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 🚨 Export Alertes en Excel
   */
  exportAlertesExcel: async (
    dateDebut?: string,
    dateFin?: string
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    if (dateDebut) params.append('date_debut', dateDebut)
    if (dateFin) params.append('date_fin', dateFin)

    const response = await axiosInstance.get('/export/alertes/excel', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 🎯 Export Interventions en Excel
   */
  exportInterventionsExcel: async (
    dateDebut?: string,
    dateFin?: string
  ): Promise<Blob> => {
    const params = new URLSearchParams()
    if (dateDebut) params.append('date_debut', dateDebut)
    if (dateFin) params.append('date_fin', dateFin)

    const response = await axiosInstance.get('/export/interventions/excel', {
      params,
      responseType: 'blob',
    })
    return response.data
  },
}
