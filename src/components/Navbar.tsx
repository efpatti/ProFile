"use client";

import { motion } from "framer-motion";
import { FaUser, FaSignOutAlt, FaHome, FaCog, FaBell } from "react-icons/fa";
import LogoSVG from "@/components/LogoSVG";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Navbar = () => {
 const [user, setUser] = useState<User | null>(null);
 const [userPalette, setUserPalette] = useState<string | null>(null);
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const router = useRouter();

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
   setUser(currentUser);
   if (currentUser) {
    // Busca a palette do usuário no Firestore
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (userDoc.exists()) {
     const data = userDoc.data();
     setUserPalette(data.palette || null);
    } else {
     setUserPalette(null);
    }
   } else {
    setUserPalette(null);
   }
  });
  return () => unsubscribe();
 }, []);

 const handleSignOut = async () => {
  try {
   await signOut(auth);
   router.push("/auth/sign-in");
  } catch (error) {
   console.error("Error signing out:", error);
  }
 };

 return (
  <motion.nav
   initial={{ opacity: 0, y: -20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5 }}
   className="bg-zinc-800/50 backdrop-blur-lg border-b border-zinc-700/50"
  >
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
     {/* Logo and Main Navigation */}
     <div className="flex items-center">
      <div className="flex-shrink-0">
       <LogoSVG className="w-10 h-10" />
      </div>
      <div className="hidden md:block">
       <div className="ml-10 flex items-baseline space-x-4">
        <motion.a
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         href="/"
         className="text-white hover:bg-zinc-700/50 px-3 py-2 rounded-md text-sm font-medium"
        >
         <FaHome className="inline mr-2" />
         Home
        </motion.a>
        <motion.a
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         href="/profile"
         className="text-white hover:bg-zinc-700/50 px-3 py-2 rounded-md text-sm font-medium"
        >
         <FaUser className="inline mr-2" />
         Profile
        </motion.a>
        <motion.a
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         href="/settings"
         className="text-white hover:bg-zinc-700/50 px-3 py-2 rounded-md text-sm font-medium"
        >
         <FaCog className="inline mr-2" />
         Settings
        </motion.a>
       </div>
      </div>
     </div>

     {/* Right side - User controls */}
     <div className="hidden md:block">
      <div className="ml-4 flex items-center md:ml-6">
       <button className="p-1 rounded-full text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        <span className="sr-only">View notifications</span>
        <FaBell className="h-6 w-6" />
       </button>

       {/* Profile dropdown */}
       <div className="ml-3 relative">
        <div>
         <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="max-w-xs bg-zinc-700/50 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="user-menu"
          aria-haspopup="true"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
         >
          <span className="sr-only">Open user menu</span>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white">
           {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
         </motion.button>
        </div>

        {isMenuOpen && (
         <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-zinc-800/90 backdrop-blur-lg border border-zinc-700/50 z-50"
         >
          <div className="px-4 py-2 border-b border-zinc-700">
           <p className="text-sm text-white">
            {userPalette || user?.email || "User"}
           </p>
           <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
          </div>
          <a
           href="/profile"
           className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50"
          >
           Your Profile
          </a>
          <a
           href="/settings"
           className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50"
          >
           Settings
          </a>
          <button
           onClick={handleSignOut}
           className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50 flex items-center"
          >
           <FaSignOutAlt className="mr-2" />
           Sign out
          </button>
         </motion.div>
        )}
       </div>
      </div>
     </div>

     {/* Mobile menu button */}
     <div className="-mr-2 flex md:hidden">
      <motion.button
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
       onClick={() => setIsMenuOpen(!isMenuOpen)}
       className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
       <span className="sr-only">Open main menu</span>
       <svg
        className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
       >
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="2"
         d="M4 6h16M4 12h16M4 18h16"
        />
       </svg>
       <svg
        className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
       >
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="2"
         d="M6 18L18 6M6 6l12 12"
        />
       </svg>
      </motion.button>
     </div>
    </div>
   </div>

   {/* Mobile menu */}
   {isMenuOpen && (
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="md:hidden"
    >
     <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <Link
       href="/"
       className="text-white block px-3 py-2 rounded-md text-base font-medium"
      >
       <FaHome className="inline mr-2" />
       Home
      </Link>
      <a
       href="/profile"
       className="text-white block px-3 py-2 rounded-md text-base font-medium"
      >
       <FaUser className="inline mr-2" />
       Profile
      </a>
      <a
       href="/settings"
       className="text-white block px-3 py-2 rounded-md text-base font-medium"
      >
       <FaCog className="inline mr-2" />
       Settings
      </a>
     </div>
     <div className="pt-4 pb-3 border-t border-zinc-700">
      <div className="flex items-center px-5">
       <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white">
         {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
       </div>
       <div className="ml-3">
        <div className="text-base font-medium text-white">
         {user?.displayName || user?.email || "User"}
        </div>
        <div className="text-sm font-medium text-zinc-400">{user?.email}</div>
       </div>
       <button className="ml-auto flex-shrink-0 p-1 rounded-full text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        <span className="sr-only">View notifications</span>
        <FaBell className="h-6 w-6" />
       </button>
      </div>
      <div className="mt-3 px-2 space-y-1">
       <a
        href="/profile"
        className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-700"
       >
        Your Profile
       </a>
       <a
        href="/settings"
        className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-700"
       >
        Settings
       </a>
       <button
        onClick={handleSignOut}
        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-700 flex items-center"
       >
        <FaSignOutAlt className="mr-2" />
        Sign out
       </button>
      </div>
     </div>
    </motion.div>
   )}
  </motion.nav>
 );
};

export default Navbar;
