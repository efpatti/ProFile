"use client";

import { useAuth } from "@/core/services/AuthProvider";
import { ReactNode } from "react";
import AuthGuard from "./components/AuthGuard";

export default function Layout({ children }: { children: ReactNode }) {
 const { user, loading, isLogged } = useAuth();

 if (loading) return <>Auth loading...</>;
 if (!isLogged || !user) return <AuthGuard />;
 return children;
}
