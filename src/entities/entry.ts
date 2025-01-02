import apiClient from '@/utils/apiClient';
import { Entry } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useEntries = () => useQuery({
  queryKey: ['entry'],
  queryFn: () => apiClient.get<{ data: Entry[]; }>('entry').json(),
});

export const useCreateEntry = ({ onSuccess }: { onSuccess?: (data: Entry) => void; } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry: Partial<Entry>) => apiClient.post<Entry>('entry', { json: entry }).json(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['entry'],
      });
      onSuccess?.(data);
    },
  });
};