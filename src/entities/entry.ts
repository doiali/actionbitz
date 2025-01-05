import apiClient from '@/utils/apiClient'
import { Entry } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useEntries = () => useQuery({
  queryKey: ['entry'],
  queryFn: () => apiClient.get<{ data: Entry[] }>('entry').json().then(({ data }) => ({
    data: data.map(d => ({ ...d, datetime: new Date(d.datetime) }))
  })),
})

export const useEntryCreate = ({ onSuccess }: { onSuccess?: (data: Entry) => void } = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ title, description, datetime }: Partial<Entry>) => (
      apiClient.post<Entry>('entry', {
        json: {
          title,
          description: description || null,
          datetime: datetime?.toISOString() || undefined,
        }
      }).json()
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['entry'],
      })
      onSuccess?.(data)
    },
  })
}

export const useEntryUpdate = ({ onSuccess }: { onSuccess?: (data: Entry) => void } = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, title, description, completed, type, datetime }: Partial<Entry>) => (
      apiClient.put<Entry>(`entry/${id}`, {
        json: {
          title,
          description: description || null,
          completed,
          type,
          datetime: datetime?.toISOString() || undefined,
        }
      }).json()
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