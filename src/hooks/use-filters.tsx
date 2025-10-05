import { useSearchParams } from "next/navigation"
import { useMemo, useCallback } from "react"

export type FilterConfig<T> = {
  parse: {
    [K in keyof T]: (value: string | null) => T[K]
  }
}

export type FilterProps<T> = {
  filters: T
  onChange<K extends keyof T>(name: K, value: T[K], options?: { push?: boolean }): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useGenericFilters<T extends Record<string, any>>(
  config: FilterConfig<T>,
): {
  filters: T
  onChange<K extends keyof T>(name: K, value: T[K], options?: { push?: boolean }): void
} {
  const searchParams = useSearchParams()

  const filters = useMemo(() => {
    const keys = Object.keys(config.parse) as (keyof T)[]
    const result = {} as T
    keys.forEach((key) => {
      const param = searchParams.get(key as string)
      result[key] = config.parse[key](param)
    })
    return result
  }, [searchParams, config])

  const onChange = useCallback<
    <K extends keyof T>(name: K, value: T[K], options?: { push?: boolean }) => void
  >((name, value, { push } = {}) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (value === null || value === undefined || value === "") {
        params.delete(name as string)
      } else {
        const defaultVal = config.parse[name](null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((value as any) instanceof Date) {
          if (defaultVal.toISOString() === value.toISOString()) params.delete(name as string)
          else params.set(name as string, value.toISOString())
        } else {
          if (defaultVal === value) params.delete(name as string)
          else params.set(name as string, String(value))
        }
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`
      if (push) window.history.pushState({}, "", newUrl)
      else window.history.replaceState({}, "", newUrl)
    }
  }, [config.parse])

  return { filters, onChange }
}
