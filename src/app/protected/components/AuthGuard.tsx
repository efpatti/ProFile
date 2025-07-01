import { LOGIN_PATH } from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthGuard() {
 const pathname = usePathname();

 return (
  <div
   className="flex flex-col items-center justify-center min-h-screen text-black"
   style={{ background: "red", zIndex: 9999 }}
  >
   <div style={{ fontSize: 32, fontWeight: "bold", marginBottom: 24 }}>
    DEBUG: AuthGuard Renderizado
   </div>
   <pre className="mb-4">Você está tentando acessar: {pathname}</pre>
   <div className="text-lg mb-2">Você encontrou uma área protegida!</div>
   <Link
    href={`${LOGIN_PATH}?continueTo=${pathname}`}
    className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
   >
    Fazer login
   </Link>
  </div>
 );
}
