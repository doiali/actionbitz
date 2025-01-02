import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateEntry, useUpdateEntry } from '@/entities/entry';
import { Entry } from '@prisma/client';
import { useState } from 'react';

export default function EntryForm({
  state, onChange, onSubmit, onCancel, disabled
}: {
  state: Partial<Entry>;
  onChange: <T extends keyof Entry>(name: T, value: Entry[T]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
  onCancel?: () => void;
}) {
  const { title } = state;

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <Input
        name="title"
        value={title}
        placeholder="Title"
        required
        onChange={({ target: { value, name } }) => {
          onChange(name as 'title', value);
        }}
      />
      <div className="flex justify-end items-center gap-2">
        {onCancel &&
          <Button type="button" disabled={disabled} onClick={onCancel}>
            Cancel
          </Button>
        }
        <Button disabled={disabled || !title}>
          Add
        </Button>
      </div>
    </form>
  );
}

export function EntryCreateForm() {
  const { state, onChange, onSubmit, disabled } = useEntryCreateForm();

  return (
    <EntryForm
      state={state}
      onChange={onChange}
      onSubmit={onSubmit}
      disabled={disabled}
    />
  );
}

export const useEntryCreateForm = () => {
  const [state, setState] = useState<Partial<Entry>>({
    title: '',
  });

  const mutation = useCreateEntry({
    onSuccess: () => {
      setState({ title: '' });
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

  return {
    state,
    onChange,
    onSubmit,
    disabled: mutation.isPending,
  };
};

export const useEntryUpdateForm = (entry: Entry, {
  onSuccess
}: { onSuccess?: () => void; } = {}) => {
  const [state, setState] = useState<Partial<Entry>>({
    title: entry.title,
  });

  const mutation = useUpdateEntry({
    onSuccess: (data) => {
      setState({
        title: data.title,
      });
      onSuccess?.();
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

  return {
    state,
    onChange,
    onSubmit,
    disabled: mutation.isPending,
  };
};