import apiClient from '@/utils/apiClient'
import { SerializedModel } from '@/utils/types'
import { parseDateSafe } from '@/utils/utils'
import { EntryType } from '@prisma/client'
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createDraft, Draft, produce } from 'immer'

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
        queryKey: ['entry', 'now'],
      })
      queryClient.invalidateQueries({
        queryKey: ['entry', 'future'],
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
      queryClient.setQueriesData(
        { queryKey: ['entry'] },
        (prev?: InfiniteData<ListAPI<EntryData>>) => (
          getUpdatedListonMutation(data, prev)
        )
      )
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
    onSuccess: (data, id) => {
      queryClient.setQueriesData(
        { queryKey: ['entry'] },
        (prev?: InfiniteData<ListAPI<EntryData>>) => (
          getUpdatedListonDeleteMutation(id, prev)
        )
      )
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