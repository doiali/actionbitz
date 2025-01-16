import apiClient from '@/utils/apiClient'
import { SerializedModel } from '@/utils/types'
import { parseDate, parseDateTimeSafe, serializeDate, serializeDateTimeSafe } from '@/utils/utils'
import { EntryType } from '@prisma/client'
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createDraft, Draft, produce } from 'immer'
import { isEqual, startOfDay, startOfToday, startOfTomorrow } from 'date-fns'
import { EntryReport, getReportParamsByTab } from './enrty-report'

export type ListAPI<T> = {
  count: number,
  limit?: number,
  offset?: number,
  data: T[],
}

export type EntryCreate = {
  title: string
  type?: EntryType
  description?: string | null
  completed?: boolean
  date: Date
  datetime?: Date | null
}

export type EntryData = EntryCreate & {
  id: number
  createdAt?: Date | null
  updatedAt?: Date | null
  userId?: string
}

export type EntryJson = SerializedModel<EntryData>

export type EntryParams = {
  from?: Date
  to?: Date
  order?: 'asc' | 'desc'
}

const LIMIT = 30

export const getEntrySearchParams = (params: EntryParams) => {
  const searchParams = new URLSearchParams()
  if (params.from) searchParams.set('from', serializeDate(params.from))
  if (params.to) searchParams.set('to', serializeDate(params.to))
  if (params.order) searchParams.set('order', params.order)
  return searchParams
}

export const getParamsByTab: (tab?: 'now' | 'past' | 'future') => EntryParams = (tab = 'now') => {
  if (tab === 'now') return { from: startOfToday(), to: startOfTomorrow(), order: 'desc' }
  if (tab === 'past') return { to: startOfToday(), order: 'desc' }
  if (tab === 'future') return { from: startOfTomorrow(), order: 'asc' }
  return {}
}

export const getEntryTab: (entryDate: Date) => 'past' | 'now' | 'future' = (entryDate) => {
  const today = startOfToday()
  const tomorrow = startOfTomorrow()

  if (entryDate < today) return 'past'
  if (entryDate >= today && entryDate < tomorrow) return 'now'
  return 'future'
}

export const getInitialEntry: (date?: Date) => EntryCreate = (date) => ({
  title: '',
  type: 'TODO',
  description: '',
  completed: false,
  datetime: null,
  date: date ? startOfDay(date) : startOfToday(),
})

export const parseEntry: (e: EntryJson) => EntryData = (entry: EntryJson) => {
  return {
    ...entry,
    date: parseDate(entry.date),
    datetime: parseDateTimeSafe(entry.datetime),
    createdAt: parseDateTimeSafe(entry.createdAt),
    updatedAt: parseDateTimeSafe(entry.updatedAt),
  }
}

export const useEntryList = (tab: 'past' | 'now' | 'future' = 'now') => {
  const params = getParamsByTab(tab)
  const result = useInfiniteQuery<ListAPI<EntryData>>({
    queryKey: ['entry', params],
    queryFn: ({ pageParam }) => {
      const { limit, offset } = pageParam as { limit: number, offset: number }
      const searchParams = getEntrySearchParams(params)
      searchParams.set('limit', String(limit))
      searchParams.set('offset', String(offset))
      return apiClient.get<ListAPI<EntryJson>>(`entry?${searchParams}`).json()
        .then(({ data, ...rest }) => ({
          data: data.map(parseEntry),
          ...rest
        }))
    },
    initialPageParam: { limit: LIMIT, offset: 0 },
    getNextPageParam: createNextPageParamGetter(LIMIT),
  })

  const allData = useMemo(() => {
    const allData: EntryData[] = []
    result.data?.pages.forEach(page => {
      allData.push(...page.data)
    })
    return allData
  }, [result.data])

  return { allData, ...result }

}

export const useEntryCreate = ({ onSuccess }: { onSuccess?: (data: EntryData) => void } = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ title, description, datetime, type, date }: EntryCreate) => (
      apiClient.post<EntryJson>('entry', {
        json: {
          title,
          description: description || null,
          type: type || 'TODO',
          date: serializeDate(date),
          datetime: serializeDateTimeSafe(datetime),
          completed: false,
        } satisfies Omit<EntryJson, 'id'>
      }).json().then(d => parseEntry(d))
    ),
    onSuccess: (data) => {
      const tab = getEntryTab(data.date)

      // update report
      queryClient.setQueryData<EntryReport>(
        ['entry/report', getReportParamsByTab(tab)],
        (prev) => (prev ? {
          ...prev,
          count: prev.count + 1,
        } : undefined)
      )

      queryClient.invalidateQueries({
        queryKey: ['entry', getParamsByTab(tab)],
      })
      queryClient.invalidateQueries({
        queryKey: ['entry/report'],
      })
      onSuccess?.(data)
    },
  })
}

