/**
 * 📄 Fichier: src/features/auth/components/RegisterForm.tsx
 * 📝 Description: Formulaire d'inscription
 * 🎯 Usage: Création de compte avec validation
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock } from 'lucide-react'
import { UserRole } from '@/types/auth.types'  // ✅ AJOUTER
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

// ========================================
// ✅ SCHÉMA DE VALIDATION
// ========================================

const registerSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
  role: z.string().default(UserRole.Lecteur),  // ✅ CHANGER 'Lecteur' en UserRole.Lecteur ("lecteur")
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

// ========================================
// 📋 COMPOSANT REGISTER FORM
// ========================================

const RegisterForm: React.FC = () => {
  const { register: registerUser, isRegisterLoading } = useAuth()

  // ========================================
  // 📝 CONFIGURATION DU FORMULAIRE
  // ========================================
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.Lecteur,  // ✅ CHANGER 'Lecteur' en UserRole.Lecteur ("lecteur")
    },
  })

  // ========================================
  // 📤 SOUMISSION DU FORMULAIRE
  // ========================================
  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data
    // ✅ CHANGER 'Lecteur' en UserRole.Lecteur ("lecteur")
    registerUser({
      ...registerData,
      role: UserRole.Lecteur,
    } as any)
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* NOM */}
      <div>
        <label className="label">Nom</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rakoto"
            className={`input pl-10 ${errors.nom ? 'input-error' : ''}`}
            {...register('nom')}
          />
        </div>
        {errors.nom && (
          <p className="mt-1 text-sm text-danger-600">{errors.nom.message}</p>
        )}
      </div>

      {/* PRÉNOM */}
      <div>
        <label className="label">Prénom</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Jean"
            className={`input pl-10 ${errors.prenom ? 'input-error' : ''}`}
            {...register('prenom')}
          />
        </div>
        {errors.prenom && (
          <p className="mt-1 text-sm text-danger-600">{errors.prenom.message}</p>
        )}
      </div>

      {/* EMAIL */}
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

      {/* MOT DE PASSE */}
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

      {/* CONFIRMATION MOT DE PASSE */}
      <div>
        <label className="label">Confirmer le mot de passe</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-danger-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* ✅ RÔLE CACHÉ - VALEUR CORRECTE */}
      <input
        type="hidden"
        value={UserRole.Lecteur}  // ✅ CHANGER 'Lecteur' en UserRole.Lecteur ("lecteur")
        {...register('role')}
      />

      {/* BOUTON INSCRIPTION */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isRegisterLoading}
      >
        S'inscrire
      </Button>
    </form>
  )
}

export default RegisterForm
