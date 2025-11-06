/**
 * 📄 Fichier: src/components/common/Card.tsx
 * 📝 Description: Composant carte réutilisable
 * 🎯 Usage: Container avec ombre et bordures arrondies
 */

import React from 'react'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
  hover?: boolean
  onClick?: () => void
}

// ========================================
// 🃏 COMPOSANT CARD
// ========================================

/**
 * Carte réutilisable pour encapsuler du contenu
 * 
 * @example
 * <Card>
 *   <h3>Titre</h3>
 *   <p>Contenu...</p>
 * </Card>
 * 
 * <Card hover onClick={() => navigate('/details')}>
 *   Carte cliquable
 * </Card>
 */
const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = true,
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg shadow-card',
        padding && 'p-6',
        hover && 'transition-shadow duration-200 hover:shadow-lg card-hover',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
