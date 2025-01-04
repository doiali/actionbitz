'use client';

import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';

export default function LayoutHeader() {
  const { data } = useSession();

  return (
    <div className="flex gap-2 py-4 border-b items-center">
      <span>
        Dashboard
      </span>
      <span className="grow" />
      <span>{data?.user?.name || data?.user?.email}</span>
      <Button variant="secondary" onClick={() => {
        signOut();
      }}>
        Sign Out
      </Button>
      <ThemeToggle />
    </div>
  );
};