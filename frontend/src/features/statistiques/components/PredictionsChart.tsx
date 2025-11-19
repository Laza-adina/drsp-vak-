// src/features/statistiques/components/PredictionsChart.tsx
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Sparkles, TrendingUp, TrendingDown, Minus, AlertTriangle, Check, Lightbulb } from 'lucide-react'
import { predictionsService } from '@/api/services/predictions.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import toast from 'react-hot-toast'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Line
} from 'recharts'

interface PredictionsChartProps {
  maladieId: number
  districtId?: number
}

const PredictionsChart: React.FC<PredictionsChartProps> = ({ maladieId, districtId }) => {
  const [horizon, setHorizon] = useState<7 | 14 | 30>(14)
  const [predictionData, setPredictionData] = useState<any>(null)

  const generateMutation = useMutation({
    mutationFn: () => predictionsService.generer({
      maladie_id: maladieId,
      district_id: districtId,
      horizon_jours: horizon,
      jours_historique: 90
    }),
    onSuccess: (data) => {
      if (data.success) {
        setPredictionData(data)
        toast.success('Prédictions générées avec succès')
      } else {
        toast.error(data.error || 'Erreur lors de la génération')
      }
    },
    onError: () => {
      toast.error('Erreur lors de la génération des prédictions')
    }
  })

  const chartData = predictionData ? [
    ...predictionData.historique.map((h: any) => ({
      date: h.date,
      'Cas réels': h.cas_reels,
      'Prédiction': h.cas_predits,
      'Intervalle min': h.intervalle_min,
      'Intervalle max': h.intervalle_max,
      type: 'historique'
    })),
    ...predictionData.predictions.map((p: any) => ({
      date: p.date,
      'Cas réels': null,
      'Prédiction': p.cas_predits,
      'Intervalle min': p.intervalle_min,
      'Intervalle max': p.intervalle_max,
      type: 'prediction'
    }))
  ] : []

  const metriques = predictionData?.metriques

  const TendanceIcon = metriques?.tendance === 'hausse' 
    ? TrendingUp 
    : metriques?.tendance === 'baisse' 
    ? TrendingDown 
    : Minus

  return (
    <Card>
      {/* EN-TÊTE */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              🤖 Prédictions IA avec Prophet
            </h3>
            <p className="text-sm text-gray-600">
              Modèle de prévision de Meta (Facebook)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value) as 7 | 14 | 30)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value={7}>7 jours</option>
            <option value={14}>14 jours</option>
            <option value={30}>30 jours</option>
          </select>

          <Button
            variant="primary"
            onClick={() => generateMutation.mutate()}
            loading={generateMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles size={16} className="mr-2" />
            Générer prédictions
          </Button>
        </div>
      </div>

      {/* LOADING */}
      {generateMutation.isPending && <Loading message="Génération des prédictions..." />}

      {/* RÉSULTATS */}
      {predictionData && (
        <>
          {/* MÉTRIQUES */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Précision (MAPE)</p>
              <p className="text-2xl font-bold text-blue-600">
                {(100 - metriques.mape).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Confiance</p>
              <p className="text-2xl font-bold text-purple-600">
                {(metriques.confiance_score * 100).toFixed(0)}%
              </p>
            </div>
            <div className={`p-4 rounded-lg ${
              metriques.tendance === 'hausse' ? 'bg-red-50' :
              metriques.tendance === 'baisse' ? 'bg-green-50' :
              'bg-gray-50'
            }`}>
              <p className="text-sm text-gray-600">Tendance</p>
              <div className="flex items-center gap-2">
                <TendanceIcon size={20} className={
                  metriques.tendance === 'hausse' ? 'text-red-600' :
                  metriques.tendance === 'baisse' ? 'text-green-600' :
                  'text-gray-600'
                } />
                <p className="text-lg font-bold capitalize">
                  {metriques.tendance}
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Horizon</p>
              <p className="text-2xl font-bold text-gray-900">
                {horizon}j
              </p>
            </div>
          </div>

          {/* 🤖 ANALYSE IA */}
          {predictionData?.analyse_ia && (
            <div className="mb-6">
              {/* ALERTE PRINCIPALE */}
              <div className={`p-4 rounded-lg border-l-4 mb-4 ${
                predictionData.analyse_ia.niveau_alerte === 'danger' 
                  ? 'bg-red-50 border-red-500'
                  : predictionData.analyse_ia.niveau_alerte === 'attention'
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-green-50 border-green-500'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {predictionData.analyse_ia.niveau_alerte === 'danger' ? (
                      <AlertTriangle size={24} className="text-red-600" />
                    ) : predictionData.analyse_ia.niveau_alerte === 'attention' ? (
                      <AlertTriangle size={24} className="text-orange-600" />
                    ) : (
                      <Check size={24} className="text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${
                      predictionData.analyse_ia.niveau_alerte === 'danger' 
                        ? 'text-red-900'
                        : predictionData.analyse_ia.niveau_alerte === 'attention'
                        ? 'text-orange-900'
                        : 'text-green-900'
                    }`}>
                      Analyse IA des prédictions
                    </h4>
                    <p className={`text-sm ${
                      predictionData.analyse_ia.niveau_alerte === 'danger' 
                        ? 'text-red-800'
                        : predictionData.analyse_ia.niveau_alerte === 'attention'
                        ? 'text-orange-800'
                        : 'text-green-800'
                    }`}>
                      {predictionData.analyse_ia.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATISTIQUES PRÉDITES */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Moyenne prévue</p>
                  <p className="text-xl font-bold text-gray-900">
                    {predictionData.analyse_ia.statistiques.moyenne_predite} cas
                  </p>
                </div>
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Maximum prévu</p>
                  <p className="text-xl font-bold text-gray-900">
                    {predictionData.analyse_ia.statistiques.max_predit} cas
                  </p>
                </div>
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Tendance</p>
                  <p className={`text-xl font-bold capitalize ${
                    predictionData.analyse_ia.statistiques.tendance === 'hausse' 
                      ? 'text-red-600'
                      : predictionData.analyse_ia.statistiques.tendance === 'baisse'
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}>
                    {predictionData.analyse_ia.statistiques.tendance === 'hausse' ? '📈' : 
                     predictionData.analyse_ia.statistiques.tendance === 'baisse' ? '📉' : '➡️'}{' '}
                    {predictionData.analyse_ia.statistiques.tendance}
                  </p>
                </div>
              </div>

              {/* RECOMMANDATIONS */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb size={18} className="text-purple-600" />
                  Recommandations IA
                </h5>
                <ul className="space-y-2">
                  {predictionData.analyse_ia.recommandations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FIABILITÉ */}
              <div className={`p-3 rounded-lg border ${
                predictionData.analyse_ia.fiabilite.couleur === 'green'
                  ? 'bg-green-50 border-green-200'
                  : predictionData.analyse_ia.fiabilite.couleur === 'orange'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${
                      predictionData.analyse_ia.fiabilite.couleur === 'green'
                        ? 'text-green-900'
                        : predictionData.analyse_ia.fiabilite.couleur === 'orange'
                        ? 'text-orange-900'
                        : 'text-red-900'
                    }`}>
                      {predictionData.analyse_ia.fiabilite.texte}
                    </p>
                    {predictionData.analyse_ia.fiabilite.detail && (
                      <p className="text-xs text-gray-600">
                        {predictionData.analyse_ia.fiabilite.detail}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          predictionData.analyse_ia.fiabilite.couleur === 'green'
                            ? 'bg-green-500'
                            : predictionData.analyse_ia.fiabilite.couleur === 'orange'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${predictionData.analyse_ia.fiabilite.score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {(predictionData.analyse_ia.fiabilite.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GRAPHIQUE */}
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              
              <Area
                type="monotone"
                dataKey="Intervalle max"
                stroke="none"
                fill="#c7d2fe"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="Intervalle min"
                stroke="none"
                fill="white"
                fillOpacity={1}
              />
              
              <Line
                type="monotone"
                dataKey="Cas réels"
                stroke="#1f2937"
                strokeWidth={2}
                dot={{ fill: '#1f2937', r: 4 }}
                name="Cas réels (historique)"
              />
              
              <Line
                type="monotone"
                dataKey="Prédiction"
                stroke="#7c3aed"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#7c3aed', r: 4 }}
                name="Prédictions IA"
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* LÉGENDE */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-semibold text-gray-900 mb-2">📊 Interprétation</p>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Ligne noire continue</strong> : Cas réels observés</li>
              <li>• <strong>Ligne violette pointillée</strong> : Prédictions du modèle Prophet</li>
              <li>• <strong>Zone violette claire</strong> : Intervalle de confiance à 95%</li>
              <li>• <strong>MAPE</strong> : Erreur moyenne absolue en pourcentage (plus bas = mieux)</li>
            </ul>
          </div>
        </>
      )}
    </Card>
  )
}

export default PredictionsChart
