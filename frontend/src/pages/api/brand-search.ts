import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = "sk_YNP0Kih5QnqisbIQftwkiA";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 const query = (req.query.q as string) || "";
 console.log("[brand-search] Query:", query); // debug
 if (!query || query.length < 2) {
  console.log(
   "[brand-search] Query too short or empty, returning empty results"
  );
  res.status(200).json({ results: [] });
  return;
 }
 try {
  const response = await fetch(
   `https://api.logo.dev/search?q=${encodeURIComponent(query)}`,
   {
    headers: {
     Authorization: `Bearer: ${API_KEY}`,
    },
   }
  );
  const data = await response.json();
  console.log("[brand-search] External API response:", data); // debug
  let results: any[] = [];
  if (Array.isArray(data)) {
   results = data;
  } else if (Array.isArray(data.results)) {
   results = data.results;
  }
  console.log("[brand-search] Final results:", results); // debug
  res.status(200).json({ results });
 } catch (error: unknown) {
  let errorMessage = "Erro na busca";
  if (error instanceof Error) {
   console.error("[brand-search] Erro ao buscar na logo.dev:", error.message);
   errorMessage = error.message;
  } else {
   console.error("[brand-search] Erro ao buscar na logo.dev:", error);
  }
  res.status(500).json({ results: [], error: errorMessage });
 }
}
