'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from "react";
import EntryList from './_EntryList';
import { Entry } from '@prisma/client';
import { useEntryCreate } from '@/entities/entry';
import { PlusIcon } from '@heroicons/react/24/outline';
import EntryForm from './_EntryForm';

export default function Dashboard() {
  const { data } = useSession();

  return (
    <div className="mx-auto max-w-3xl my-8 px-4">
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
      </div>
      <div className="flex flex-col py-4">
        <EntryAddButton />
        <EntryList />
      </div>
    </div>
  );
}

function EntryAddButton() {
  const [showForm, setShowForm] = useState(false);
  const [state, setState] = useState<Partial<Entry>>({
    title: '',
  });

  const mutation = useEntryCreate({
    onSuccess: () => {
      setState({ title: '' });
      setShowForm(false);
    }
  });

  const onChange = <T extends keyof Entry>(name: T, value: Entry[T]) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      title: state.title,
      type: 'TODO',
    });
  };
  return (
    <div className="pb-2 border-b">
      {!showForm && (
        <Button variant="ghost" className="w-full justify-start" onClick={() => setShowForm(true)}>
          <PlusIcon className="h-5 w-5 text-primary" /> 
          <span className="text-primary">Add Entry</span>
        </Button>
      )}
      {showForm && (
        <EntryForm
          state={state}
          onChange={onChange}
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          onCancel={() => {
            setShowForm(false);
            setState({ title: '' });
          }}
        />
      )}
    </div>
  );
}