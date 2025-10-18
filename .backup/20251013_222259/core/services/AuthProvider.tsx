"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Dados extras do Firestore para o usuário
export type UserProfileData = {
 displayName?: string | null;
 photoURL?: string | null;
 bannerColor?: string | null; // paleta ativa do usuário
 // Adicione outros campos customizados do Firestore aqui
};

export type UserWithProfile = {
 id: string;
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

const AuthProviderInner = ({ children }: { children: React.ReactNode }) => {
 const { data: session, status } = useSession();
 const [user, setUser] = useState<UserWithProfile | null>(null);
 const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  if (status === "loading") {
   setLoading(true);
   return;
  }

  if (session?.user) {
   const userId = session.user.id;
   const userDoc = doc(db, "users", userId);

   const unsubscribeSnapshot = onSnapshot(
    userDoc,
    (docSnapshot) => {
     const userData = docSnapshot.exists()
      ? (docSnapshot.data() as UserProfileData)
      : {};

     setUser({
      id: userId,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      ...userData,
     });
     setLoading(false);
    },
    () => {
     // Fallback se não conseguir ler o Firestore
     setUser({
      id: userId,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
     });
     setLoading(false);
    }
   );

   return () => {
    unsubscribeSnapshot();
   };
  } else {
   setUser(null);
   setLoading(false);
  }
 }, [session, status]);

 const isLogged = !!user;

 return (
  <AuthContext.Provider value={{ user, isLogged, loading, setUser }}>
   {loading ? <LoadingScreen /> : children}
  </AuthContext.Provider>
 );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
 return (
  <SessionProvider>
   <AuthProviderInner>{children}</AuthProviderInner>
  </SessionProvider>
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
