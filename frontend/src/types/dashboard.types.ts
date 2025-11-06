/**
 * 📄 Fichier: src/types/dashboard.types.ts
 * 📝 Description: Types pour le dashboard
 * 🎯 Usage: Interfaces des données du tableau de bord
 */

// ========================================
// 📊 STATISTIQUES GLOBALES
// ========================================
export interface DashboardStats {
  total_cas: number
  nouveaux_cas: {
    '24h': number
    '7j': number
    '30j': number
  }
  alertes_actives: Record<string, number>
  cas_par_statut: Record<string, number>
  timestamp: string
}

// ========================================
// 📈 ÉVOLUTION TEMPORELLE
// ========================================
export interface EvolutionData {
  date: string
  nombre_cas: number
}

// ========================================
// 🏆 TOP DISTRICTS
// ========================================
export interface TopDistrict {
  district_id: number
  district_nom: string
  nombre_cas: number
}

// ========================================
// 🦠 DISTRIBUTION PAR MALADIE
// ========================================
export interface MaladieDistribution {
  maladie_id: number
  maladie_nom: string
  nombre_cas: number
  pourcentage: number
}
