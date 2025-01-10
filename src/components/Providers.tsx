'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: process.env.NODE_ENV === 'development' ? true : false,
      retry: 0,
      staleTime: process.env.NODE_ENV === 'development' ? 0 : 300000
    },
  },
})

export default function Providers({
  children
}: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient} >
      {children}
    </QueryClientProvider>
  )
}