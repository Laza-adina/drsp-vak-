/**
 * 📄 Fichier: src/features/admin/components/CentresSanteTab.tsx
 * 📝 Description: Onglet gestion des centres de santé avec soft delete
 * 🎯 Usage: CRUD centres avec désactivation intelligente
 */

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, X, RefreshCw, Power, PowerOff } from 'lucide-react'
import { referentielsService } from '@/api/services/referentiels.service'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import CentreSanteForm from './CentreSanteForm'
import toast from 'react-hot-toast'
import type { CentreSante } from '@/types/cas.types'

const CentresSanteTab: React.FC = () => {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingCentre, setEditingCentre] = useState<CentreSante | null>(null)
  
  // ========================================
  // ✅ ÉTAT DU MODAL DE CONFIRMATION
  // ========================================
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [centreToDelete, setCentreToDelete] = useState<CentreSante | null>(null)
  
  // ✅ OPTION POUR VOIR LES CENTRES INACTIFS
  const [showInactive, setShowInactive] = useState(false)

  // Récupération
  const { data: centres = [], isLoading } = useQuery({
    queryKey: ['centres-sante', showInactive],
    queryFn: () => referentielsService.getCentresSante(showInactive),
  })

  const { data: districts = [] } = useQuery({
    queryKey: ['districts'],
    queryFn: () => referentielsService.getDistricts(),
  })

  // ========================================
  // 🗑️ MUTATION SUPPRESSION (avec soft delete)
  // ========================================
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referentielsService.deleteCentreSante(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['centres-sante'] })
      
      // ✅ GESTION INTELLIGENTE DES RÉPONSES
      if (data?.action === 'SOFT_DELETE') {
        toast.success(
          `${data.message}\n${data.cas_count} cas et ${data.users_count} utilisateur(s) associés.`,
          { 
            duration: 6000,
            icon: '⚠️',
            style: {
              background: '#FEF3C7',
              color: '#92400E',
            }
          }
        )
      } else if (data?.action === 'HARD_DELETE') {
        toast.success(
          'Centre supprimé définitivement (aucune dépendance)',
          { 
            icon: '🗑️',
            style: {
              background: '#DCFCE7',
              color: '#166534',
            }
          }
        )
      } else {
        toast.success('Opération effectuée avec succès')
      }
      
      setShowDeleteModal(false)
      setCentreToDelete(null)
    },
    onError: (error: any) => {
      console.error('Erreur suppression:', error)
      toast.error('Erreur lors de la suppression')
    },
  })

  // ========================================
  // ✅ MUTATION RÉACTIVATION
  // ========================================
  const reactivateMutation = useMutation({
    mutationFn: (id: number) => referentielsService.reactivateCentreSante(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['centres-sante'] })
      toast.success(
        `${data.message || 'Centre réactivé avec succès'}`,
        { icon: '✅' }
      )
    },
    onError: () => {
      toast.error('Erreur lors de la réactivation')
    },
  })

  // ========================================
  // 📝 HANDLERS
  // ========================================
  const handleAdd = () => {
    setEditingCentre(null)
    setShowForm(true)
  }

  const handleEdit = (centre: CentreSante) => {
    setEditingCentre(centre)
    setShowForm(true)
  }

  // ✅ OUVRIR LE MODAL DE SUPPRESSION
  const handleDelete = (centre: CentreSante) => {
    setCentreToDelete(centre)
    setShowDeleteModal(true)
  }

  // ✅ CONFIRMER LA SUPPRESSION
  const confirmDelete = () => {
    if (centreToDelete) {
      deleteMutation.mutate(centreToDelete.id)
    }
  }

  // ✅ ANNULER LA SUPPRESSION
  const cancelDelete = () => {
    setShowDeleteModal(false)
    setCentreToDelete(null)
  }

  // ✅ RÉACTIVER UN CENTRE
  const handleReactivate = (centre: CentreSante) => {
    if (window.confirm(`Réactiver le centre "${centre.nom}" ?`)) {
      reactivateMutation.mutate(centre.id)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCentre(null)
  }

  const getDistrictName = (districtId: number) => {
    const district = districts.find(d => d.id === districtId)
    return district?.nom || 'N/A'
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Centres de Santé
          </h2>
          <p className="text-sm text-gray-600">
            {centres.length} centre{centres.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* ✅ TOGGLE AFFICHER INACTIFS */}
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
              showInactive
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {showInactive ? <Power size={16} /> : <PowerOff size={16} />}
            <span className="text-sm">
              {showInactive ? 'Masquer inactifs' : 'Voir inactifs'}
            </span>
          </button>

          {!showForm && (
            <Button variant="primary" onClick={handleAdd}>
              <Plus size={20} className="mr-2" />
              Nouveau centre
            </Button>
          )}
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCentre ? 'Modifier' : 'Nouveau centre de santé'}
          </h3>
          <CentreSanteForm
            initialData={editingCentre || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingCentre(null)
            }}
          />
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                District
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Coordonnées
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {centres.map((centre) => (
              <tr 
                key={centre.id} 
                className={`border-b hover:bg-gray-50 ${
                  centre.is_active === false ? 'bg-gray-50 opacity-60' : ''
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {centre.nom}
                  {centre.is_active === false && (
                    <span className="ml-2 text-xs text-gray-500">(Désactivé)</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {centre.type?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {getDistrictName(centre.district_id)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {centre.latitude && centre.longitude
                    ? `${centre.latitude.toFixed(4)}, ${centre.longitude.toFixed(4)}`
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {centre.is_active === false ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      Inactif
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Actif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {/* Si inactif : bouton réactiver */}
                  {centre.is_active === false ? (
                    <button
                      onClick={() => handleReactivate(centre)}
                      className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-colors"
                      title="Réactiver"
                      disabled={reactivateMutation.isPending}
                    >
                      <RefreshCw size={16} />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(centre)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(centre)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================
          ✅ MODAL DE CONFIRMATION SUPPRESSION
          ======================================== */}
      {showDeleteModal && centreToDelete && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={cancelDelete}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-xl max-w-lg w-full transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Suppression Intelligente
                  </h3>
                </div>
                <button
                  onClick={cancelDelete}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={deleteMutation.isPending}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Voulez-vous supprimer le centre{' '}
                  <span className="font-semibold text-gray-900">
                    {centreToDelete.nom}
                  </span>
                  {centreToDelete.type && (
                    <span className="text-gray-500"> ({centreToDelete.type})</span>
                  )}
                  {' '}?
                </p>
                
                {/* Encadré d'explication */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm font-semibold mb-2">
                    ℹ️ Comportement Intelligent :
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1.5 ml-4">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Si des cas ou utilisateurs associés</strong> : Le centre sera désactivé (soft delete) pour préserver l'historique</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Si aucune dépendance</strong> : Suppression définitive</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Réactivation possible</strong> : Les centres désactivés peuvent être réactivés ultérieurement</span>
                    </li>
                  </ul>
                </div>

                {/* Avertissement */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-800 text-sm">
                    ⚠️ <span className="font-semibold">Protection des données :</span> Cette approche garantit l'intégrité de vos données de santé.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-lg">
                <button
                  onClick={cancelDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <span>Confirmer</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CentresSanteTab
