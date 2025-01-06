import AuthPageController from '@/components/AuthPageController';

export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <AuthPageController>
      {children}
    </AuthPageController>
  );
}