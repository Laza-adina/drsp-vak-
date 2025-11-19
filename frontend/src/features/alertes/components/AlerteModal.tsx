//src/features/alertes/components/AlerteModal.tsx

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, CheckCircle } from 'lucide-react'
import { alertesService } from '@/api/services/alertes.service'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'
import { formatDate } from '@/utils/formatters'

const alerteSchema = z.object({
  type_alerte: z.string().min(1, 'Type requis'),
  niveau_gravite: z.enum(['info', 'avertissement', 'alerte', 'critique']),
  maladie_id: z.number().min(1, 'Maladie requise'),
  district_id: z.number().min(1, 'District requis'),
  nombre_cas: z.number().min(1, 'Nombre de cas requis'),
  date_detection: z.string().min(1, 'Date requise'),
  description: z.string().min(10, 'Description trop courte (min 10 caractères)'),
  actions_recommandees: z.string().optional(),
  responsable: z.string().optional(),
})

type AlerteFormData = z.infer<typeof alerteSchema>

interface AlerteModalProps {
  alerteId?: number
  onClose: () => void
  onSuccess?: () => void
}

const AlerteModal: React.FC<AlerteModalProps> = ({ alerteId, onClose, onSuccess }) => {
  const queryClient = useQueryClient()
  const isEditMode = !!alerteId

  // Charger l'alerte si mode édition
  const { data: alerte } = useQuery({
    queryKey: ['alerte', alerteId],
    queryFn: () => alertesService.getById(alerteId!),
    enabled: isEditMode,
  })

  // Référentiels
  const { data: maladies = [] } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Formulaire
  const { register, handleSubmit, formState: { errors }, watch } = useForm<AlerteFormData>({
    resolver: zodResolver(alerteSchema),
    defaultValues: isEditMode && alerte ? {
      type_alerte: alerte.type_alerte,
      niveau_gravite: alerte.niveau_gravite,
      maladie_id: alerte.maladie_id,
      district_id: alerte.district_id,
      nombre_cas: alerte.nombre_cas,
      date_detection: alerte.date_detection,
      description: alerte.description,
      actions_recommandees: alerte.actions_recommandees || '',
      responsable: alerte.responsable || '',
    } : {
      date_detection: new Date().toISOString().split('T')[0],
    },
  })

  // Mutation création
  const createMutation = useMutation({
    mutationFn: (data: AlerteFormData) => alertesService.create(data),
    onSuccess: () => {
      toast.success('Alerte créée avec succès')
      onSuccess?.()
    },
    onError: () => toast.error('Erreur lors de la création'),
  })

  // Mutation résolution
  const resolveMutation = useMutation({
    mutationFn: ({ id, actions }: { id: number; actions: string }) =>
      alertesService.resolve(id, actions),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['alertes'] })  // ✅ Rafraîchir la liste

      toast.success('Alerte marquée comme résolue')
      onSuccess?.()
    },
  })

  const onSubmit = (data: AlerteFormData) => {
    createMutation.mutate(data)
  }

  const handleResolve = () => {
    if (!alerteId) return
    const actions = watch('actions_recommandees') || 'Aucune action spécifiée'
    resolveMutation.mutate({ id: alerteId, actions })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Détails de l\'alerte' : 'Nouvelle alerte'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Affichage mode lecture */}
            {isEditMode && alerte ? (
              <>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Statut</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      alerte.statut === 'active' ? 'bg-red-100 text-red-800' :
                      alerte.statut === 'en_cours' ? 'bg-orange-100 text-orange-800' :
                      alerte.statut === 'resolue' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alerte.statut}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Maladie: </span>
                    <span className="font-medium">{alerte.maladie?.nom}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">District: </span>
                    <span className="font-medium">{alerte.district?.nom}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Détectée le: </span>
                    <span className="font-medium">{formatDate(alerte.date_detection)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Nombre de cas: </span>
                    <span className="font-bold text-red-600">{alerte.nombre_cas}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{alerte.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actions recommandées
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    defaultValue={alerte.actions_recommandees || ''}
                    {...register('actions_recommandees')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsable
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    defaultValue={alerte.responsable || ''}
                    {...register('responsable')}
                  />
                </div>

                {/* Boutons d'action */}
                {alerte.statut === 'active' && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleResolve}
                      loading={resolveMutation.isPending}
                      className="flex-1"
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Marquer comme résolue
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Mode création */
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'alerte *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register('type_alerte')}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Épidémie">Épidémie</option>
                      <option value="Cluster">Cluster</option>
                      <option value="Augmentation inhabituelle">Augmentation inhabituelle</option>
                      <option value="Cas grave">Cas grave</option>
                      <option value="Décès multiple">Décès multiple</option>
                    </select>
                    {errors.type_alerte && (
                      <p className="text-red-600 text-sm mt-1">{errors.type_alerte.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau de gravité *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register('niveau_gravite')}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="info">🔵 Info</option>
                      <option value="avertissement">🟡 Avertissement</option>
                      <option value="alerte">🟠 Alerte</option>
                      <option value="critique">🔴 Critique</option>
                    </select>
                    {errors.niveau_gravite && (
                      <p className="text-red-600 text-sm mt-1">{errors.niveau_gravite.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maladie *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register('maladie_id', { valueAsNumber: true })}
                    >
                      <option value="">Sélectionner...</option>
                      {maladies.map((m: any) => (
                        <option key={m.id} value={m.id}>{m.nom}</option>
                      ))}
                    </select>
                    {errors.maladie_id && (
                      <p className="text-red-600 text-sm mt-1">{errors.maladie_id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register('district_id', { valueAsNumber: true })}
                    >
                      <option value="">Sélectionner...</option>
                      {districts.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.nom}</option>
                      ))}
                    </select>
                    {errors.district_id && (
                      <p className="text-red-600 text-sm mt-1">{errors.district_id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de cas *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register('nombre_cas', { valueAsNumber: true })}
                    />
                    {errors.nombre_cas && (
                      <p className="text-red-600 text-sm mt-1">{errors.nombre_cas.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de détection *
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      {...register('date_detection')}
                    />
                    {errors.date_detection && (
                      <p className="text-red-600 text-sm mt-1">{errors.date_detection.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Décrivez la situation épidémiologique..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actions recommandées
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mesures à prendre..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register('actions_recommandees')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsable
                  </label>
                  <input
                    type="text"
                    placeholder="Nom du responsable..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register('responsable')}
                  />
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={createMutation.isPending}
                    className="flex-1"
                  >
                    Créer l'alerte
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  )
}

export default AlerteModal
