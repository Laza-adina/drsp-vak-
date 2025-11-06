/**
 * 📄 Fichier: src/api/services/users.service.ts
 * 📝 Description: Service de gestion des utilisateurs et référentiels
 * 🎯 Usage: CRUD utilisateurs, récupération des référentiels
 */

import axiosInstance from '../axios.config'
import type { User, CreateUserData, UpdateUserData } from '@/types/auth.types'

// ========================================
// 👥 SERVICE UTILISATEURS
// ========================================

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users/')
    return response.data
  },

  getById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  },

  create: async (data: CreateUserData): Promise<User> => {
    const response = await axiosInstance.post('/users/', data)
    return response.data
  },

  update: async (id: number, data: UpdateUserData): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`)
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get('/users/me')
    return response.data
  },
}

// ========================================
// 📚 SERVICE RÉFÉRENTIELS
// ========================================

export const referentielsService = {
  /**
   * 🦠 Récupérer la liste des maladies
   */
  getMaladies: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/maladies/')  // ✅ Changé
    return response.data
  },

  /**
   * 🗺️ Récupérer la liste des districts
   */
  getDistricts: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/districts/')  // ✅ Changé
    return response.data
  },

  /**
   * 🏥 Récupérer la liste des centres de santé
   */
  getCentresSante: async (districtId?: number): Promise<any[]> => {
    const response = await axiosInstance.get('/centres-sante/', {  // ✅ Changé
      params: districtId ? { district_id: districtId } : {},
    })
    return response.data
  },
}