export const useEntryUpdate = ({ onSuccess }: { onSuccess?: (data: EntryData) => void } = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id, title, description, completed, type, datetime, date
    }: EntryCreate & { id: number, prev?: EntryData }) => (
      apiClient.put<EntryJson>(`entry/${id}`, {
        json: {
          title,
          description: description || null,
          completed,
          type,
          date: serializeDate(date),
          datetime: serializeDateTimeSafe(datetime),
        } satisfies Omit<EntryJson, 'id'>
      }).json().then(d => parseEntry(d))
    ),
    onSuccess: (data, { prev }) => {
      const isSameDate = prev && isEqual(data.date, prev.date)

      // update report
      const tab = getEntryTab(data.date)
      if (isSameDate && data.completed !== prev.completed) {
        queryClient.setQueriesData<EntryReport>(
          { queryKey: ['entry/report', getReportParamsByTab(tab)] },
          (prev) => (prev ? {
            ...prev,
            completed: prev.completed + (data.completed ? 1 : -1),
          } : undefined)
        )
      }

      // update the mutation item with changing the order
      queryClient.setQueriesData(
        { queryKey: ['entry'] },
        (prev?: InfiniteData<ListAPI<EntryData>>) => (
          getUpdatedListonMutation(data, prev)
        )
      )

      // minimize invalidation when the date is updated
      if (!isSameDate) {
        queryClient.invalidateQueries({
          queryKey: ['entry', getParamsByTab(tab)],
        })
        const prevTab = prev && getEntryTab(prev.date)
        if (!prevTab) {
          queryClient.invalidateQueries({
            queryKey: ['entry'],
          })
        } else if (prevTab !== tab) {
          queryClient.invalidateQueries({
            queryKey: ['entry', getParamsByTab(prevTab)],
          })
        }
      }

      // invalidate report
      queryClient.invalidateQueries({
        queryKey: ['entry/report'],
      })
      onSuccess?.(data)
    },
  })
}

export const useEntryDelete = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entry: EntryData) => (
      apiClient.delete<null>(`entry/${entry.id}`).json()
    ),
    onSuccess: (data, prevEntry) => {
      const tab = getEntryTab(prevEntry.date)

      // update report
      queryClient.setQueriesData<EntryReport>(
        { queryKey: ['entry/report', getReportParamsByTab(tab)] },
        (prev) => (prev ? {
          ...prev,
          count: prev.count - 1,
        } : undefined)
      )

      // update list
      queryClient.setQueriesData(
        { queryKey: ['entry'] },
        (prev?: InfiniteData<ListAPI<EntryData>>) => (
          getUpdatedListonDeleteMutation(prevEntry.id, prev)
        )
      )

      // invalidate all query, This can be obtimized
      queryClient.invalidateQueries({
        queryKey: ['entry', getParamsByTab(tab)],
      })
      queryClient.invalidateQueries({
        queryKey: ['entry/report'],
      })
      onSuccess?.()
    },
  })
}

const createNextPageParamGetter = (limit: number) => (
  lastPage: ListAPI<unknown>,
  allPages: ListAPI<unknown>[]
) => {
  const n = allPages.length
  const offset = n * limit
  if (offset < lastPage.count)
    return {
      limit: limit, offset,
    }
}

const getUpdatedListonMutation = (
  updatedData: EntryData,
  prev?: InfiniteData<ListAPI<EntryData>>
) => (
  prev ? produce(prev, (draft) => {
    for (const page of draft.pages) {
      for (const storedData of page.data) {
        if (storedData.id === updatedData.id) {
          Object.assign(storedData, updatedData)
          return
        }
      }
    }
  }) : undefined
)

const getUpdatedListonDeleteMutation = (
  updatedDataId: number,
  prev?: InfiniteData<ListAPI<EntryData>>
) => (
  prev ? produce(prev, (draft) => {
    for (const page of draft.pages) {
      page.data = page.data.filter(data => data.id !== updatedDataId)
    }
  }) : undefined
)

const addDataToPaginatedList = <TData extends Record<string, unknown> = EntryData>(
  newData: TData,
  prev: InfiniteData<ListAPI<TData>> | undefined,
  limit: number,
): InfiniteData<ListAPI<TData>> | undefined => {
  return prev ? produce(prev, (draft) => {
    let popedData: Draft<TData> | undefined = createDraft(newData)
    draft.pages.forEach((page) => {
      page.count = page.count + 1
      if (popedData) {
        page.data = [popedData, ...page.data]
        if (page.data.length > limit) {
          popedData = page.data.pop()
        } else {
          popedData = undefined
        }
      }
    })
  }) : { pages: [{ count: 1, data: [newData] }], pageParams: [] }
}

// TODO: This can't be used yet!
const RemoveDataFromPaginatedList = <TData extends { id: string | number } = EntryData>(
  id: string | number,
  prev: InfiniteData<ListAPI<TData>> | undefined,
  limit: number,
): InfiniteData<ListAPI<TData>> | undefined => {
  return prev ? produce(prev, (draft) => {
    let popedData: Draft<TData> | undefined
    draft.pages.forEach((page) => {
      page.count = page.count - 1
      if (popedData) {
        page.data = [popedData, ...page.data]
        if (page.data.length > limit) {
          popedData = page.data.pop()
        } else {
          popedData = undefined
        }
      }
    })
  }) : { pages: [{ count: 0, data: [] }], pageParams: [] }
}