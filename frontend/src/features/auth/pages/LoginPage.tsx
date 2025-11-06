/**
 * 📄 Fichier: src/features/auth/pages/LoginPage.tsx
 * 📝 Description: Page de connexion
 * 🎯 Usage: Authentification des utilisateurs
 */

import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

// ========================================
// 🔐 PAGE LOGIN
// ========================================

/**
 * Page de connexion avec formulaire et lien inscription
 */
const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ========================================
            🏷️ HEADER
            ======================================== */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
            <span className="text-primary-500 font-bold text-3xl">D</span>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue
          </h1>
          <p className="text-primary-100">
            Système de Surveillance Épidémiologique
          </p>
          <p className="text-primary-200 text-sm mt-1">
            DRSP Vakinankaratra
          </p>
        </div>

        {/* ========================================
            📋 FORMULAIRE DE CONNEXION
            ======================================== */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <LoginForm />

          {/* ========================================
              🔗 LIEN INSCRIPTION
              ======================================== */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* ========================================
            📄 FOOTER
            ======================================== */}
        <div className="mt-8 text-center text-primary-100 text-sm">
          <p>© 2024 DRSP Vakinankaratra</p>
          <p className="mt-1">Tous droits réservés</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
