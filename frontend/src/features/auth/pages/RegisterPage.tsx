/**
 * 📄 Fichier: src/features/auth/pages/RegisterPage.tsx
 * 📝 Description: Page d'inscription
 * 🎯 Usage: Création de compte utilisateur
 */

import React from 'react'
import { Link } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'

// ========================================
// 📝 PAGE REGISTER
// ========================================

/**
 * Page d'inscription avec formulaire
 */
const RegisterPage: React.FC = () => {
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
            Créer un compte
          </h1>
          <p className="text-primary-100">
            Rejoignez le système de surveillance
          </p>
        </div>

        {/* ========================================
            📋 FORMULAIRE D'INSCRIPTION
            ======================================== */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <RegisterForm />

          {/* ========================================
              🔗 LIEN CONNEXION
              ======================================== */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* ========================================
            📄 FOOTER
            ======================================== */}
        <div className="mt-8 text-center text-primary-100 text-sm">
          <p>© 2024 DRSP Vakinankaratra</p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
