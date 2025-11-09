"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
 return (
  <Toaster
   position="top-right"
   reverseOrder={false}
   gutter={8}
   toastOptions={{
    duration: 4000,
    style: {
     background: "#27272a",
     color: "#fff",
     borderRadius: "12px",
     padding: "16px",
     fontSize: "14px",
     fontWeight: "500",
     boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
    },

    success: {
     duration: 3000,
     style: {
      background: "#27272a",
      color: "#fff",
     },
     iconTheme: {
      primary: "#10b981",
      secondary: "#fff",
     },
    },

    error: {
     duration: 5000,
     style: {
      background: "#27272a",
      color: "#fff",
     },
     iconTheme: {
      primary: "#ef4444",
      secondary: "#fff",
     },
    },

    loading: {
     style: {
      background: "#27272a",
      color: "#fff",
     },
     iconTheme: {
      primary: "#3b82f6",
      secondary: "#fff",
     },
    },
   }}
  />
 );
}
