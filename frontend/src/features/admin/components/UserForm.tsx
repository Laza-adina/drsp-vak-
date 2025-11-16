/**
 * 📄 Fichier: src/features/admin/components/UserForm.tsx
 * 📝 Description: Formulaire d'ajout/modification d'utilisateur
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'
import type { User } from '@/types/auth.types'
import axiosInstance from '@/api/axios.config'

// Schéma de validation
const userSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères').optional().or(z.literal('')),
  role: z.string().min(1, 'Le rôle est requis'),
  is_active: z.boolean().optional(),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  initialData?: User
  onSuccess?: () => void
  onCancel?: () => void
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient()
  const isEditMode = !!initialData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nom: initialData?.nom || '',
      prenom: initialData?.prenom || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role || 'LECTEUR',
      is_active: initialData?.is_active !== false,
    },
  })

  // Service création/modification
  const userService = {
    create: async (data: any) => {
      const response = await axiosInstance.post('/users', data)
      return response.data
    },
    update: async (id: number, data: any) => {
      const response = await axiosInstance.put(`/users/${id}`, data)
      return response.data
    }
  }

  // Mutation
  const mutation = useMutation({
    mutationFn: (data: UserFormData) => {
      const payload = { ...data }
      if (!payload.password) {
        delete payload.password
      }
      
      if (isEditMode && initialData?.id) {
        return userService.update(initialData.id, payload)
      }
      return userService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(isEditMode ? 'Utilisateur modifié' : 'Utilisateur créé')
      onSuccess?.()
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur'
      toast.error(message)
    },
  })

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('nom')}
          />
          {errors.nom && (
            <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>
          )}
        </div>

        {/* Prénom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.prenom ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('prenom')}
          />
          {errors.prenom && (
            <p className="text-red-600 text-sm mt-1">{errors.prenom.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe {!isEditMode && '*'}
          {isEditMode && <span className="text-gray-500 text-xs">(laisser vide pour ne pas modifier)</span>}
        </label>
        <input
          type="password"
          placeholder={isEditMode ? 'Laisser vide pour ne pas modifier' : 'Minimum 6 caractères'}
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Rôle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rôle *
        </label>
        <select
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.role ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('role')}
        >
          <option value="">Sélectionner un rôle</option>
          <option value="ADMINISTRATEUR">Administrateur</option>
          <option value="EPIDEMIOLOGISTE">Épidémiologiste</option>
          <option value="AGENT_SAISIE">Agent de saisie</option>
          <option value="LECTEUR">Lecteur</option>
        </select>
        {errors.role && (
          <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Actif */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          {...register('is_active')}
        />
        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
          Compte actif
        </label>
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" loading={mutation.isPending}>
          {isEditMode ? 'Modifier' : 'Créer'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  )
}

export default UserForm
