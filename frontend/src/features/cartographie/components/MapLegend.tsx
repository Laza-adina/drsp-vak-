/**
 * 📄 Fichier: src/features/cartographie/components/MapLegend.tsx
 * 📝 Description: Légende de la carte
 * 🎯 Usage: Explication des symboles et couleurs
 */

import React from 'react'
import Card from '@/components/common/Card'

// ========================================
// 🏷️ COMPOSANT MAP LEGEND
// ========================================

const MapLegend: React.FC = () => {
  return (
    <Card className="bg-white/95 backdrop-blur">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Légende</h4>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-warning-500 rounded-full mr-2" />
          <span className="text-xs text-gray-700">Cas suspect</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-3 h-3 bg-danger-500 rounded-full mr-2" />
          <span className="text-xs text-gray-700">Cas confirmé</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-3 h-3 bg-success-500 rounded-full mr-2" />
          <span className="text-xs text-gray-700">Cas écarté</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-800 rounded-full mr-2" />
          <span className="text-xs text-gray-700">Décès</span>
        </div>
      </div>
    </Card>
  )
}

export default MapLegend
