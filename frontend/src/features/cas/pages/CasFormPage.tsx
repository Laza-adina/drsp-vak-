/**
 * 📄 Fichier: src/features/cas/pages/CasFormPage.tsx
 * 📝 Description: Page de création/modification d'un cas
 * 🎯 Usage: Formulaire pour ajouter ou éditer un cas
 */

import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { casService } from '@/api/services/cas.service'
import { ArrowLeft } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import CasForm from '../components/CasForm'

// ========================================
// 📝 PAGE CAS FORM
// ========================================

/**
 * Page pour créer ou modifier un cas
 * Mode déterminé par la présence d'un ID dans l'URL
 */
const CasFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  // ========================================
  // 📡 CHARGEMENT DU CAS (mode édition)
  // ========================================
  const {
    data: cas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cas', id],
    queryFn: () => casService.getById(Number(id)),
    enabled: isEditMode, // Charger uniquement en mode édition
  })

  // ========================================
  // ⏳ ÉTAT DE CHARGEMENT
  // ========================================
  if (isEditMode && isLoading) {
    return <Loading message="Chargement du cas..." />
  }

  // ========================================
  // ❌ GESTION D'ERREUR
  // ========================================
  if (isEditMode && error) {
    return (
      <ErrorMessage
        message="Erreur lors du chargement du cas"
        onRetry={() => window.location.reload()}
      />
    )
  }

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ========================================
          📋 EN-TÊTE
          ======================================== */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/cas')}
        >
          <ArrowLeft size={18} className="mr-2" />
          Retour
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Modifier le cas' : 'Nouveau cas'}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? `Modification du cas #${id}`
              : 'Enregistrer un nouveau cas de maladie'}
          </p>
        </div>
      </div>

      {/* ========================================
          📋 FORMULAIRE
          ======================================== */}
      <Card>
        <CasForm
          initialData={cas}
          onSuccess={() => navigate('/cas')}
        />
      </Card>
    </div>
  )
}

export default CasFormPage
