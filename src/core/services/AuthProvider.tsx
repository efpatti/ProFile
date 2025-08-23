"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Dados extras do Firestore para o usuário
export type UserProfileData = {
 displayName?: string | null;
 photoURL?: string | null;
 bannerColor?: string | null; // paleta ativa do usuário
 // Adicione outros campos customizados do Firestore aqui
};

export type UserWithProfile = User & UserProfileData;

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
 const [isLogged, setIsLogged] = useState(false);
 const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (userState) => {
   if (userState) {
    const userDoc = doc(db, "users", userState.uid);
    const unsubscribeSnapshot = onSnapshot(
     userDoc,
     (docSnapshot) => {
      const userData = docSnapshot.exists()
       ? (docSnapshot.data() as UserProfileData)
       : {};
      setUser({ ...userState, ...userData });
      setIsLogged(true);
      setLoading(false);
     },
     () => {
      setUser({ ...userState });
      setIsLogged(true);
      setLoading(false);
     }
    );
    return () => {
     unsubscribeSnapshot();
    };
   } else {
    setUser(null);
    setIsLogged(false);
    setLoading(false);
   }
  });
  return () => {
   unsubscribe();
  };
 }, []);

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
