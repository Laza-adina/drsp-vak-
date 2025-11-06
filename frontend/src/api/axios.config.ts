/**
 * 📄 Fichier: src/api/axios.config.ts
 * 📝 Description: Configuration d'Axios avec intercepteurs
 * 🎯 Usage: Instance Axios centralisée avec gestion auth et erreurs
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/utils/constants'
import toast from 'react-hot-toast'

// ========================================
// 🔧 CRÉATION INSTANCE AXIOS
// ========================================

/**
 * Instance Axios configurée pour l'API backend
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ========================================
// 📤 INTERCEPTEUR DE REQUÊTE
// ========================================

/**
 * Ajoute automatiquement le token JWT dans l'en-tête Authorization
 * pour toutes les requêtes nécessitant une authentification
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('token')
    
    if (token) {
      // Ajouter le token dans l'en-tête Authorization
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log des requêtes en développement
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('❌ Erreur requête Axios:', error)
    return Promise.reject(error)
  }
)

// ========================================
// 📥 INTERCEPTEUR DE RÉPONSE
// ========================================

/**
 * Gère les réponses et erreurs API de manière centralisée
 * - Logs en développement
 * - Gestion des erreurs 401 (déconnexion auto)
 * - Gestion des erreurs 403 (permissions)
 * - Gestion des erreurs 500 (serveur)
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Log des réponses en développement
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.data)
    }
    
    return response
  },
  (error: AxiosError<any>) => {
    // Log de l'erreur
    console.error('❌ Erreur API:', error)
    
    // Extraire le message d'erreur
    const message = error.response?.data?.message || error.message || 'Une erreur est survenue'
    const status = error.response?.status
    
    // ========================================
    // 🔐 GESTION ERREUR 401 - NON AUTORISÉ
    // ========================================
    if (status === 401) {
      // Token expiré ou invalide
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expirée. Veuillez vous reconnecter.')
        
        // Nettoyer le localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Rediriger vers la page de connexion
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      }
    }
    
    // ========================================
    // 🚫 GESTION ERREUR 403 - INTERDIT
    // ========================================
    else if (status === 403) {
      toast.error('Vous n\'avez pas les permissions nécessaires')
    }
    
    // ========================================
    // 🔍 GESTION ERREUR 404 - NON TROUVÉ
    // ========================================
    else if (status === 404) {
      toast.error('Ressource introuvable')
    }
    
    // ========================================
    // ⚠️ GESTION ERREUR 422 - VALIDATION
    // ========================================
    else if (status === 422) {
      // Erreurs de validation du backend (FastAPI)
      const errors = error.response?.data?.errors
      if (errors) {
        // Afficher la première erreur
        const firstError = Object.values(errors)[0]
        if (Array.isArray(firstError)) {
          toast.error(firstError[0])
        }
      } else {
        toast.error(message)
      }
    }
    
    // ========================================
    // 💥 GESTION ERREUR 500 - SERVEUR
    // ========================================
    else if (status && status >= 500) {
      toast.error('Erreur serveur. Veuillez réessayer plus tard.')
    }
    
    // ========================================
    // 🌐 GESTION ERREUR RÉSEAU
    // ========================================
    else if (!status) {
      toast.error('Erreur de connexion. Vérifiez votre connexion internet.')
    }
    
    // ========================================
    // ❓ AUTRES ERREURS
    // ========================================
    else {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance
