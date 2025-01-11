import { format } from 'date-fns'

export const parseDateTimeSafe = (x?: string | null | undefined) => (
  x ? new Date(x) : null
)

export const parseDateSafe = (x?: string | null | undefined) => {
  if (!x) return null
  return (new Date(x.substring(0, 10) + 'T00:00:00'))
}

export const parseDate = (x: string) => {
  return (new Date(x.substring(0, 10) + 'T00:00:00'))
}

export const parseDateServer = (x: string) => {
  return (new Date(x.substring(0, 10)))
}

export const serializeDate = (x: Date) => {
  return (format(x, 'yyyy-MM-dd') + 'T00:00:00')
}

export const serializeDateTimeSafe = (date?: Date | null | undefined) => (
  date ? date.toISOString() : null
)