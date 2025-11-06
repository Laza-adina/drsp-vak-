/**
 * 📄 Fichier: src/features/admin/components/UserForm.tsx
 * 📝 Description: Formulaire utilisateur (création/modification)
 * 🎯 Usage: Gérer les comptes utilisateurs
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { usersService } from '@/api/services/users.service'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'
import type { User } from '@/types/auth.types'

const userSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères').optional().or(z.literal('')),
  role: z.string().min(1, 'Le rôle est requis'),
  actif: z.boolean(),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  initialData?: User
  onSuccess?: () => void
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess }) => {
  const isEditMode = Boolean(initialData)

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData
      ? {
          nom: initialData.nom,
          prenom: initialData.prenom,
          email: initialData.email,
          role: initialData.role,
          actif: initialData.actif,
        }
      : { actif: true },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => usersService.create(data),
    onSuccess: () => {
      toast.success('Utilisateur créé')
      onSuccess?.()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => usersService.update(initialData!.id, data),
    onSuccess: () => {
      toast.success('Utilisateur modifié')
      onSuccess?.()
    },
  })

  const onSubmit = (data: UserFormData) => {
    const mutation = isEditMode ? updateMutation : createMutation
    // Ne pas envoyer le password s'il est vide en mode édition
    const payload = { ...data }
    if (isEditMode && !data.password) {
      delete payload.password
    }
    mutation.mutate(payload)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nom" required error={errors.nom?.message} {...register('nom')} />
        <Input label="Prénom" required error={errors.prenom?.message} {...register('prenom')} />
      </div>

      <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />

      <Input
        label="Mot de passe"
        type="password"
        helperText={isEditMode ? 'Laisser vide pour ne pas modifier' : undefined}
        error={errors.password?.message}
        {...register('password')}
      />

      <Select
        label="Rôle"
        required
        error={errors.role?.message}
        options={[
          { value: 'Admin', label: 'Admin' },
          { value: 'Épidémiologiste', label: 'Épidémiologiste' },
          { value: 'Agent de saisie', label: 'Agent de saisie' },
          { value: 'Lecteur', label: 'Lecteur' },
        ]}
        {...register('role')}
      />

      <label className="flex items-center">
        <input type="checkbox" className="mr-2" {...register('actif')} />
        <span className="text-sm text-gray-700">Compte actif</span>
      </label>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={createMutation.isPending || updateMutation.isPending}
      >
        {isEditMode ? 'Mettre à jour' : 'Créer'}
      </Button>
    </form>
  )
}

export default UserForm
