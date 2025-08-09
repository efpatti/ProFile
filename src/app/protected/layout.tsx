"use client";

import { useAuth } from "@/core/services/AuthProvider";
import { ReactNode } from "react";
import AuthGuard from "./components/AuthGuard";
import { useSearchParams } from "next/navigation";

export default function Layout({ children }: { children: ReactNode }) {
 const { user, loading, isLogged } = useAuth();
 const searchParams = useSearchParams();
 const isExport = searchParams?.get("export") === "1";

 if (loading && !isExport) return <>Auth loading...</>;
 if (!isExport && (!isLogged || !user)) return <AuthGuard />;
 return children;
}
