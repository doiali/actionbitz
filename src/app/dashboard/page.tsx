'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import React from "react";
import EntryList from './_EntryList';
import { EntryCreateForm } from './_EntryForm';

export default function Dashboard() {
  const { data } = useSession();

  return (
    <div className="container mx-auto max-w-3xl my-8">
      <div className="flex gap-2 py-4 border-b items-center">
        <span>
          Dashboard
        </span>
        <span className="grow" />
        <span>{data?.user?.name || data?.user?.email}</span>
        <Button onClick={() => {
          signOut();
        }}>
          Sign Out
        </Button>
      </div>
      <div className="flex flex-col gap-4 py-4">
        <EntryList />
        <EntryCreateForm />
      </div>
    </div>
  );
}