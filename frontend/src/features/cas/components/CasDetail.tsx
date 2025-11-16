//frontend/src/features/cas/components/casDetails

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
import { usePermissions } from '@/hooks/usePermissions'

const CasDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { canEditCas } = usePermissions()

  // Charger le cas
  const { data: cas, isLoading, error } = useQuery({
    queryKey: ['cas', id],
    queryFn: () => casService.getById(Number(id)),
  })

  if (isLoading) {
    return <Loading message="Chargement..." />
  }

  if (error || !cas) {
    return (
      <ErrorMessage
        message="Cas introuvable"
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* EN-TETE */}
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
              {cas.numero_cas}  {/* ✅ Afficher le numéro de cas */}
            </h1>
            <p className="text-gray-600">{cas.maladie?.nom || '-'}</p>
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

      {/* INFOS GENERALES */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Informations générales
          </h3>
          <div className="flex space-x-2">
            <span className={
              cas.statut === 'confirme'
                ? 'badge badge-danger'
                : cas.statut === 'decede'
                ? 'badge bg-gray-800 text-white'
                : 'badge badge-primary'
            }>
              {cas.statut === 'confirme' && 'Confirmé'}
              {cas.statut === 'decede' && 'Décès'}
              {cas.statut !== 'confirme' && cas.statut !== 'decede' && cas.statut}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ✅ Patient avec NOM */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <User size={18} className="mr-2" />
              <span className="text-sm font-medium">Patient</span>
            </div>
            <p className="text-gray-900 font-medium">
              {cas.nom || 'Non renseigné'}  {/* ✅ AFFICHAGE DU NOM */}
            </p>
            <p className="text-sm text-gray-600">
              {cas.age !== undefined ? `${cas.age} ans` : '-'} • {cas.sexe === 'M' ? 'Masculin' : cas.sexe === 'F' ? 'Féminin' : '-'}
            </p>
          </div>

          {/* Maladie */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Activity size={18} className="mr-2" />
              <span className="text-sm font-medium">Maladie</span>
            </div>
            <p className="text-gray-900 font-medium">{cas.maladie?.nom || '-'}</p>
          </div>

          {/* Date début symptômes */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Calendar size={18} className="mr-2" />
              <span className="text-sm font-medium">Date début symptômes</span>
            </div>
            <p className="text-gray-900">{formatDate(cas.date_symptomes)}</p>
          </div>

          {/* Date notification */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Calendar size={18} className="mr-2" />
              <span className="text-sm font-medium">Date notification</span>
            </div>
            <p className="text-gray-900">{formatDate(cas.date_declaration)}</p>
          </div>

          {/* District */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin size={18} className="mr-2" />
              <span className="text-sm font-medium">District</span>
            </div>
            <p className="text-gray-900">{cas.district?.nom || '-'}</p>
          </div>

          {/* Centre de santé */}
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin size={18} className="mr-2" />
              <span className="text-sm font-medium">Centre de santé</span>
            </div>
            <p className="text-gray-900">{cas.centre_sante?.nom || '-'}</p>
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

        {/* Observations */}
        {cas.observations && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Observations</h4>
            <p className="text-gray-900">{cas.observations}</p>
          </div>
        )}
      </Card>

      {/* MÉTADONNÉES */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations système
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Créé le :</span>{' '}
            <span className="text-gray-900">{formatDateTime(cas.created_at)}</span>
          </div>
          {cas.updated_at && (
            <div>
              <span className="text-gray-600">Modifié le :</span>{' '}
              <span className="text-gray-900">{formatDateTime(cas.updated_at)}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default CasDetail
