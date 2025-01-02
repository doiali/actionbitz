import { useEntries } from '@/entities/entry';

export default function EntryList() {
  const query = useEntries();
  const { data, isLoading, isError } = query;
  return (
    <ul className="flex flex-col gap-2">
      {isLoading && <li>Loading...</li>}
      {isError && <li>Error</li>}
      {data?.data?.map((entry) => (
        <li key={entry.id} className="flex justify-between">
          <span>{entry.title}</span>
          <span>{entry.type}</span>
        </li>
      ))}
    </ul>
  );
}