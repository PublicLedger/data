import { PUBLIC_BASE_URL } from "$env/static/public";

export const prerender = true;

export const GET = async () => {
  const baseUrl = PUBLIC_BASE_URL ?? "https://data.publicledger.news";
  const routes = ["/"];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  data-google-analytics-opt-out="true"
>
  ${routes
    .map(
      (route) => `<url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
};
