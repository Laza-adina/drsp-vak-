/**
 * 📄 Fichier: src/features/cas/components/CasDetail.tsx
 * 📝 Description: Affichage détaillé d'un cas
 * 🎯 Usage: Vue complète des informations d'un cas
 */

import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { casService } from '@/api/services/cas.service'
import { ArrowLeft, Edit, MapPin, Calendar, User, Activity } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { getStatusColor } from '@/utils/helpers'
import { usePermissions } from '@/hooks/usePermissions'

// ========================================
// 👁️ COMPOSANT CAS DETAIL
// ========================================

/**
 * Affichage détaillé d'un cas spécifique
 */
const CasDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { canEditCas } = usePermissions()

  // ========================================
  // 📡 CHARGEMENT DU CAS
  // ========================================
  const { data: cas, isLoading, error } = useQuery({
    queryKey: ['cas', id],
    queryFn: () => casService.getById(Number(id)),
  })

  // ========================================
  // ⏳ ÉTAT DE CHARGEMENT
  // ========================================
  if (isLoading) {
    return <Loading message="Chargement..." />
  }

  // ========================================
  // ❌ GESTION D'ERREUR
  // ========================================
  if (error || !cas) {
    return (
      <ErrorMessage
        message="Cas introuvable"
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
      <div className="flex items-center justify-between">
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
              Cas #{cas.id}
            </h1>
            <p className="text-gray-600">{cas.maladie_nom}</p>
          </div>
        </div>

        {canEditCas && (
          <Button
            variant="primary"
            onClick={() => navigate(`/cas/${id}/modifier`)}
          >
            <Edit size={18} className="mr-2" />
            Modifier
          </Button>
        )}
      </div>

      {/* ========================================
          📊 INFORMATIONS GÉNÉRALES
          ======================================== */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Informations générales
          </h3>
          <div className="flex space-x-2">
            <span className={`badge badge-${getStatusColor(cas.statut)}`}>
              {cas.statut}
            </span>
            {cas.cas_confirme && (
              <span className="badge badge-danger">Confirmé</span>
            )}
            {cas.cas_deces && (
              <span className="badge bg-gray-800 text-white">Décès</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <User size={18} className="mr-2" />
              <span className="text-sm font-medium">Patient</span>
            </div>
            <p className="text-gray-900 font-medium">{cas.patient_nom}</p>
            <p className="text-sm text-gray-600">
              {cas.patient_age} ans • {cas.patient_sexe === 'M' ? 'Masculin' : 'Féminin'}
            </p>
          </div>

          {/* Maladie */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Activity size={18} className="mr-2" />
              <span className="text-sm font-medium">Maladie</span>
            </div>
            <p className="text-gray-900 font-medium">{cas.maladie_nom}</p>
          </div>

          {/* Dates */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Calendar size={18} className="mr-2" />
              <span className="text-sm font-medium">Date début symptômes</span>
            </div>
            <p className="text-gray-900">{formatDate(cas.date_debut_symptomes)}</p>
          </div>

          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Calendar size={18} className="mr-2" />
              <span className="text-sm font-medium">Date notification</span>
            </div>
            <p className="text-gray-900">{formatDate(cas.date_notification)}</p>
          </div>

          {/* Localisation */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin size={18} className="mr-2" />
              <span className="text-sm font-medium">District</span>
            </div>
            <p className="text-gray-900">{cas.district_nom}</p>
          </div>

          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin size={18} className="mr-2" />
              <span className="text-sm font-medium">Centre de santé</span>
            </div>
            <p className="text-gray-900">{cas.centre_sante_nom}</p>
          </div>
        </div>

        {/* Coordonnées GPS */}
        {cas.latitude && cas.longitude && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin size={18} className="mr-2" />
              <span className="text-sm font-medium">Coordonnées GPS</span>
            </div>
            <p className="text-gray-900">
              Latitude: {cas.latitude} • Longitude: {cas.longitude}
            </p>
          </div>
        )}

        {/* Commentaire */}
        {cas.commentaire && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Commentaire</h4>
            <p className="text-gray-900">{cas.commentaire}</p>
          </div>
        )}
      </Card>

      {/* ========================================
          ℹ️ MÉTADONNÉES
          ======================================== */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations système
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Créé le :</span>{' '}
            <span className="text-gray-900">{formatDateTime(cas.date_creation)}</span>
          </div>
          {cas.date_modification && (
            <div>
              <span className="text-gray-600">Modifié le :</span>{' '}
              <span className="text-gray-900">{formatDateTime(cas.date_modification)}</span>
            </div>
          )}
          {cas.utilisateur_nom && (
            <div>
              <span className="text-gray-600">Saisi par :</span>{' '}
              <span className="text-gray-900">{cas.utilisateur_nom}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default CasDetail
