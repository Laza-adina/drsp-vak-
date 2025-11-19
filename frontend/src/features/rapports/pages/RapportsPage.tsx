// src/features/rapports/pages/RapportsPage.tsx
/**
 * 📄 Fichier: src/features/rapports/pages/RapportsPage.tsx
 * 📝 Description: Page complète de génération de rapports avec IA
 * 🎯 Usage: Export rapports PDF, Excel, CSV
 */

import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { 
  FileText, Download, Calendar, Filter, TrendingUp, 
  AlertTriangle, Target, BarChart3, FileSpreadsheet
} from 'lucide-react'
import { rapportsService } from '@/api/services/rapports.service'
import { referentielsService } from '@/api/services/referentiels.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import toast from 'react-hot-toast'

const RapportsPage: React.FC = () => {
  // États
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [maladieId, setMaladieId] = useState<number>()
  const [districtId, setDistrictId] = useState<number>()
  const [annee, setAnnee] = useState(new Date().getFullYear())
  const [trimestre, setTrimestre] = useState<number>()

  // Queries
  const { data: maladies } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // Helper pour téléchargement
  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // MUTATIONS - Rapports PDF
  const rapportHebdomadaireMutation = useMutation({
    mutationFn: () => rapportsService.getRapportHebdomadairePDF(dateDebut, dateFin, districtId),
    onSuccess: (blob) => {
      downloadFile(blob, `rapport_hebdomadaire_${dateDebut}_${dateFin}.pdf`)
      toast.success('📄 Rapport hebdomadaire téléchargé')
    },
    onError: () => toast.error('Erreur lors de la génération du rapport')
  })

  const rapportInterventionsMutation = useMutation({
    mutationFn: () => rapportsService.getRapportInterventionsPDF(dateDebut, dateFin),
    onSuccess: (blob) => {
      downloadFile(blob, `rapport_interventions_${dateDebut}_${dateFin}.pdf`)
      toast.success('🎯 Rapport des interventions téléchargé')
    },
    onError: () => toast.error('Erreur lors de la génération du rapport')
  })

  const rapportPredictionsMutation = useMutation({
    mutationFn: () => rapportsService.getRapportPredictionsPDF(maladieId!, districtId),
    onSuccess: (blob) => {
      downloadFile(blob, `rapport_predictions_maladie_${maladieId}.pdf`)
      toast.success('🤖 Rapport de prédictions téléchargé')
    },
    onError: () => toast.error('Erreur lors de la génération du rapport')
  })

  const rapportGlobalMutation = useMutation({
    mutationFn: () => rapportsService.getRapportGlobalPDF(annee, trimestre),
    onSuccess: (blob) => {
      downloadFile(blob, `rapport_global_${annee}${trimestre ? '_T'+trimestre : ''}.pdf`)
      toast.success('📈 Rapport global téléchargé')
    },
    onError: () => toast.error('Erreur lors de la génération du rapport')
  })

  // MUTATIONS - Exports Excel/CSV
  const exportExcelMutation = useMutation({
    mutationFn: () => rapportsService.exportExcel(dateDebut, dateFin, maladieId),
    onSuccess: (blob) => {
      downloadFile(blob, `export_cas_${Date.now()}.xlsx`)
      toast.success('📊 Export Excel téléchargé')
    },
  })

  const exportCSVMutation = useMutation({
    mutationFn: () => rapportsService.exportCSV(dateDebut, dateFin, maladieId),
    onSuccess: (blob) => {
      downloadFile(blob, `export_cas_${Date.now()}.csv`)
      toast.success('📊 Export CSV téléchargé')
    },
  })

  const exportAlertesExcelMutation = useMutation({
    mutationFn: () => rapportsService.exportAlertesExcel(dateDebut, dateFin),
    onSuccess: (blob) => {
      downloadFile(blob, `export_alertes_${Date.now()}.xlsx`)
      toast.success('🚨 Export des alertes téléchargé')
    },
  })

  const exportInterventionsExcelMutation = useMutation({
    mutationFn: () => rapportsService.exportInterventionsExcel(dateDebut, dateFin),
    onSuccess: (blob) => {
      downloadFile(blob, `export_interventions_${Date.now()}.xlsx`)
      toast.success('🎯 Export des interventions téléchargé')
    },
  })

  return (
    <div className="space-y-6">
      {/* EN-TÊTE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📄 Rapports et Exports</h1>
        <p className="text-gray-600">
          Générez des rapports intelligents avec analyse IA et exportez vos données
        </p>
      </div>

      {/* FILTRES GÉNÉRAUX */}
      <Card className="bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres généraux</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="📅 Date de début"
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />

          <Input
            label="📅 Date de fin"
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />

          <Select
            label="Maladie (optionnel)"
            placeholder="Toutes les maladies"
            value={maladieId || ''}
            onChange={(e) => setMaladieId(e.target.value ? Number(e.target.value) : undefined)}
            options={maladies?.map((m: any) => ({ value: m.id, label: m.nom })) || []}
          />

          <Select
            label=" District (optionnel)"
            placeholder="Tous les districts"
            value={districtId || ''}
            onChange={(e) => setDistrictId(e.target.value ? Number(e.target.value) : undefined)}
            options={districts?.map((d: any) => ({ value: d.id, label: d.nom })) || []}
          />
        </div>
      </Card>

      {/* RAPPORTS PDF AVEC IA */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">📊 Rapports PDF avec Analyse IA</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rapport Hebdomadaire */}
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <Calendar className="text-blue-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Rapport Hebdomadaire</h4>
                <p className="text-sm text-gray-600">
                  Analyse épidémiologique de la semaine avec recommandations IA
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => rapportHebdomadaireMutation.mutate()}
              loading={rapportHebdomadaireMutation.isPending}
              disabled={!dateDebut || !dateFin}
              fullWidth
            >
              <FileText size={18} className="mr-2" />
              Générer PDF
            </Button>
          </div>

          {/* Rapport Interventions */}
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <Target className="text-green-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Rapport des Interventions</h4>
                <p className="text-sm text-gray-600">
                  Analyse de l'efficacité des interventions menées
                </p>
              </div>
            </div>
            <Button
              variant="success"
              onClick={() => rapportInterventionsMutation.mutate()}
              loading={rapportInterventionsMutation.isPending}
              disabled={!dateDebut || !dateFin}
              fullWidth
            >
              <FileText size={18} className="mr-2" />
              Générer PDF
            </Button>
          </div>

          {/* Rapport Prédictions */}
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <TrendingUp className="text-purple-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Rapport de Prédictions IA</h4>
                <p className="text-sm text-gray-600">
                  Prédictions Prophet avec analyses avancées
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => rapportPredictionsMutation.mutate()}
              loading={rapportPredictionsMutation.isPending}
              disabled={!maladieId}
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              <FileText size={18} className="mr-2" />
              Générer PDF
            </Button>
          </div>

          {/* Rapport Global */}
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <BarChart3 className="text-orange-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Rapport Global du Système</h4>
                <p className="text-sm text-gray-600">
                  Vue d'ensemble annuelle ou trimestrielle
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Input
                label="Année"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(Number(e.target.value))}
                min={2020}
                max={2030}
              />
              <Select
                label="Trimestre"
                placeholder="Annuel"
                value={trimestre || ''}
                onChange={(e) => setTrimestre(e.target.value ? Number(e.target.value) : undefined)}
                options={[
                  { value: 1, label: 'T1 (Jan-Mar)' },
                  { value: 2, label: 'T2 (Avr-Juin)' },
                  { value: 3, label: 'T3 (Juil-Sept)' },
                  { value: 4, label: 'T4 (Oct-Déc)' }
                ]}
              />
            </div>
            <Button
              variant="primary"
              onClick={() => rapportGlobalMutation.mutate()}
              loading={rapportGlobalMutation.isPending}
              fullWidth
              className="bg-orange-600 hover:bg-orange-700"
            >
              <FileText size={18} className="mr-2" />
              Générer PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* EXPORTS EXCEL/CSV */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FileSpreadsheet size={20} className="text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">📊 Exports de Données</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Export Cas Excel */}
          <Button
            variant="success"
            onClick={() => exportExcelMutation.mutate()}
            loading={exportExcelMutation.isPending}
            fullWidth
          >
            <Download size={18} className="mr-2" />
            Cas en Excel
          </Button>

          {/* Export Cas CSV */}
          <Button
            variant="secondary"
            onClick={() => exportCSVMutation.mutate()}
            loading={exportCSVMutation.isPending}
            fullWidth
          >
            <Download size={18} className="mr-2" />
            Cas en CSV
          </Button>

          {/* Export Alertes */}
          <Button
            variant="danger"
            onClick={() => exportAlertesExcelMutation.mutate()}
            loading={exportAlertesExcelMutation.isPending}
            fullWidth
          >
            <AlertTriangle size={18} className="mr-2" />
            Alertes en Excel
          </Button>

          {/* Export Interventions */}
          <Button
            variant="success"
            onClick={() => exportInterventionsExcelMutation.mutate()}
            loading={exportInterventionsExcelMutation.isPending}
            fullWidth
          >
            <Target size={18} className="mr-2" />
            Interventions en Excel
          </Button>
        </div>
      </Card>

      {/* INFORMATIONS */}
      <Card className="bg-yellow-50 border border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">💡 Informations</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Les rapports PDF incluent des analyses IA automatiques</li>
              <li>• Les exports Excel/CSV contiennent les données brutes filtrées</li>
              <li>• Sélectionnez les filtres avant de générer un rapport</li>
              <li>• Les rapports globaux couvrent toute la région de Vakinankaratra</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RapportsPage
