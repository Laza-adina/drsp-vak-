/**
 * 📄 Fichier: src/features/alertes/components/AlerteForm.tsx
 * 📝 Description: Formulaire de création d'alerte
 * 🎯 Usage: Enregistrer une nouvelle alerte
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { alertesService } from '@/api/services/alertes.service'
import { referentielsService } from '@/api/services/users.service'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

// ========================================
// ✅ SCHÉMA DE VALIDATION
// ========================================

const alerteSchema = z.object({
  maladie_id: z.number().min(1, 'La maladie est requise'),
  district_id: z.number().min(1, 'Le district est requis'),
  type_alerte: z.string().min(1, 'Le type est requis'),
  niveau_gravite: z.string().min(1, 'Le niveau de gravité est requis'),
  nombre_cas: z.number().min(1, 'Le nombre de cas est requis'),
  date_detection: z.string().min(1, 'La date est requise'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  actions_recommandees: z.string().optional(),
  responsable: z.string().optional(),
})

type AlerteFormData = z.infer<typeof alerteSchema>

// ========================================
// 🎨 INTERFACE
// ========================================

interface AlerteFormProps {
  onSuccess?: () => void
}

// ========================================
// 📋 COMPOSANT ALERTE FORM
// ========================================

const AlerteForm: React.FC<AlerteFormProps> = ({ onSuccess }) => {
  // Référentiels
  const { data: maladies } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Formulaire
  const { register, handleSubmit, formState: { errors } } = useForm<AlerteFormData>({
    resolver: zodResolver(alerteSchema),
  })

  // Mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => alertesService.create(data),
    onSuccess: () => {
      toast.success('Alerte créée avec succès')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erreur lors de la création de l\'alerte')
    },
  })

  const onSubmit = (data: AlerteFormData) => {
    createMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Maladie"
          required
          error={errors.maladie_id?.message}
          options={maladies?.map((m: any) => ({ value: m.id, label: m.nom })) || []}
          {...register('maladie_id', { valueAsNumber: true })}
        />

        <Select
          label="District"
          required
          error={errors.district_id?.message}
          options={districts?.map((d: any) => ({ value: d.id, label: d.nom })) || []}
          {...register('district_id', { valueAsNumber: true })}
        />

        <Select
          label="Type d'alerte"
          required
          error={errors.type_alerte?.message}
          options={[
            { value: 'Épidémie', label: 'Épidémie' },
            { value: 'Cluster', label: 'Cluster' },
            { value: 'Augmentation inhabituelle', label: 'Augmentation inhabituelle' },
            { value: 'Décès multiple', label: 'Décès multiple' },
          ]}
          {...register('type_alerte')}
        />

        <Select
          label="Niveau de gravité"
          required
          error={errors.niveau_gravite?.message}
          options={[
            { value: 'Faible', label: 'Faible' },
            { value: 'Modéré', label: 'Modéré' },
            { value: 'Élevé', label: 'Élevé' },
            { value: 'Critique', label: 'Critique' },
          ]}
          {...register('niveau_gravite')}
        />

        <Input
          label="Nombre de cas"
          type="number"
          required
          error={errors.nombre_cas?.message}
          {...register('nombre_cas', { valueAsNumber: true })}
        />

        <Input
          label="Date de détection"
          type="date"
          required
          error={errors.date_detection?.message}
          {...register('date_detection')}
        />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          rows={3}
          className="input"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="Actions recommandées"
        {...register('actions_recommandees')}
      />

      <Input
        label="Responsable"
        {...register('responsable')}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={createMutation.isPending}
      >
        Créer l'alerte
      </Button>
    </form>
  )
}

export default AlerteForm
