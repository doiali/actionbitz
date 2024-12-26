import ProtectedPage from '@/components/ProtectedPage';

export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <ProtectedPage>
      {children}
    </ProtectedPage>
  );
}