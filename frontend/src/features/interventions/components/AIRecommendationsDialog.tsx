// src/features/interventions/components/AIRecommendationsDialog.tsx
import React, { useState } from 'react'
import { X, Lightbulb, Check, AlertTriangle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { interventionsService } from '@/api/services/interventions.service'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import toast from 'react-hot-toast'
import type { AIRecommendationResponse } from '@/types/interventions.types'

interface AIRecommendationsDialogProps {
  data: AIRecommendationResponse
  maladieId: number
  districtId: number
  onClose: () => void
  onSuccess: () => void
}

const AIRecommendationsDialog: React.FC<AIRecommendationsDialogProps> = ({
  data,
  maladieId,
  districtId,
  onClose,
  onSuccess,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const createMutation = useMutation({
    mutationFn: (recommandation: any) => 
      interventionsService.creerDepuisIA({
        recommandation,
        maladie_id: maladieId,
        district_id: districtId,
      }),
    onSuccess: () => {
      toast.success('Intervention créée depuis la recommandation IA')
      onSuccess()
    },
    onError: () => {
      toast.error('Erreur lors de la création')
    },
  })

  if (!data.success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-lg w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-red-600">❌ Erreur IA</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-700">{data.error}</p>
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const recommandations = data.data.interventions

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-5xl w-full my-8">
        <Card className="bg-white">
          {/* EN-TÊTE */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Lightbulb size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recommandations IA
                </h2>
                <p className="text-sm text-gray-600">
                  {recommandations.length} interventions suggérées
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* ANALYSE GLOBALE */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="font-bold text-gray-900 mb-2">📊 Analyse de la situation</h3>
            <p className="text-gray-700">{data.data.analyse_globale}</p>
          </div>

          {/* RISQUES IDENTIFIÉS */}
          {data.data.risques_identifies.length > 0 && (
            <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle size={18} />
                Risques identifiés
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {data.data.risques_identifies.map((risque, idx) => (
                  <li key={idx} className="text-gray-700">{risque}</li>
                ))}
              </ul>
            </div>
          )}

          {/* RECOMMANDATIONS */}
          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-lg text-gray-900">💡 Interventions recommandées</h3>
            
            {recommandations.map((rec, index) => (
              <Card 
                key={index}
                className={`border-2 transition-all cursor-pointer ${
                  selectedIndex === index 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                {/* Badge priorité */}
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-lg text-gray-900 flex-1">
                    {rec.titre}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rec.priorite === 1 
                      ? 'bg-red-100 text-red-800' 
                      : rec.priorite === 2 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Priorité {rec.priorite}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-3">{rec.description}</p>

                {/* Justification */}
                <div className="p-3 bg-blue-50 rounded mb-3">
                  <p className="text-sm text-gray-700">
                    <strong>Justification:</strong> {rec.justification}
                  </p>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <span className="ml-2 text-gray-900">{rec.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Durée:</span>
                    <span className="ml-2 text-gray-900">{rec.duree_jours} jours</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Population cible:</span>
                    <span className="ml-2 text-gray-900">{rec.population_cible.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Budget estimé:</span>
                    <span className="ml-2 text-gray-900">{rec.budget_estime.toLocaleString()} Ar</span>
                  </div>
                </div>

                {/* Ressources */}
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-1">Ressources nécessaires:</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.ressources.map((ressource, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {ressource}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Indicateurs de succès */}
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-1">Indicateurs de succès:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {rec.indicateurs_succes.map((indicateur, idx) => (
                      <li key={idx}>{indicateur}</li>
                    ))}
                  </ul>
                </div>

                {/* Bouton sélection */}
                {selectedIndex === index && (
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        createMutation.mutate(rec)
                      }}
                      loading={createMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Check size={18} className="mr-2" />
                      Créer cette intervention
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* RECOMMANDATIONS GÉNÉRALES */}
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded mb-6">
            <h3 className="font-bold text-gray-900 mb-2">✅ Recommandations générales</h3>
            <p className="text-gray-700">{data.data.recommandations_generales}</p>
          </div>

          {/* MÉTADONNÉES IA */}
          {data.model && (
            <div className="text-xs text-gray-500 text-center">
              Généré par {data.model} • {data.tokens} tokens utilisés
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AIRecommendationsDialog
