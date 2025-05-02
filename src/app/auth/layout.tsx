import AuthPageController from '@/components/auth-controller'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Actionbitz - Authentication',
  robots: {
    follow: false,
    index: false,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthPageController>
      {children}
    </AuthPageController>
  )
}