'use client';

import ProtectedPage from '@/components/ProtectedPage';
import LayoutHeader from './_LayoutHeader';

export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <ProtectedPage>
      <div className="mx-auto max-w-3xl my-8 px-4">
        <LayoutHeader />
        {children}
      </div>
    </ProtectedPage>
  );
}