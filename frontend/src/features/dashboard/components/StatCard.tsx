/**
 * 📄 Fichier: src/features/dashboard/components/StatCard.tsx
 * 📝 Description: Carte de statistique avec icône et tendance
 * 🎯 Usage: Afficher un KPI (indicateur clé) dans le dashboard
 */

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from '@/components/common/Card'
import { formatNumber } from '@/utils/formatters'
import { cn } from '@/utils/helpers'

// ========================================
// 🎨 INTERFACE
// ========================================

interface StatCardProps {
  title: string
  value: number
  icon: React.ElementType
  color?: 'primary' | 'success' | 'warning' | 'danger'
  trend?: number // Variation en pourcentage (ex: +15, -5)
}

// ========================================
// 📊 COMPOSANT STAT CARD
// ========================================

/**
 * Carte de statistique avec icône colorée et tendance
 * 
 * @example
 * <StatCard
 *   title="Total des cas"
 *   value={250}
 *   icon={FileText}
 *   color="primary"
 *   trend={15}
 * />
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
}) => {
  // ========================================
  // 🎨 COULEURS PAR TYPE
  // ========================================
  const colorClasses = {
    primary: {
      bg: 'bg-primary-100',
      icon: 'text-primary-600',
      text: 'text-primary-600',
    },
    success: {
      bg: 'bg-success-100',
      icon: 'text-success-600',
      text: 'text-success-600',
    },
    warning: {
      bg: 'bg-warning-100',
      icon: 'text-warning-600',
      text: 'text-warning-600',
    },
    danger: {
      bg: 'bg-danger-100',
      icon: 'text-danger-600',
      text: 'text-danger-600',
    },
  }

  const colors = colorClasses[color]

  // ========================================
  // 📈 TENDANCE
  // ========================================
  const isPositive = trend && trend > 0
  const isNegative = trend && trend < 0

  // ========================================
  // 🎨 RENDU
  // ========================================
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        {/* ========================================
            📊 INFORMATIONS
            ======================================== */}
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatNumber(value)}
          </p>

          {/* Tendance */}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive && (
                <>
                  <TrendingUp size={16} className="text-success-600 mr-1" />
                  <span className="text-sm text-success-600 font-medium">
                    +{trend}%
                  </span>
                </>
              )}
              {isNegative && (
                <>
                  <TrendingDown size={16} className="text-danger-600 mr-1" />
                  <span className="text-sm text-danger-600 font-medium">
                    {trend}%
                  </span>
                </>
              )}
              {!isPositive && !isNegative && (
                <span className="text-sm text-gray-500">Stable</span>
              )}
            </div>
          )}
        </div>

        {/* ========================================
            🎨 ICÔNE
            ======================================== */}
        <div className={cn('p-3 rounded-xl', colors.bg)}>
          <Icon size={28} className={colors.icon} />
        </div>
      </div>
    </Card>
  )
}

export default StatCard
