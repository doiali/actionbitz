'use client'

import { AppSidebar } from '@/components/app-sidebar'
import ProtectedPage from '@/components/ProtectedPage'
import ThemeToggle from '@/components/ThemeToggle'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex justify-between h-12 shrink-0 items-center gap-2 border-b px-4 relative">
            <SidebarTrigger className=" -ms-2" />
            <h1 className="grow text-center text-2xl">Action<span className="text-primary">Bitz</span></h1>
            <ThemeToggle className=" -me-2" />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedPage>
  )
}