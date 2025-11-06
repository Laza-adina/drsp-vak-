/**
 * 📄 Fichier: src/features/cas/components/CasForm.tsx
 * 📝 Description: Formulaire de cas (création/modification)
 * 🎯 Usage: Formulaire complet avec validation pour les cas
 */

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { casService } from '@/api/services/cas.service'
import { referentielsService } from '@/api/services/users.service'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'
import type { Cas, CreateCasData } from '@/types/cas.types'

// ========================================
// ✅ SCHÉMA DE VALIDATION
// ========================================

const casSchema = z.object({
  maladie_id: z.number().min(1, 'La maladie est requise'),
  district_id: z.number().min(1, 'Le district est requis'),
  centre_sante_id: z.number().min(1, 'Le centre de santé est requis'),
  patient_nom: z.string().min(1, 'Le nom du patient est requis'),
  patient_age: z.number().min(0, 'L\'âge doit être positif').max(150, 'Âge invalide'),
  patient_sexe: z.enum(['M', 'F'], { required_error: 'Le sexe est requis' }),
  date_debut_symptomes: z.string().min(1, 'La date de début est requise'),
  date_notification: z.string().min(1, 'La date de notification est requise'),
  statut: z.enum(['Suspect', 'Confirmé', 'Écarté', 'En cours']),
  cas_confirme: z.boolean(),
  cas_deces: z.boolean(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  commentaire: z.string().optional(),
})

type CasFormData = z.infer<typeof casSchema>

// ========================================
// 🎨 INTERFACE
// ========================================

interface CasFormProps {
  initialData?: Cas
  onSuccess?: () => void
}

// ========================================
// 📋 COMPOSANT CAS FORM
// ========================================

/**
 * Formulaire de cas avec validation complète
 */
const CasForm: React.FC<CasFormProps> = ({ initialData, onSuccess }) => {
  const queryClient = useQueryClient()
  const isEditMode = Boolean(initialData)

  // ========================================
  // 📡 CHARGEMENT DES RÉFÉRENTIELS
  // ========================================
  const { data: maladies } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // ========================================
  // 📝 CONFIGURATION DU FORMULAIRE
  // ========================================
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CasFormData>({
    resolver: zodResolver(casSchema),
    defaultValues: initialData
      ? {
          maladie_id: initialData.maladie_id,
          district_id: initialData.district_id,
          centre_sante_id: initialData.centre_sante_id,
          patient_nom: initialData.patient_nom,
          patient_age: initialData.patient_age,
          patient_sexe: initialData.patient_sexe,
          date_debut_symptomes: initialData.date_debut_symptomes.split('T')[0],
          date_notification: initialData.date_notification.split('T')[0],
          statut: initialData.statut,
          cas_confirme: initialData.cas_confirme,
          cas_deces: initialData.cas_deces,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          commentaire: initialData.commentaire,
        }
      : undefined,
  })

  // Observer le district sélectionné pour charger les centres
  const districtId = watch('district_id')

  const { data: centres } = useQuery({
    queryKey: ['centres-sante', districtId],
    queryFn: () => referentielsService.getCentresSante(districtId),
    enabled: Boolean(districtId),
  })

  // ========================================
  // 🔄 MUTATIONS
  // ========================================
  const createMutation = useMutation({
    mutationFn: (data: CreateCasData) => casService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cas'] })
      toast.success('Cas créé avec succès')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erreur lors de la création du cas')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CreateCasData) =>
      casService.update(initialData!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cas'] })
      toast.success('Cas modifié avec succès')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erreur lors de la modification du cas')
    },
  })

  // ========================================
  // 📤 SOUMISSION
  // ========================================
  const onSubmit = (data: CasFormData) => {
    const mutation = isEditMode ? updateMutation : createMutation
    mutation.mutate(data as CreateCasData)
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ========================================
          📋 SECTION 1 : INFORMATIONS MÉDICALES
          ======================================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations médicales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Maladie"
            placeholder="Sélectionner une maladie"
            required
            error={errors.maladie_id?.message}
            options={maladies?.map((m: any) => ({ value: m.id, label: m.nom })) || []}
            {...register('maladie_id', { valueAsNumber: true })}
          />

          <Select
            label="Statut"
            required
            error={errors.statut?.message}
            options={[
              { value: 'Suspect', label: 'Suspect' },
              { value: 'Confirmé', label: 'Confirmé' },
              { value: 'Écarté', label: 'Écarté' },
              { value: 'En cours', label: 'En cours' },
            ]}
            {...register('statut')}
          />

          <Input
            label="Date début symptômes"
            type="date"
            required
            error={errors.date_debut_symptomes?.message}
            {...register('date_debut_symptomes')}
          />

          <Input
            label="Date de notification"
            type="date"
            required
            error={errors.date_notification?.message}
            {...register('date_notification')}
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              {...register('cas_confirme')}
            />
            <span className="text-sm text-gray-700">Cas confirmé</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              {...register('cas_deces')}
            />
            <span className="text-sm text-gray-700">Cas de décès</span>
          </label>
        </div>
      </div>

      {/* ========================================
          👤 SECTION 2 : INFORMATIONS PATIENT
          ======================================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations du patient
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Nom du patient"
            required
            error={errors.patient_nom?.message}
            {...register('patient_nom')}
          />

          <Input
            label="Âge"
            type="number"
            required
            error={errors.patient_age?.message}
            {...register('patient_age', { valueAsNumber: true })}
          />

          <Select
            label="Sexe"
            required
            error={errors.patient_sexe?.message}
            options={[
              { value: 'M', label: 'Masculin' },
              { value: 'F', label: 'Féminin' },
            ]}
            {...register('patient_sexe')}
          />
        </div>
      </div>

      {/* ========================================
          📍 SECTION 3 : LOCALISATION
          ======================================== */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Localisation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="District"
            placeholder="Sélectionner un district"
            required
            error={errors.district_id?.message}
            options={districts?.map((d: any) => ({ value: d.id, label: d.nom })) || []}
            {...register('district_id', { valueAsNumber: true })}
          />

          <Select
            label="Centre de santé"
            placeholder="Sélectionner un centre"
            required
            error={errors.centre_sante_id?.message}
            options={centres?.map((c: any) => ({ value: c.id, label: c.nom })) || []}
            {...register('centre_sante_id', { valueAsNumber: true })}
          />

          <Input
            label="Latitude"
            type="number"
            step="any"
            helperText="Coordonnée GPS (optionnel)"
            error={errors.latitude?.message}
            {...register('latitude', { valueAsNumber: true })}
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            helperText="Coordonnée GPS (optionnel)"
            error={errors.longitude?.message}
            {...register('longitude', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* ========================================
          💬 SECTION 4 : COMMENTAIRE
          ======================================== */}
      <div>
        <label className="label">Commentaire</label>
        <textarea
          rows={4}
          className="input"
          placeholder="Informations complémentaires..."
          {...register('commentaire')}
        />
      </div>

      {/* ========================================
          🔘 BOUTONS
          ======================================== */}
      <div className="flex items-center space-x-3">
        <Button
          type="submit"
          variant="primary"
          loading={createMutation.isPending || updateMutation.isPending}
        >
          {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}

export default CasForm
