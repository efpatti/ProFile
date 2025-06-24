import { NextRequest, NextResponse } from "next/server";

const API_KEY = "sk_YNP0Kih5QnqisbIQftwkiA";

export async function GET(req: NextRequest) {
 const { searchParams } = new URL(req.url);
 const query = searchParams.get("q");
 if (!query || query.length < 2) {
  return NextResponse.json({ results: [] });
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
  if (!response.ok) {
   throw new Error(`API error: ${response.status}`);
  }
  return NextResponse.json({ results: data });
 } catch (error: unknown) {
  let errorMessage = "Erro na busca";
  if (error instanceof Error) {
   console.error("Erro ao buscar na logo.dev:", error.message);
   errorMessage = error.message;
  } else {
   console.error("Erro ao buscar na logo.dev:", error);
  }
  return NextResponse.json(
   { results: [], error: errorMessage },
   { status: 500 }
  );
 }
}
