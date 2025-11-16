/**
 * 📄 Fichier: src/features/admin/components/CentreSanteForm.tsx
 * 📝 Description: Formulaire centre de santé
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'
import type { CentreSante } from '@/types/cas.types'

// Schéma validation
const centreSanteSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  type: z.string().min(1, 'Le type est requis'),
  district_id: z.number().min(1, 'Le district est requis'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

type CentreSanteFormData = z.infer<typeof centreSanteSchema>

interface CentreSanteFormProps {
  initialData?: CentreSante
  onSuccess?: () => void
  onCancel?: () => void
}

const CentreSanteForm: React.FC<CentreSanteFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const queryClient = useQueryClient()
  const isEditMode = !!initialData

  // Récupérer les districts
  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CentreSanteFormData>({
    resolver: zodResolver(centreSanteSchema),
    defaultValues: {
      nom: initialData?.nom || '',
      type: initialData?.type || 'csb1',
      district_id: initialData?.district_id || undefined,
      latitude: initialData?.latitude || undefined,
      longitude: initialData?.longitude || undefined,
    },
  })

  // Mutation
  const mutation = useMutation({
    mutationFn: (data: CentreSanteFormData) => {
      if (isEditMode && initialData?.id) {
        return referentielsService.updateCentreSante(initialData.id, data)
      }
      return referentielsService.createCentreSante(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centres-sante'] })
      toast.success(isEditMode ? 'Centre modifié' : 'Centre créé')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement')
    },
  })

  const onSubmit = (data: CentreSanteFormData) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom du centre *
        </label>
        <input
          type="text"
          placeholder="Ex: CSB Ambatolampy"
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.nom ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('nom')}
        />
        {errors.nom && (
          <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('type')}
          >
            <option value="">Sélectionner</option>
            <option value="csb1">CSB I</option>
            <option value="csb2">CSB II</option>
            <option value="chd">CHD</option>
            <option value="chu">CHU</option>
            <option value="hopital">Hôpital</option>
          </select>
          {errors.type && (
            <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District *
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.district_id ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('district_id', { valueAsNumber: true })}
          >
            <option value="">Sélectionner</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.nom}
              </option>
            ))}
          </select>
          {errors.district_id && (
            <p className="text-red-600 text-sm mt-1">{errors.district_id.message}</p>
          )}
        </div>
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

      {/* Boutons */}
      <div className="flex gap-3">
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

export default CentreSanteForm
