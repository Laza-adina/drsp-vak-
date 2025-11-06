/**
 * 📄 Fichier: src/features/auth/components/LoginForm.tsx
 * 📝 Description: Formulaire de connexion
 * 🎯 Usage: Saisie email/password avec validation
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

// ========================================
// ✅ SCHÉMA DE VALIDATION
// ========================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ========================================
// 📋 COMPOSANT LOGIN FORM
// ========================================

/**
 * Formulaire de connexion avec validation
 * Utilise react-hook-form + zod
 */
const LoginForm: React.FC = () => {
  const { login, isLoginLoading } = useAuth()

  // ========================================
  // 📝 CONFIGURATION DU FORMULAIRE
  // ========================================
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // ========================================
  // 📤 SOUMISSION DU FORMULAIRE
  // ========================================
  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ========================================
          📧 CHAMP EMAIL
          ======================================== */}
      <div>
        <label className="label">Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="email@exemple.com"
            className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
        )}
      </div>

      {/* ========================================
          🔒 CHAMP MOT DE PASSE
          ======================================== */}
      <div>
        <label className="label">Mot de passe</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className={`input pl-10 ${errors.password ? 'input-error' : ''}`}
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-danger-600">{errors.password.message}</p>
        )}
      </div>

      {/* ========================================
          🔗 MOT DE PASSE OUBLIÉ
          ======================================== */}
      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-primary-500 hover:text-primary-600"
        >
          Mot de passe oublié ?
        </button>
      </div>

      {/* ========================================
          🔘 BOUTON CONNEXION
          ======================================== */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isLoginLoading}
      >
        Se connecter
      </Button>
    </form>
  )
}

export default LoginForm
