/**
 * 📄 Fichier: src/hooks/useAuth.ts
 * 📝 Description: Hook personnalisé pour l'authentification
 * 🎯 Usage: Accès simplifié aux fonctions d'authentification
 */

import { useAuthStore } from '@/store/authStore'
import { authService } from '@/api/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { LoginCredentials, RegisterData } from '@/types/auth.types'

// ========================================
// 🔐 HOOK AUTHENTIFICATION
// ========================================

/**
 * Hook personnalisé pour gérer l'authentification
 * Fournit des fonctions prêtes à l'emploi pour login, register, logout
 */
export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setAuth, logout: clearAuth } = useAuthStore()

  // ========================================
  // 🔑 MUTATION LOGIN
  // ========================================
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Stocker le token et l'utilisateur
      setAuth(data.user, data.access_token)
      
      // Toast de succès
      toast.success(`Bienvenue ${data.user.prenom} ${data.user.nom} !`)
      
      // Rediriger vers le dashboard
      navigate('/dashboard')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur de connexion'
      toast.error(message)
    },
  })

  // ========================================
  // 📝 MUTATION REGISTER
  // ========================================
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      toast.success('Inscription réussie ! Connectez-vous.')
      navigate('/login')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription'
      toast.error(message)
    },
  })

  // ========================================
  // 🚪 FONCTION LOGOUT
  // ========================================
  const logout = async () => {
    try {
      await authService.logout()
      clearAuth()
      toast.success('Déconnexion réussie')
      navigate('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Déconnecter quand même localement
      clearAuth()
      navigate('/login')
    }
  }

  // ========================================
  // 📤 RETOUR DES FONCTIONS ET DONNÉES
  // ========================================
  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  }
}
