"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "@/lib/api/session";
import { usersService } from "@/lib/api";

// Dados extras do perfil do usuário
export type UserProfileData = {
 displayName?: string | null;
 photoURL?: string | null;
 bannerColor?: string | null;
 palette?: string | null;
};

export type UserWithProfile = {
 id: string;
 uid: string; // Alias para compatibilidade
 email?: string | null;
 name?: string | null;
 image?: string | null;
} & UserProfileData;

interface AuthContextType {
 user: UserWithProfile | null;
 isLogged: boolean;
 loading: boolean;
 setUser: React.Dispatch<React.SetStateAction<UserWithProfile | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
 undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
 const [user, setUser] = useState<UserWithProfile | null>(null);
 const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  const initAuth = async () => {
   try {
    const session = getSession();

    if (session?.user) {
     // Buscar preferências do usuário da API backend
     try {
      const response = await usersService.getPreferences();
      if (response.data) {
       setUser({
        id: session.user.id,
        uid: session.user.id, // Alias
        email: session.user.email,
        name: session.user.name,
        image: null,
        ...response.data,
       });
      } else {
       // Fallback se não conseguir ler as preferências
       setUser({
        id: session.user.id,
        uid: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: null,
       });
      }
     } catch (error) {
      console.error("Error fetching user preferences:", error);
      setUser({
       id: session.user.id,
       uid: session.user.id,
       email: session.user.email,
       name: session.user.name,
       image: null,
      });
     }
    } else {
     setUser(null);
    }
   } catch (error) {
    console.error("Auth init error:", error);
    setUser(null);
   } finally {
    setLoading(false);
   }
  };

  initAuth();
 }, []);

 const isLogged = !!user;

 return (
  <AuthContext.Provider value={{ user, isLogged, loading, setUser }}>
   {loading ? <LoadingScreen /> : children}
  </AuthContext.Provider>
 );
};

const LoadingScreen = () => (
 <div className="h-screen w-full flex justify-center items-center bg-gray-100">
  <div className="flex gap-2">
   {[...Array(3)].map((_, i) => (
    <div
     key={i}
     className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
     style={{ animationDelay: `${i * 0.2}s` }}
    />
   ))}
  </div>
 </div>
);

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) throw new Error("useAuth must be used within an AuthProvider");
 return context;
};
