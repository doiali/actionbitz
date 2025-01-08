'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 300000
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