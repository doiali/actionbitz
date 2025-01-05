import apiClient from '@/utils/apiClient'
import { SerializedModel } from '@/utils/types'
import { parseDateSafe } from '@/utils/utils'
import { EntryType } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useEntries = () => useQuery<{ data: EntryData[] }>({
  queryKey: ['entry'],
  queryFn: () => (
    apiClient.get<{ data: EntryJson[] }>('entry').json()
      .then(({ data }) => ({
        data: data.map(deserializeEntry)
      }))
  ),
})

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