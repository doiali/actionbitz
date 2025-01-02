import { useEntries } from '@/entities/entry';
import { Entry } from '@prisma/client';
import EntryForm, { useEntryUpdateForm } from './_EntryForm';
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
          onCancel={() => setEdit(false)}
        />
      )}
    </li>
  );
};

const EntryEditForm = ({ entry, onCancel }: {
  entry: Entry;
  onCancel: () => void;
}) => {
  const { state, onChange, onSubmit, disabled } = useEntryUpdateForm(entry, { onSuccess: onCancel });

  return (
    <EntryForm
      state={state}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
      disabled={disabled}
    />
  );
};