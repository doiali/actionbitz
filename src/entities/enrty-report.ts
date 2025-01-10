import apiClient from '@/utils/apiClient'
import { serializeDate } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { startOfToday, startOfTomorrow } from 'date-fns'

export type EntryReport = {
  count: number,
  completed: number,
  days: number,
  totalDays: number,
  daysActive: number,
}

export type EntryReportParams = {
  from?: Date
  to?: Date
}

const getEntryReportSearchParams = (params: EntryReportParams) => {
  const searchParams = new URLSearchParams()
  if (params.from) searchParams.set('from', serializeDate(params.from))
  if (params.to) searchParams.set('to', serializeDate(params.to))
  return searchParams
}

export const getReportParamsByTab = (tab: 'now' | 'past' | 'future' = 'now') => {
  if (tab === 'now') return { from: startOfToday(), to: startOfTomorrow() }
  if (tab === 'past') return { to: startOfToday() }
  if (tab === 'future') return { from: startOfTomorrow() }
  return {}
}

export const useEntryReport = (tab: 'now' | 'past' | 'future' = 'now') => {
  const params = getReportParamsByTab(tab)
  return useQuery<EntryReport>({
    queryKey: ['entry/report', params],
    queryFn: () => apiClient.get<EntryReport>(`entry/report?${getEntryReportSearchParams(params)}`).json(),
  })
}