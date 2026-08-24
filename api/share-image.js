/* Image Open Graph dynamique.
   Les robots WhatsApp/Facebook ne lancent pas boutique.js : ils appellent
   cette URL stable, qui les redirige vers l'image actuellement publiée dans
   les réglages Supabase. La clé utilisée ici est la clé ANON publique. */
const SUPABASE_URL = "https://vgzvavlmmqbxtuhanaqj.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnenZhdmxtbXFieHR1aGFuYXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MjU1NzYsImV4cCI6MjEwMjQwMTU3Nn0.n-9SC-nVEve7M-w4yiozdWJBp2_PaoYB5qMeS2cOqwg";

module.exports = async function shareImage(req, res) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "boutique-aura-studios.vercel.app");
  const proto = String(req.headers["x-forwarded-proto"] || "https");
  const fallback = `${proto}://${host}/assets/brand/tk-shoes-share.jpg`;
  let target = fallback;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=data&id=eq.1`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
    });
    if (response.ok) {
      const rows = await response.json();
      const candidate = rows && rows[0] && rows[0].data && rows[0].data.shareImage;
      if (/^https:\/\/[^\s]+$/i.test(String(candidate || ""))) target = candidate;
    }
  } catch (_) {
    target = fallback;
  }
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  res.statusCode = 302;
  res.setHeader("Location", target);
  res.end();
};
