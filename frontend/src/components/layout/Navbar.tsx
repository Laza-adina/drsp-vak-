/**
 * 📄 Fichier: src/components/layout/Navbar.tsx
 * 📝 Description: Barre de navigation supérieure
 * 🎯 Usage: Menu utilisateur, notifications, bouton menu mobile
 */

import React, { useState } from 'react'
import { Menu, Bell, LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/utils/helpers'
import { cn } from '@/utils/helpers'

// ========================================
// 🔝 COMPOSANT NAVBAR
// ========================================

/**
 * Navbar avec informations utilisateur et actions
 * Bouton menu pour mobile, profil et déconnexion
 */
const Navbar: React.FC = () => {
  const { user } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const { logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* ========================================
            📱 BOUTON MENU MOBILE
            ======================================== */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        {/* Spacer pour desktop */}
        <div className="hidden lg:block" />

        {/* ========================================
            👤 USER MENU
            ======================================== */}
        <div className="flex items-center space-x-4">
          {/* Notifications (placeholder) */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            {/* Badge notification */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          {/* Dropdown utilisateur */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {getInitials(user?.nom || '', user?.prenom || '')}
              </div>

              {/* Nom */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>

              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <>
                {/* Overlay pour fermer le dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      // TODO: Navigate to profile
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <UserIcon size={16} className="mr-3" />
                    Mon profil
                  </button>

                  <hr className="my-1 border-gray-200" />

                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      logout()
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
