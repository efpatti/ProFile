import fetch from "node-fetch";

const API_KEY = "sk_YNP0Kih5QnqisbIQftwkiA";

export const BrandSearchController = {
 async search(req, res) {
  const query = req.query.q;
  if (!query || query.length < 2) {
   return res.json({ results: [] });
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

   console.log("LOGO API response:", JSON.stringify(data, null, 2));

   if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
   }

   return res.json({ results: data });
  } catch (error) {
   console.error("Erro ao buscar na logo.dev:", error.message);
   return res.status(500).json({ results: [], error: "Erro na busca" });
  }
 },
};
