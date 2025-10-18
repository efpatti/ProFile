import useSWR from "swr";
import { Resume } from "@/core/entities/Resume";
import { FirebaseResumeRepository } from "@/infrastructure/repositories/FirebaseResumeRepository";

const repository = new FirebaseResumeRepository();

/**
 * Hook para buscar currículo com cache inteligente (SWR)
 */
export function useResume(id: string | null) {
 return useSWR<Resume | null>(
  id ? `/resume/${id}` : null,
  () => (id ? repository.findById(id) : null),
  {
   revalidateOnFocus: false,
   dedupingInterval: 60000, // 1 minuto
  }
 );
}

/**
 * Hook para listar currículos do usuário
 */
export function useUserResumes(userId: string | null) {
 return useSWR<Resume[]>(
  userId ? `/resumes/user/${userId}` : null,
  () => (userId ? repository.findByUserId(userId) : []),
  {
   revalidateOnFocus: true,
  }
 );
}

/**
 * Hook para perfil público
 */
export function usePublicResume(username: string | null) {
 return useSWR<Resume | null>(
  username ? `/public/${username}` : null,
  () => (username ? repository.findByUsername(username) : null),
  {
   revalidateOnFocus: false,
   revalidateOnReconnect: false,
  }
 );
}
