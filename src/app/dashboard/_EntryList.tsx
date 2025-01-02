import { useEntries, useUpdateEntry } from '@/entities/entry';
import { Entry } from '@prisma/client';
import EntryForm from './_EntryForm';
import { useState } from 'react';

export default function EntryList() {
  const query = useEntries();
  const { data, isLoading, isError } = query;
  return (
    <ul className="flex flex-col gap-2">
      {isLoading && <li>Loading...</li>}
      {isError && <li>Error</li>}
      {data?.data?.map((entry) => (
        <EntryItem key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

const EntryItem = ({ entry }: { entry: Entry; }) => {
  const [edit, setEdit] = useState(false);

  return (
    <li key={entry.id} className="py-2 border-b">
      {!edit && (
        <div key={entry.id} className="flex justify-between">
          <span onClick={() => setEdit(true)}>{entry.title}</span>
          <span>{entry.type}</span>
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

const EntryEditForm = ({ entry, onClose }: {
  entry: Entry;
  onClose: () => void;
}) => {
  const [state, setState] = useState<Partial<Entry>>({
    title: entry.title,
  });

  const mutation = useUpdateEntry({
    onSuccess: (data) => {
      setState({
        title: data.title,
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