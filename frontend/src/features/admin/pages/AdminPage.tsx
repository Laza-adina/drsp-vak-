/**
 * 📄 Fichier: src/features/admin/pages/AdminPage.tsx
 * 📝 Description: Page d'administration complète
 * 🎯 Usage: Gestion utilisateurs + référentiels (Districts, Maladies, Centres)
 */

import React, { useState } from 'react'
import { Users, MapPin, Activity, Building2 } from 'lucide-react'
import Card from '@/components/common/Card'
import UsersManagementTab from '../components/UsersManagementTab'
import DistrictsTab from '../components/DistrictsTab'
import MaladiesTab from '../components/MaladiesTab'
import CentresSanteTab from '../components/CentresSanteTab'

// ========================================
// 📋 TYPES ONGLETS
// ========================================

type AdminTab = 'users' | 'districts' | 'maladies' | 'centres'

interface TabConfig {
  id: AdminTab
  label: string
  icon: React.ReactNode
  component: React.ReactNode
}

// ========================================
// 🏢 PAGE ADMIN
// ========================================

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: <Users size={20} />,
      component: <UsersManagementTab />
    },
    {
      id: 'districts',
      label: 'Districts',
      icon: <MapPin size={20} />,
      component: <DistrictsTab />
    },
    {
      id: 'maladies',
      label: 'Maladies',
      icon: <Activity size={20} />,
      component: <MaladiesTab />
    },
    {
      id: 'centres',
      label: 'Centres de Santé',
      icon: <Building2 size={20} />,
      component: <CentresSanteTab />
    },
  ]

  const activeTabConfig = tabs.find(tab => tab.id === activeTab)

  return (
    <div className="space-y-6">
      {/* ========================================
          📋 EN-TÊTE
          ======================================== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          ⚙️ Administration
        </h1>
        <p className="text-gray-600">
          Gestion des utilisateurs et des données référentielles
        </p>
      </div>

      {/* ========================================
          📑 NAVIGATION PAR ONGLETS
          ======================================== */}
      <Card padding={false}>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* ========================================
            📄 CONTENU DE L'ONGLET ACTIF
            ======================================== */}
        <div className="p-6">
          {activeTabConfig?.component}
        </div>
      </Card>
    </div>
  )
}

export default AdminPage
