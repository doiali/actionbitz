import apiClient from '@/utils/apiClient'
import { SerializedModel } from '@/utils/types'
import { parseDateSafe } from '@/utils/utils'
import { EntryType } from '@prisma/client'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

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
  completed: boolean
  datetime: Date
}

export type EntryData = EntryCreate & {
  id: number
  createdAt?: Date | null
  updatedAt?: Date | null
  userId?: string
}

export type EntryJson = SerializedModel<EntryData>

export const getInitialEntry: () => EntryCreate = () => ({
  title: '',
  type: 'TODO',
  description: '',
  completed: false,
  datetime: new Date(),
})

export const deserializeEntry: (e: EntryJson) => EntryData = (entry: EntryJson) => {
  return {
    ...entry,
    datetime: new Date(entry.datetime),
    createdAt: parseDateSafe(entry.createdAt),
    updatedAt: parseDateSafe(entry.updatedAt),
  }
}

const LIMIT = 25

export const useEntryList = (type: 'past' | 'now' | 'future' = 'now') => {
  let path = 'entry/now'
  if (type === 'past') path = 'entry/past'
  if (type === 'future') path = 'entry/future'

  const result = useInfiniteQuery<ListAPI<EntryData>>({
    queryKey: ['entry', type],
    queryFn: ({ pageParam }) => {
      const { limit, offset } = pageParam as { limit: number, offset: number }
      return apiClient.get<ListAPI<EntryJson>>(`${path}?limit=${limit}&offset=${offset}`).json()
        .then(({ data, ...rest }) => ({
          data: data.map(deserializeEntry),
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
    mutationFn: ({ title, description, datetime, type }: EntryCreate) => (
      apiClient.post<EntryJson>('entry', {
        json: {
          title,
          description: description || null,
          type: type || 'TODO',
          datetime: datetime.toISOString(),
          completed: false,
        } satisfies Omit<EntryJson, 'id'>
      }).json().then(d => deserializeEntry(d))
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['entry'],
      })
      onSuccess?.(data)
    },
  })
}

export const useEntryUpdate = ({ onSuccess }: { onSuccess?: (data: EntryData) => void } = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id, title, description, completed, type, datetime
    }: EntryCreate & { id: number }) => (
      apiClient.put<EntryJson>(`entry/${id}`, {
        json: {
          title,
          description: description || null,
          completed,
          type,
          datetime: datetime.toISOString(),
        } satisfies Omit<EntryJson, 'id'>
      }).json().then(d => deserializeEntry(d))
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['entry'],
      })
      onSuccess?.(data)
    },
  })
}

export const useEntryDelete = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => (
      apiClient.delete<null>(`entry/${id}`).json()
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entry'],
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