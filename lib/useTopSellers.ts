import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useTopSellers() {
  const { data, error, isLoading } = useSWR('/api/admin/top-sellers', fetcher);
  return { data, error, isLoading };
}
