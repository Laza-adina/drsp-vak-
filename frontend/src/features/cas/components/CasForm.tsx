/**
 * 📄 Fichier: src/features/cas/components/CasForm.tsx
 * 📝 Description: Formulaire de création/modification d'un cas
 * 🎯 Usage: Ajouter ou modifier un cas de maladie
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { casService } from '@/api/services/cas.service'
import { DistrictSelect } from '@/components/common/DistrictSelect'
import {
  MaladieSelect,
  CentreSanteSelect,
  StatutSelect,
  SexeSelect
} from '@/components/common/FormSelects'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'
import type { Cas, CasCreateInput } from '@/types/cas.types'

// ========================================
// ✅ SCHÉMA DE VALIDATION
// ========================================

const casSchema = z.object({
  nom: z.string().optional(),  // ✅ AJOUT : nom du patient
  maladie_id: z.number().min(1, 'Maladie requise'),
  centre_sante_id: z.number().min(1, 'Centre de santé requis'),
  district_id: z.number().min(1, 'District requis'),
  date_symptomes: z.string().min(1, 'Date des symptômes requise'),
  date_declaration: z.string().min(1, 'Date de déclaration requise'),
  age: z.number().optional(),
  sexe: z.string().optional(),
  statut: z.string().min(1, 'Statut requis'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  observations: z.string().optional(),
})

type CasFormData = z.infer<typeof casSchema>

// ========================================
// 📋 COMPOSANT CAS FORM
// ========================================

interface CasFormProps {
  initialData?: Cas
  onSuccess?: () => void
}

const CasForm: React.FC<CasFormProps> = ({ initialData, onSuccess }) => {
  const isEditMode = !!initialData
  
  const [selectedDistrict, setSelectedDistrict] = useState<number | undefined>(
    initialData?.district_id
  )

  // ========================================
  // 📝 CONFIGURATION DU FORMULAIRE
  // ========================================

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CasFormData>({
    resolver: zodResolver(casSchema),
    defaultValues: {
      nom: initialData?.nom || '',  // ✅ AJOUT
      maladie_id: initialData?.maladie_id || undefined,
      centre_sante_id: initialData?.centre_sante_id || undefined,
      district_id: initialData?.district_id || undefined,
      date_symptomes: initialData?.date_symptomes || '',
      date_declaration: initialData?.date_declaration || '',
      age: initialData?.age || undefined,
      sexe: initialData?.sexe || '',
      statut: initialData?.statut || '',
      observations: initialData?.observations || '',
    },
  })

  const maladie_id = watch('maladie_id')
  const centre_sante_id = watch('centre_sante_id')

  // ========================================
  // 💾 MUTATION (Create/Update)
  // ========================================

  const mutation = useMutation({
    mutationFn: (data: CasCreateInput) => {
      if (isEditMode && initialData?.id) {
        return casService.update(initialData.id, data)
      }
      return casService.create(data)
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? 'Cas modifié avec succès' : 'Cas créé avec succès'
      )
      onSuccess?.()
    },
    onError: (error: any) => {
      console.error('Erreur enregistrement cas:', error)
      const message = error.response?.data?.detail || 'Erreur lors de l\'enregistrement du cas'
      toast.error(message)
    },
  })

  // ========================================
  // 📤 SOUMISSION
  // ========================================

  const onSubmit = (data: CasFormData) => {
    const payload: CasCreateInput = {
      ...data,
      district_id: data.district_id,
    }
    
    console.log('📤 Envoi du cas:', payload)
    mutation.mutate(payload)
  }

  // ========================================
  // 🎨 RENDU
  // ========================================

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ========================================
          INFORMATIONS DE BASE
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ NOM DU PATIENT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du patient
          </label>
          <input
            type="text"
            placeholder="Nom complet du patient"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('nom')}
          />
        </div>

        {/* Âge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Âge
          </label>
          <input
            type="number"
            min="0"
            max="150"
            placeholder="Âge du patient"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('age', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* ========================================
          MALADIES & CENTRES
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maladie */}
        <div>
          <MaladieSelect
            value={maladie_id}
            onChange={(value) => setValue('maladie_id', value)}
            required
            error={errors.maladie_id?.message}
          />
        </div>

        {/* District */}
        <div>
          <DistrictSelect
            value={selectedDistrict}
            onChange={(value) => {
              setSelectedDistrict(value)
              setValue('district_id', value)
            }}
            required
            error={errors.district_id?.message}
          />
        </div>
      </div>

      {/* ========================================
          CENTRE DE SANTÉ
          ======================================== */}
      <div>
        <CentreSanteSelect
          value={centre_sante_id}
          onChange={(value) => setValue('centre_sante_id', value)}
          districtId={selectedDistrict}
          required
          error={errors.centre_sante_id?.message}
        />
      </div>

      {/* ========================================
          DATES & SEXE & STATUT
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Date symptômes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date des symptômes *
          </label>
          <input
            type="date"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date_symptomes ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('date_symptomes')}
          />
          {errors.date_symptomes && (
            <p className="text-red-600 text-sm mt-1">{errors.date_symptomes.message}</p>
          )}
        </div>

        {/* Date déclaration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de déclaration *
          </label>
          <input
            type="date"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date_declaration ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('date_declaration')}
          />
          {errors.date_declaration && (
            <p className="text-red-600 text-sm mt-1">{errors.date_declaration.message}</p>
          )}
        </div>

        {/* Sexe */}
        <SexeSelect
          value={watch('sexe')}
          onChange={(value) => setValue('sexe', value)}
          error={errors.sexe?.message}
        />
      </div>

      {/* ========================================
          STATUT & OBSERVATIONS
          ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statut */}
        <StatutSelect
          value={watch('statut')}
          onChange={(value) => setValue('statut', value)}
          required
          error={errors.statut?.message}
        />
      </div>

      {/* Observations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observations
        </label>
        <textarea
          placeholder="Notes additionnelles sur le cas..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('observations')}
        />
      </div>

      {/* ========================================
          BOUTONS
          ======================================== */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? 'Enregistrement...'
            : isEditMode
            ? 'Modifier le cas'
            : 'Créer le cas'}
        </Button>
      </div>
    </form>
  )
}

export default CasForm
