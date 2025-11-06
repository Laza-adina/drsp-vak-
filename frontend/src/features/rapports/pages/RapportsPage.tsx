/**
 * 📄 Fichier: src/features/rapports/pages/RapportsPage.tsx
 * 📝 Description: Page de génération de rapports
 * 🎯 Usage: Exporter des rapports PDF, Excel, CSV
 */

import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FileText, Download } from 'lucide-react'
import { rapportsService } from '@/api/services/rapports.service'
import { referentielsService } from '@/api/services/users.service'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import { downloadFile } from '@/utils/helpers'
import toast from 'react-hot-toast'

const RapportsPage: React.FC = () => {
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [maladieId, setMaladieId] = useState<number>()

  const { data: maladies } = useQuery({
    queryKey: ['maladies'],
    queryFn: () => referentielsService.getMaladies(),
  })

  const exportPDFMutation = useMutation({
    mutationFn: () => rapportsService.exportPDF(dateDebut, dateFin, maladieId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      downloadFile(url, `rapport_${Date.now()}.pdf`)
      toast.success('Rapport PDF téléchargé')
    },
  })

  const exportExcelMutation = useMutation({
    mutationFn: () => rapportsService.exportExcel(dateDebut, dateFin, maladieId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      downloadFile(url, `rapport_${Date.now()}.xlsx`)
      toast.success('Rapport Excel téléchargé')
    },
  })

  const exportCSVMutation = useMutation({
    mutationFn: () => rapportsService.exportCSV(dateDebut, dateFin, maladieId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      downloadFile(url, `rapport_${Date.now()}.csv`)
      toast.success('Rapport CSV téléchargé')
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rapports et exports</h1>
        <p className="text-gray-600">Générer et exporter des rapports personnalisés</p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration du rapport</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date de début"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />

            <Input
              label="Date de fin"
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>

          <Select
            label="Filtrer par maladie (optionnel)"
            placeholder="Toutes les maladies"
            value={maladieId || ''}
            onChange={(e) => setMaladieId(e.target.value ? Number(e.target.value) : undefined)}
            options={maladies?.map((m: any) => ({ value: m.id, label: m.nom })) || []}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Formats d'export</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            onClick={() => exportPDFMutation.mutate()}
            loading={exportPDFMutation.isPending}
            fullWidth
          >
            <FileText size={20} className="mr-2" />
            Exporter en PDF
          </Button>

          <Button
            variant="success"
            onClick={() => exportExcelMutation.mutate()}
            loading={exportExcelMutation.isPending}
            fullWidth
          >
            <Download size={20} className="mr-2" />
            Exporter en Excel
          </Button>

          <Button
            variant="secondary"
            onClick={() => exportCSVMutation.mutate()}
            loading={exportCSVMutation.isPending}
            fullWidth
          >
            <Download size={20} className="mr-2" />
            Exporter en CSV
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default RapportsPage
