'use client';

import { useEntries, useEntryDelete, useEntryUpdate } from '@/entities/entry';
import { Entry } from '@prisma/client';
import EntryForm from './_EntryForm';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@/components/ui/checkbox';

export default function EntryList() {
  const query = useEntries();
  const { data, isLoading, isError } = query;
  return (
    <ul className="flex flex-col">
      {isLoading && <li>Loading...</li>}
      {isError && <li>Error</li>}
      {data?.data?.map((entry) => (
        <EntryItem key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

const EntryItem = ({ entry }: {
  entry: Entry;
}) => {
  const [edit, setEdit] = useState(false);
  const mutation = useEntryUpdate();

  return (
    <li key={entry.id} className="py-2 border-b">
      {!edit && (
        <div key={entry.id} className="flex items-center px-4">
          <Checkbox
            className="me-2"
            checked={entry.completed}
            onClick={() => mutation.mutate({
              id: entry.id,
              completed: !entry.completed,
            })}
            disabled={mutation.isPending}
          />
          <button
            className="hover:cursor-pointer grow text-start"
            onClick={() => setEdit(true)}
          >{entry.title}</button>
          <span><EntryMenu entry={entry} /></span>
        </div>
      )}
      {edit && (
        <EntryEditForm
          entry={entry}
          onClose={() => setEdit(false)}
        />
      )}
    </li>
  );
};

const EntryMenu = ({ entry }: { entry: Entry; }) => {
  const mutation = useEntryDelete();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="ghost">
          <EllipsisVerticalIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => mutation.mutate(Number(entry.id))}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const EntryEditForm = ({ entry, onClose }: {
  entry: Entry;
  onClose: () => void;
}) => {
  const [state, setState] = useState<Partial<Entry>>({
    title: entry.title,
    datetime:entry.datetime,
  });

  const mutation = useEntryUpdate({
    onSuccess: (data) => {
      setState({
        title: data.title,
        datetime: data.datetime,
      });
      onClose?.();
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
      id: entry.id,
      title: state.title,
      datetime: state.datetime,
      type: "TODO",
    });
  };

  return (
    <EntryForm
      state={state}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onClose}
      disabled={mutation.isPending}
    />
  );
};