import AppBrand from '@/components/app-brand'
import { AppSidebar } from '@/components/app-sidebar'
import ProtectedPage from '@/components/protected-page'
import ThemeToggle from '@/components/theme-toggle'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ActionBitz - Dashboard',
  robots: {
    follow: false,
    index: false,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky z-10 top-0 flex justify-between h-12 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className=" -ms-2" />
            <h1 className="grow text-center text-2xl italic"><AppBrand /></h1>
            <ThemeToggle className=" -me-2" />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedPage>
  )
}