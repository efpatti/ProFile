/**
 * useResumeContacts - Single Responsibility
 *
 * Responsabilidade ÚNICA:
 * - Agregar informações de contato de múltiplas fontes
 * - Deduplicar contatos
 * - Formatar URLs (mailto:, tel:, https://)
 *
 * Uncle Bob: "Functions should do one thing. They should do it well."
 */

"use client";

import { useMemo } from "react";

interface ContactItem {
 text: string;
 href?: string;
}

interface ContactSources {
 headerEmail?: string | null;
 userEmail?: string | null;
 phone?: string | null;
 website?: string | null;
 linkedin?: string | null;
 github?: string | null;
}

/**
 * Garante que URL tenha protocolo https://
 */
const ensureUrl = (value: string): string =>
 value.startsWith("http://") || value.startsWith("https://")
  ? value
  : `https://${value}`;

/**
 * Agrega contatos de múltiplas fontes com deduplicação
 */
export function useResumeContacts(sources: ContactSources): ContactItem[] {
 return useMemo(() => {
  const items: ContactItem[] = [];

  const addContact = (text?: string | null, href?: string) => {
   if (!text) return;
   // Deduplica por texto
   if (items.some((item) => item.text === text)) return;
   items.push({ text, href });
  };

  // Email header tem prioridade
  addContact(
   sources.headerEmail,
   sources.headerEmail ? `mailto:${sources.headerEmail}` : undefined
  );

  // Email do user como fallback
  addContact(
   sources.userEmail,
   sources.userEmail ? `mailto:${sources.userEmail}` : undefined
  );

  // Telefone
  addContact(sources.phone, sources.phone ? `tel:${sources.phone}` : undefined);

  // Website
  addContact(
   sources.website,
   sources.website ? ensureUrl(sources.website) : undefined
  );

  // LinkedIn
  addContact(
   sources.linkedin,
   sources.linkedin ? ensureUrl(sources.linkedin) : undefined
  );

  // GitHub
  addContact(
   sources.github,
   sources.github ? ensureUrl(sources.github) : undefined
  );

  return items;
 }, [
  sources.headerEmail,
  sources.userEmail,
  sources.phone,
  sources.website,
  sources.linkedin,
  sources.github,
 ]);
}
