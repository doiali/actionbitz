import { EntryStatus } from '@prisma/client'
import { useGenericFilters, FilterConfig, FilterProps } from "@/hooks/use-filters"

export const useEntryFilters: () => EntryFilterProps = () => {
  return useGenericFilters<EntryFiltersType>(entryFiltersConfig)
}

export type EntryFiltersType = {
  status: EntryStatus | null
  q: string | null
}

type EntryFilterProps = FilterProps<EntryFiltersType>

const entryFiltersConfig: FilterConfig<EntryFiltersType> = {
  parse: {
    q: (v: string | null) => v || null,
    status: (v) => EntryStatus[(v as EntryStatus)] || null
  },
}
