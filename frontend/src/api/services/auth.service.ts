/**
 * 📄 Fichier: src/api/services/auth.service.ts
 * 📝 Description: Service d'authentification
 * 🎯 Usage: Gestion connexion, inscription, profil utilisateur
 */

import axiosInstance from '../axios.config'
import { AUTH_ENDPOINTS } from '../endpoints'
import type { LoginCredentials, LoginResponse, RegisterData, User } from '@/types/auth.types'

// ========================================
// 🔐 SERVICE AUTHENTIFICATION
// ========================================

export const authService = {
  /**
   * 🔑 Connexion utilisateur
   * @param credentials - Email et mot de passe
   * @returns Token JWT et informations utilisateur
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Envoyer les données en format form-data (OAuth2)
    const formData = new FormData()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)

    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  /**
   * 📝 Inscription nouvel utilisateur
   * @param data - Données d'inscription
   * @returns Utilisateur créé
   */
  register: async (data: RegisterData): Promise<User> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, data)
    return response.data
  },

  /**
   * 🚪 Déconnexion
   * Nettoie le token localement (pas d'endpoint backend nécessaire)
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  /**
   * 👤 Récupérer le profil utilisateur connecté
   * @returns Informations utilisateur
   */
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get(AUTH_ENDPOINTS.ME)
    return response.data
  },

  /**
   * 🔄 Rafraîchir le token JWT
   * @returns Nouveau token
   */
  refreshToken: async (): Promise<{ access_token: string }> => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.REFRESH)
    return response.data
  },
}
