'use client'
import AppBrand from '@/components/app-brand'
import ThemeToggle from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import clsx from 'clsx'
import Link from 'next/link'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { FaXTwitter } from 'react-icons/fa6'

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        backgroundSize: 'calc(100% - var(--removed-body-scroll-bar-size, 0px)) auto',
        backgroundAttachment: 'fixed',
      }}
      className="relative flex flex-col w-full overflow-hidden min-h-[100vh] dark:[background-image:url(/static/space4.jpg)]"
    >
      <div className="absolute w-full h-full bg-background/75" />
      <Header />
      <main className="relative grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}

const Header = () => {
  const [atTop, setAtTop] = useState(false)

  const prevTop = useRef(false)
  useEffect(() => {
    let prevScroll: number = window.scrollY
    const handleScroll = (event?: unknown, initialCall = false) => {
      const c = window.scrollY
      const diff = c - prevScroll
      prevScroll = c

      // handle atTop
      if ((diff || initialCall)) {
        if (c === 0) {
          prevTop.current = true
          setAtTop(true)
        }
        else if (prevTop.current) {
          prevTop.current = false
          setAtTop(false)
        }
      }
    }
    handleScroll(0, true)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <header
      className={clsx(
        'me-[var(--removed-body-scroll-bar-size,0)]',
        'fixed inset-x-0 z-50 top-0',
        'flex items-center gap-1 p-2 px-4 h-10',
        'transition-all duration-100', {
        'bg-transparent': atTop,
        'bg-background/50 backdrop-blur-md': !atTop,
      })}
    >
      <Link className="italic inline-flex items-center gap-2" href="/">
        <span className="text-2xl"><AppBrand /></span>
        <Badge className="border-primary rounded-full py-0 text-[10px] h-[14px] mt-1" variant="outline">Beta</Badge>
      </Link>
      <span className="grow"></span>
      <ThemeToggle className="" />
    </header>
  )
}

const Footer = () => {
  return (
    <footer className="relative p-2 md:px-4 flex flex-col gap-2 border-t">
      <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
        <span>Created by:</span>
        <a className="flex items-center gap-1" href='https://x.com/doiali'>
          <FaXTwitter className="inline-flex" />
          <span>Doiali</span>
        </a>
      </p>
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
          &copy; {new Date().getFullYear()} Actionbitz. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Layout