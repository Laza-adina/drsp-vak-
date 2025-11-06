/**
 * 📄 Fichier: src/components/layout/Layout.tsx
 * 📝 Description: Layout principal de l'application
 * 🎯 Usage: Structure avec sidebar et navbar pour toutes les pages protégées
 */

import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils/helpers'

// ========================================
// 🏗️ COMPOSANT LAYOUT
// ========================================

/**
 * Layout principal avec sidebar et navbar
 * Utilisé pour toutes les pages nécessitant une authentification
 */
const Layout: React.FC = () => {
  const { sidebarOpen, sidebarCollapsed } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========================================
          📂 SIDEBAR
          ======================================== */}
      <Sidebar />

      {/* ========================================
          📄 CONTENU PRINCIPAL
          ======================================== */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64',
          'min-h-screen'
        )}
      >
        {/* ========================================
            🔝 NAVBAR
            ======================================== */}
        <Navbar />

        {/* ========================================
            📄 CONTENU DE LA PAGE
            ======================================== */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Outlet pour afficher les pages enfants */}
            <Outlet />
          </div>
        </main>
      </div>

      {/* ========================================
          🌑 OVERLAY MOBILE (quand sidebar ouverte)
          ======================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => useUIStore.getState().toggleSidebar()}
        />
      )}
    </div>
  )
}

export default Layout
