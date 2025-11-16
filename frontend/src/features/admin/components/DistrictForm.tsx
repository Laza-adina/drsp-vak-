/**
 * 📄 Fichier: src/features/admin/components/DistrictForm.tsx
 * 📝 Description: Formulaire d'ajout/modification de district
 * 🎯 Usage: CRUD district
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'
import type { District } from '@/types/cas.types'

// ========================================
// ✅ SCHÉMA DE VALIDATION
// ========================================

const districtSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  code: z.string().min(1, 'Le code est requis').max(10, 'Max 10 caractères'),
  population: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
})

type DistrictFormData = z.infer<typeof districtSchema>

// ========================================
// 📋 COMPOSANT FORMULAIRE
// ========================================

interface DistrictFormProps {
  initialData?: District
  onSuccess?: () => void
  onCancel?: () => void
}

const DistrictForm: React.FC<DistrictFormProps> = ({
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
  } = useForm<DistrictFormData>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      nom: initialData?.nom || '',
      code: initialData?.code || '',
      population: initialData?.population || undefined,
      latitude: initialData?.latitude || undefined,
      longitude: initialData?.longitude || undefined,
      description: initialData?.description || '',
    },
  })

  // Mutation
  const mutation = useMutation({
    mutationFn: (data: DistrictFormData) => {
      if (isEditMode && initialData?.id) {
        return referentielsService.updateDistrict(initialData.id, data)
      }
      return referentielsService.createDistrict(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] })
      toast.success(
        isEditMode ? 'District modifié' : 'District créé'
      )
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement')
    },
  })

  const onSubmit = (data: DistrictFormData) => {
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
            placeholder="Ex: Ambatolampy"
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
            placeholder="Ex: AMP"
            maxLength={10}
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

      {/* Population */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Population
        </label>
        <input
          type="number"
          placeholder="Ex: 245000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          {...register('population', { valueAsNumber: true })}
        />
      </div>

      {/* Coordonnées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <input
            type="number"
            step="0.0001"
            placeholder="Ex: -19.3833"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            {...register('latitude', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="0.0001"
            placeholder="Ex: 47.4167"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            {...register('longitude', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Description du district..."
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

export default DistrictForm
