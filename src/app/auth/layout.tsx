import AuthPageController from '@/components/auth-controller'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthPageController>
      {children}
    </AuthPageController>
  )
}