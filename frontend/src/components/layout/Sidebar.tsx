/**
 * 📄 Fichier: src/components/layout/Sidebar.tsx
 * 🔧 VERSION DEBUG - Affiche tous les menus
 */

import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Map,
  AlertTriangle,
  Briefcase,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/helpers'

interface MenuItem {
  name: string
  path: string
  icon: React.ElementType
}

const Sidebar: React.FC = () => {
  const { sidebarOpen, sidebarCollapsed, toggleSidebar, collapseSidebar, expandSidebar } = useUIStore()
  const { user } = useAuthStore()

  // ✅ TOUS LES MENUS (pas de filtrage pour debug)
  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Gestion des cas',
      path: '/cas',
      icon: FileText,
    },
    {
      name: 'Cartographie',
      path: '/cartographie',
      icon: Map,
    },
    {
      name: 'Alertes',
      path: '/alertes',
      icon: AlertTriangle,
    },
    {
      name: 'Interventions',
      path: '/interventions',
      icon: Briefcase,
    },
    {
      name: 'Statistiques',
      path: '/statistiques',
      icon: BarChart3,
    },
    {
      name: 'Rapports',
      path: '/rapports',
      icon: FileSpreadsheet,
    },
    {
      name: 'Administration',
      path: '/admin',
      icon: Settings,
    },
  ]

  // ✅ DEBUG: Afficher le rôle dans la console
  console.log('👤 User role:', user?.role)

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-transform duration-300',
        sidebarCollapsed ? 'w-20' : 'w-64',
        'bg-primary-500 text-white',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}
    >
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-600">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-500 font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight">DRSP</h1>
                <p className="text-xs text-primary-200">Vakinankaratra</p>
              </div>
            </div>
          )}

          <button
            onClick={() => (sidebarCollapsed ? expandSidebar() : collapseSidebar())}
            className="hidden lg:block p-1 hover:bg-primary-600 rounded transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar()
                      }
                    }}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center px-3 py-2.5 rounded-lg transition-colors',
                        'hover:bg-primary-600',
                        isActive && 'bg-primary-600',
                        sidebarCollapsed ? 'justify-center' : 'space-x-3'
                      )
                    }
                  >
                    <Icon size={20} />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* USER INFO */}
        {!sidebarCollapsed && user && (
          <div className="p-4 border-t border-primary-600">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-xs font-bold">
                {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs text-primary-200 truncate">{user.role}</p>
              </div>
            </div>
            <p className="text-xs text-primary-300 mt-2">Version 1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
