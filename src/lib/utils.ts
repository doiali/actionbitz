import { clsx, type ClassValue } from "clsx"
import { endOfToday, startOfToday } from 'date-fns'
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isPast = (date: Date) => {
  return date < startOfToday()
}

export const isNow = (date: Date) => {
  return date >= startOfToday() && date < endOfToday()
}

export const isFuture = (date: Date) => {
  return date >= endOfToday()
}
