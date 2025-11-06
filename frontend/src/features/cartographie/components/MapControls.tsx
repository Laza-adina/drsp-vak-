/**
 * 📄 Fichier: src/features/cartographie/components/MapControls.tsx
 * 📝 Description: Contrôles de la carte
 * 🎯 Usage: Boutons pour basculer entre les vues
 */

import React from 'react'
import { Map, Maximize, ZoomIn, ZoomOut } from 'lucide-react'
import Card from '@/components/common/Card'

// ========================================
// 🎮 COMPOSANT MAP CONTROLS
// ========================================

const MapControls: React.FC = () => {
  return (
    <Card className="p-2">
      <div className="flex flex-col space-y-2">
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Vue satellite"
        >
          <Map size={20} className="text-gray-600" />
        </button>
        
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Plein écran"
        >
          <Maximize size={20} className="text-gray-600" />
        </button>

        <div className="border-t border-gray-200 my-1" />
        
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoomer"
        >
          <ZoomIn size={20} className="text-gray-600" />
        </button>
        
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Dézoomer"
        >
          <ZoomOut size={20} className="text-gray-600" />
        </button>
      </div>
    </Card>
  )
}

export default MapControls
