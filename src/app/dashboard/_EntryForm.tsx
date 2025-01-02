import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateEntry } from '@/entities/entry';
import { useState } from 'react';

export default function EntryForm() {
  const [{ title }, setState] = useState({
    title: '',
  });
  const mutation = useCreateEntry({
    onSuccess: () => {
      setState({ title: '' });
    }
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      title,
      type: 'TODO',
    });
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <Input
        name="title"
        value={title}
        placeholder="Title"
        required
        onChange={({ target: { value, name } }) => {
          setState((prev) => ({ ...prev, [name]: value }));
        }}
      />
      <div className="flex justify-end">
        <Button disabled={mutation.isPending || !title}>
          Add
        </Button>
      </div>
    </form>
  );

}