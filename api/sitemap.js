/* Plan du site, construit à la demande.

   Le plan était écrit à la main : il fallait le rouvrir chaque fois que le
   commerçant ajoutait une marque, et il ne citait aucune fiche produit.
   Trente-six modèles pouvaient donc rester des mois sans être découverts,
   alors qu'ils portent les mots que les clients cherchent — la marque et le
   nom du modèle.

   Le plan se construit maintenant à partir de ce qui est réellement publié :
   les pages fixes, une adresse par marque en vente, et une adresse par
   modèle actif. Un produit retiré disparaît du plan le jour même.
*/
const SUPABASE_URL = "https://vgzvavlmmqbxtuhanaqj.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnenZhdmxtbXFieHR1aGFuYXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MjU1NzYsImV4cCI6MjEwMjQwMTU3Nn0.n-9SC-nVEve7M-w4yiozdWJBp2_PaoYB5qMeS2cOqwg";

const entetes = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };

function xml(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function entree(loc, lastmod, changefreq, priority) {
  return "  <url>\n" +
    "    <loc>" + xml(loc) + "</loc>\n" +
    (lastmod ? "    <lastmod>" + xml(lastmod) + "</lastmod>\n" : "") +
    "    <changefreq>" + changefreq + "</changefreq>\n" +
    "    <priority>" + priority + "</priority>\n" +
    "  </url>\n";
}

module.exports = async function plan(req, res) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "boutique-aura-studios.vercel.app");
  const proto = String(req.headers["x-forwarded-proto"] || "https");
  const base = `${proto}://${host}`;
  const jour = new Date().toISOString().slice(0, 10);

  let produits = [], reglages = {};
  try {
    const [rp, rs] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/products?select=id,data,updated_at`, { headers: entetes }),
      fetch(`${SUPABASE_URL}/rest/v1/settings?select=data&id=eq.1`, { headers: entetes })
    ]);
    if (rp.ok) produits = await rp.json();
    if (rs.ok) {
      const lignes = await rs.json();
      reglages = (lignes && lignes[0] && lignes[0].data) || {};
    }
  } catch (_) { produits = []; }

  let corps = "";
  corps += entree(base + "/", jour, "weekly", "1.0");
  corps += entree(base + "/hommes", jour, "daily", "0.9");
  corps += entree(base + "/femmes", jour, "daily", "0.9");
  corps += entree(base + "/catalogue", jour, "daily", "0.9");
  corps += entree(base + "/marques", jour, "weekly", "0.9");

  /* Une marque n'entre dans le plan que si elle a au moins un modèle en
     vente : une page de marque vide déçoit le visiteur et abîme la
     réputation du domaine. */
  const actifs = produits.filter(function (l) {
    const d = l && l.data;
    return d && d.active !== false && !d.archived;
  });
  const marquesVendues = new Set(actifs.map(function (l) { return l.data.collection; }).filter(Boolean));
  const collections = Array.isArray(reglages.collections) ? reglages.collections : [];
  collections.forEach(function (c) {
    if (c && c.key && marquesVendues.has(c.key)) {
      corps += entree(base + "/collection?c=" + encodeURIComponent(c.key), jour, "weekly", "0.8");
    }
  });

  actifs.forEach(function (l) {
    const modifie = l.updated_at ? String(l.updated_at).slice(0, 10) : jour;
    corps += entree(base + "/produit?id=" + encodeURIComponent(l.id), modifie, "weekly", "0.7");
  });

  corps += entree(base + "/guide-des-tailles", jour, "monthly", "0.5");
  corps += entree(base + "/durabilite", jour, "monthly", "0.4");
  corps += entree(base + "/cgv", jour, "yearly", "0.3");
  corps += entree(base + "/confidentialite", jour, "yearly", "0.3");

  const doc = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + corps + "</urlset>\n";

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.end(doc);
};
