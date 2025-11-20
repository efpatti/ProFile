import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useResume(id: string | null) {
 return useSWR(id ? `/api/resume/${id}` : null, fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 minuto
 });
}

export function useUserResumes(userId: string | null) {
 return useSWR(userId ? `/api/resume?userId=${userId}` : null, fetcher, {
  revalidateOnFocus: true,
 });
}

export function usePublicResume(username: string | null) {
 return useSWR(username ? `/api/public/${username}` : null, fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
 });
}
