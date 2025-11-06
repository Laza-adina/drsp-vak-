import React from 'react'
import Card from '@components/common/Card'
import { formatDate, formatNumber } from '@utils/formatters'

interface RapportPreviewProps {
  data: any
  type: 'hebdomadaire' | 'mensuel'
}

const RapportPreview: React.FC<RapportPreviewProps> = ({ data, type }) => {
  if (!data) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">
          Aucune donnée à prévisualiser. Veuillez sélectionner des filtres et cliquer sur "Générer l'aperçu".
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="prose max-w-none">
        <div className="text-center mb-8 pb-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Rapport {type === 'hebdomadaire' ? 'Hebdomadaire' : 'Mensuel'}
          </h1>
          <h2 className="text-xl text-gray-700">
            Direction Régionale de la Santé Publique - Vakinankaratra
          </h2>
          <p className="text-gray-600 mt-2">
            Surveillance Épidémiologique - {formatDate(new Date())}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé Exécutif</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total des cas</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatNumber(data.total_cas || 0)}
              </p>
            </div>
            <div className="bg-warning-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Nouveaux cas</p>
              <p className="text-2xl font-bold text-warning-600">
                {formatNumber(data.nouveaux_cas || 0)}
              </p>
            </div>
            <div className="bg-danger-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Décès</p>
              <p className="text-2xl font-bold text-danger-600">
                {formatNumber(data.deces || 0)}
              </p>
            </div>
            <div className="bg-success-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Guérisons</p>
              <p className="text-2xl font-bold text-success-600">
                {formatNumber(data.guerisons || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par maladie</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Maladie
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Cas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Décès
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Taux létalité
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.maladies?.map((maladie: any) => (
                  <tr key={maladie.nom}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {maladie.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatNumber(maladie.cas)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatNumber(maladie.deces)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {maladie.taux_letalite.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par district</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    District
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Cas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Population
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Taux incidence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.districts?.map((district: any) => (
                  <tr key={district.nom}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {district.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatNumber(district.cas)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatNumber(district.population)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {district.taux_incidence.toFixed(2)} / 100 000
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes actives</h3>
          {data.alertes?.length > 0 ? (
            <div className="space-y-3">
              {data.alertes.map((alerte: any, index: number) => (
                <div key={index} className="bg-danger-50 border-l-4 border-danger-500 p-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-danger-800">{alerte.type}</h4>
                      <p className="text-sm text-danger-700 mt-1">{alerte.description}</p>
                      <p className="text-xs text-danger-600 mt-2">
                        {alerte.district} - {formatDate(alerte.date_detection)}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-danger-200 text-danger-800 rounded">
                      {alerte.niveau_gravite}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucune alerte active</p>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recommandations et actions à mener
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.recommandations?.map((rec: string, index: number) => (
              <li key={index}>{rec}</li>
            )) || (
              <>
                <li>Renforcer la surveillance dans les districts à forte incidence</li>
                <li>Intensifier les activités de sensibilisation communautaire</li>
                <li>Assurer la disponibilité des intrants médicaux</li>
                <li>Former le personnel de santé sur les cas suspects</li>
              </>
            )}
          </ul>
        </div>

        <div className="mt-12 pt-6 border-t text-center text-sm text-gray-600">
          <p>
            Ce rapport a été généré automatiquement le {formatDate(new Date())} par le système de
            surveillance épidémiologique de la DRSP Vakinankaratra.
          </p>
          <p className="mt-2">
            Pour plus d'informations, contactez : surveillance.epidemio@drsp-vakinankaratra.mg
          </p>
        </div>
      </div>
    </Card>
  )
}

export default RapportPreview
