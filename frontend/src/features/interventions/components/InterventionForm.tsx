/**
 * 📄 Fichier: src/features/interventions/components/InterventionForm.tsx
 * 📝 Description: Formulaire d'intervention
 * 🎯 Usage: Planifier une nouvelle intervention
 */

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { interventionsService } from '@/api/services/interventions.service'
import { referentielsService } from '@/api/services/users.service'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

const interventionSchema = z.object({
  district_id: z.number().min(1, 'Le district est requis'),
  type_intervention: z.string().min(1, 'Le type est requis'),
  description: z.string().min(10, 'La description est requise'),
  date_debut: z.string().min(1, 'La date de début est requise'),
  date_fin_prevue: z.string().min(1, 'La date de fin est requise'),
  responsable: z.string().min(1, 'Le responsable est requis'),
  nombre_personnes_ciblees: z.number().optional(),
  budget_prevu: z.number().optional(),
})

type InterventionFormData = z.infer<typeof interventionSchema>

interface InterventionFormProps {
  onSuccess?: () => void
}

const InterventionForm: React.FC<InterventionFormProps> = ({ onSuccess }) => {
  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  const { register, handleSubmit, formState: { errors } } = useForm<InterventionFormData>({
    resolver: zodResolver(interventionSchema),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => interventionsService.create(data),
    onSuccess: () => {
      toast.success('Intervention créée')
      onSuccess?.()
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
      <Select
        label="District"
        required
        error={errors.district_id?.message}
        options={districts?.map((d: any) => ({ value: d.id, label: d.nom })) || []}
        {...register('district_id', { valueAsNumber: true })}
      />

      <Select
        label="Type d'intervention"
        required
        error={errors.type_intervention?.message}
        options={[
          { value: 'Vaccination', label: 'Vaccination' },
          { value: 'Sensibilisation', label: 'Sensibilisation' },
          { value: 'Distribution de médicaments', label: 'Distribution de médicaments' },
          { value: 'Désinfection', label: 'Désinfection' },
          { value: 'Formation', label: 'Formation' },
          { value: 'Autre', label: 'Autre' },
        ]}
        {...register('type_intervention')}
      />

      <div>
        <label className="label">Description</label>
        <textarea rows={3} className="input" {...register('description')} />
        {errors.description && (
          <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date de début"
          type="date"
          required
          error={errors.date_debut?.message}
          {...register('date_debut')}
        />

        <Input
          label="Date de fin prévue"
          type="date"
          required
          error={errors.date_fin_prevue?.message}
          {...register('date_fin_prevue')}
        />
      </div>

      <Input
        label="Responsable"
        required
        error={errors.responsable?.message}
        {...register('responsable')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Personnes ciblées"
          type="number"
          {...register('nombre_personnes_ciblees', { valueAsNumber: true })}
        />

        <Input
          label="Budget prévu (Ar)"
          type="number"
          {...register('budget_prevu', { valueAsNumber: true })}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={createMutation.isPending}>
        Créer l'intervention
      </Button>
    </form>
  )
}

export default InterventionForm
