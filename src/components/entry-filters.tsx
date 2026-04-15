'use client'
import { useEffect, useState } from 'react'

import { ListFilter } from 'lucide-react'
import { EntryStatus } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEntryFilters } from '@/entities/entry-filters'
import { cn } from '@/lib/utils'

export function EntryFiltersAnchor({
  onToggle,
  className,
}: {
  onToggle: () => void
  className?: string
}) {
  const { filters } = useEntryFilters()
  const activeFiltersCount = Number(Boolean(filters.status)) + Number(Boolean(filters.q?.trim()))
  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={onToggle}
        aria-label="Toggle entry filters"
        className='relative [&_svg]:size-5'
      >
        <ListFilter />
        {activeFiltersCount > 0 && (
          <Badge className="absolute top-0 right-0 h-4 min-w-4 justify-center rounded-full px-1 text-[10px] leading-none">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}

export function EntryFiltersInputs({
  show,
  className,
}: {
  show: boolean
  className?: string
}) {
  const { filters, onChange } = useEntryFilters()
  const [search, setSearch] = useState(filters.q || '')

  useEffect(() => {
    setSearch(filters.q || '')
  }, [filters.q])

  useEffect(() => {
    const currentQ = filters.q || ''
    if (search === currentQ) return

    const timeout = setTimeout(() => {
      onChange('q', search || null)
    }, 500)

    return () => clearTimeout(timeout)
  }, [search, filters.q, onChange])
  if (!show) return null

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <Input
        name='search'
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        name='status'
        value={filters.status || ''}
        onChange={(e) => onChange('status', (e.target.value || null) as EntryStatus | null)}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">All status</option>
        <option value={EntryStatus.todo}>Todo</option>
        <option value={EntryStatus.ignored}>Ignored</option>
        <option value={EntryStatus.done}>Done</option>
      </select>
    </div>
  )
}

export default EntryFiltersAnchor
