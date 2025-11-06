import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { referentielsService } from '@api/services/users.service'
import Input from '@components/common/Input'
import Select from '@components/common/Select'

interface RapportFiltersProps {
  filters: any
  onFilterChange: (filters: any) => void
}

const RapportFilters: React.FC<RapportFiltersProps> = ({ filters, onFilterChange }) => {
  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: referentielsService.getDistricts,
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        type="date"
        label="Date début"
        value={filters.date_debut || ''}
        onChange={(e) => onFilterChange({ ...filters, date_debut: e.target.value })}
      />
      <Input
        type="date"
        label="Date fin"
        value={filters.date_fin || ''}
        onChange={(e) => onFilterChange({ ...filters, date_fin: e.target.value })}
      />
      <Select
        label="District"
        options={districts?.map((d: any) => ({ value: d.id, label: d.nom })) || []}
        value={filters.district_id || ''}
        onChange={(e) => onFilterChange({ ...filters, district_id: e.target.value })}
      />
    </div>
  )
}

export default RapportFilters
