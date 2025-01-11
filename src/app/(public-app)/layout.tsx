import AppBrand from '@/components/app-brand'
import ThemeToggle from '@/components/theme-toggle'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col w-full overflow-hidden min-h-[100vh]">
      <header className="h-10 flex items-center gap-2 p-2">
        <Link className="italic" href="/"><AppBrand /></Link>
        <span className="grow"></span>
        <ThemeToggle className="" />
      </header>
      <main className="grow flex flex-col">
        {children}
      </main>
      <footer className="p-2 md:p-4 flex flex-col gap-2 border-t">
        <div className="flex flex-wrap justify-center text-sm text-muted-foreground gap-4">
          <ul className="flex">
            <li className="px-2 border-e border-border inline-flex">
              <Link href="/terms-of-service">Terms</Link>
            </li>
            <li className="px-2">
              <Link href="/privacy-policy">Privacy</Link>
            </li>
          </ul>
          <p>
            &copy; {new Date().getFullYear()} ActionBitz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout