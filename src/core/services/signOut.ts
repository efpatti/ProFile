// src/core/services/signOut.ts
"use client";
// src/core/services/signOut.ts
import { signOut as nextAuthSignOut } from "next-auth/react";

export default async function signOut() {
 await nextAuthSignOut({ callbackUrl: "/" });
}
