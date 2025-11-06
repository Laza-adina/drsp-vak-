import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cartographieService } from '@api/services/cartographie.service'
import MapContainer from '@components/maps/MapContainer'
import MarkerCluster from '@components/maps/MarkerCluster'
import MapControls from './MapControls'
import MapLegend from './MapLegend'
import Loading from '@components/common/Loading'

interface MapViewProps {
  maladieId?: number
  districtId?: number
}

const MapView: React.FC<MapViewProps> = ({ maladieId, districtId }) => {
  const [layerType, setLayerType] = useState<'markers' | 'heatmap' | 'choropleth'>('markers')

  const { data: markers, isLoading } = useQuery({
    queryKey: ['markers', maladieId, districtId],
    queryFn: () => cartographieService.getMarkers(maladieId, districtId),
    enabled: layerType === 'markers',
  })

  if (isLoading) {
    return <Loading message="Chargement de la carte..." />
  }

  return (
    <div className="relative">
      <MapContainer height="600px">
        {layerType === 'markers' && <MarkerCluster markers={markers || []} />}
      </MapContainer>
      <MapControls layerType={layerType} onLayerChange={setLayerType} />
      <MapLegend layerType={layerType} />
    </div>
  )
}

export default MapView
