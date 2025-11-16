/**
 * 📄 Fichier: src/features/admin/components/MaladieForm.tsx
 * 📝 Description: Formulaire d'ajout/modification de maladie
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'
import type { Maladie } from '@/types/cas.types'

// Schéma de validation
const maladieSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  code: z.string().min(1, 'Le code est requis'),
  seuil_alerte: z.number().min(0, 'Doit être >= 0'),
  seuil_epidemie: z.number().min(0, 'Doit être >= 0'),
  description: z.string().optional(),
})

type MaladieFormData = z.infer<typeof maladieSchema>

interface MaladieFormProps {
  initialData?: Maladie
  onSuccess?: () => void
  onCancel?: () => void
}

const MaladieForm: React.FC<MaladieFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const queryClient = useQueryClient()
  const isEditMode = !!initialData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaladieFormData>({
    resolver: zodResolver(maladieSchema),
    defaultValues: {
      nom: initialData?.nom || '',
      code: initialData?.code || '',
      seuil_alerte: initialData?.seuil_alerte || 0,
      seuil_epidemie: initialData?.seuil_epidemie || 0,
      description: initialData?.description || '',
    },
  })

  // Mutation
  const mutation = useMutation({
    mutationFn: (data: MaladieFormData) => {
      if (isEditMode && initialData?.id) {
        return referentielsService.updateMaladie(initialData.id, data)
      }
      return referentielsService.createMaladie(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maladies'] })
      toast.success(
        isEditMode ? 'Maladie modifiée' : 'Maladie créée'
      )
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement')
    },
  })

  const onSubmit = (data: MaladieFormData) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la maladie *
          </label>
          <input
            type="text"
            placeholder="Ex: Paludisme"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('nom')}
          />
          {errors.nom && (
            <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>
          )}
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code *
          </label>
          <input
            type="text"
            placeholder="Ex: PALU"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.code ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('code')}
          />
          {errors.code && (
            <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>
      </div>

      {/* Seuils */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seuil d'alerte *
          </label>
          <input
            type="number"
            min="0"
            placeholder="Ex: 10"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.seuil_alerte ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('seuil_alerte', { valueAsNumber: true })}
          />
          {errors.seuil_alerte && (
            <p className="text-red-600 text-sm mt-1">{errors.seuil_alerte.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seuil d'épidémie *
          </label>
          <input
            type="number"
            min="0"
            placeholder="Ex: 50"
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.seuil_epidemie ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('seuil_epidemie', { valueAsNumber: true })}
          />
          {errors.seuil_epidemie && (
            <p className="text-red-600 text-sm mt-1">{errors.seuil_epidemie.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Description de la maladie..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          {...register('description')}
        />
      </div>

      {/* Boutons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          loading={mutation.isPending}
        >
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

export default MaladieForm

