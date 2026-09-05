/* Fiche produit rendue par le serveur.

   La boutique construit ses pages en JavaScript : le robot de Google, lui,
   reçoit un squelette vide et un titre « Produit ». Trente-six fiches
   existent, aucune n'est trouvable — or « claquette Dior Bamako » est très
   exactement ce qu'un client tape.

   Cette fonction sert la même page, mais avec le nom du modèle, sa marque,
   son prix, sa photo et son stock déjà écrits dedans, plus le balisage que
   Google affiche dans ses résultats. Le script de la boutique reprend
   ensuite la main et remplit les mêmes éléments : rien n'est dupliqué,
   l'affichage ne change pas.

   La clé utilisée est la clé ANON publique, la même que celle du navigateur.
*/
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = "https://vgzvavlmmqbxtuhanaqj.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnenZhdmxtbXFieHR1aGFuYXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MjU1NzYsImV4cCI6MjEwMjQwMTU3Nn0.n-9SC-nVEve7M-w4yiozdWJBp2_PaoYB5qMeS2cOqwg";

const entetes = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* Le prix s'écrit avec une espace insécable fine, comme dans la boutique :
   « 45 000 FCFA ». Un prix collé se lit mal et se recopie mal. */
function prixTexte(n) {
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString("fr-FR").replace(/ | /g, " ") + " FCFA";
}

/* Stock réel, réservations déduites — la même règle que la boutique. Sans
   elle, une fiche épuisée s'annoncerait disponible dans les résultats de
   recherche, ce qui fait venir un client pour rien. */
function disponible(p) {
  if (p && p.stockout) return false;
  const v = p && p.variants;
  if (!v || typeof v !== "object") return true;
  let total = 0;
  for (const k in v) {
    const cell = v[k] || {};
    total += Math.max(0, (Number(cell.s) || 0) - (Number(cell.r) || 0));
  }
  return total > 0;
}

function marqueDe(p, reglages) {
  const cles = Array.isArray(reglages && reglages.collections) ? reglages.collections : [];
  const trouvee = cles.find(function (c) { return c && c.key === p.collection; });
  return trouvee && trouvee.label ? trouvee.label : "";
}

function urlAbsolue(base, chemin) {
  const c = String(chemin || "");
  if (/^https?:\/\//i.test(c)) return c;
  return base + "/" + c.replace(/^\/+/, "");
}

/* Le gabarit vit dans le dépôt sous son propre nom : sur Vercel un fichier
   statique l'emporte toujours sur une règle de réécriture, donc tant qu'un
   « produit.html » existait, c'est lui qui répondait et cette fonction
   n'était jamais appelée. On lit le gabarit sur le disque de la fonction ;
   s'il n'a pas été embarqué, on le redemande au CDN. */
async function gabarit(base) {
  try {
    return fs.readFileSync(path.join(process.cwd(), "gabarit-produit.html"), "utf8");
  } catch (_) {
    const r = await fetch(base + "/gabarit-produit.html", { redirect: "follow" });
    if (!r.ok) throw new Error("gabarit introuvable");
    return await r.text();
  }
}

module.exports = async function fiche(req, res) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "boutique-aura-studios.vercel.app");
  const proto = String(req.headers["x-forwarded-proto"] || "https");
  const base = `${proto}://${host}`;

  let id = "";
  try {
    id = new URL(req.url, base).searchParams.get("id") || "";
  } catch (_) { id = ""; }

  let html;
  try {
    html = await gabarit(base);
  } catch (_) {
    res.statusCode = 302;
    res.setHeader("Location", "/catalogue");
    res.end();
    return;
  }

  let produit = null, reglages = {};
  if (id) {
    try {
      const [rp, rs] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/products?select=data&id=eq.${encodeURIComponent(id)}`, { headers: entetes }),
        fetch(`${SUPABASE_URL}/rest/v1/settings?select=data&id=eq.1`, { headers: entetes })
      ]);
      if (rp.ok) {
        const lignes = await rp.json();
        produit = lignes && lignes[0] && lignes[0].data ? lignes[0].data : null;
      }
      if (rs.ok) {
        const lignes = await rs.json();
        reglages = (lignes && lignes[0] && lignes[0].data) || {};
      }
    } catch (_) { produit = null; }
  }

  /* Produit inconnu, retiré ou archivé : la page reste servie telle quelle
     et le script redirigera le visiteur, mais le code 404 dit au moteur de
     recherche de ne pas garder cette adresse dans son index. */
  if (!produit || produit.active === false || produit.archived) {
    res.statusCode = id ? 404 : 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
    res.end(html);
    return;
  }

  const boutique = reglages.shopName || "T&K SHOES";
  const marque = marqueDe(produit, reglages);
  const nom = produit.name || "Produit";
  const titreComplet = (marque ? marque + " " : "") + nom;
  const prix = Number(produit.price) || 0;
  const enStock = disponible(produit);
  const photo = urlAbsolue(base, produit.img || (Array.isArray(produit.imgs) ? produit.imgs[0] : ""));
  const adresse = `${base}/produit?id=${encodeURIComponent(id)}`;

  const pointures = (Array.isArray(produit.axes) && produit.axes[0] && Array.isArray(produit.axes[0].values))
    ? produit.axes[0].values : [];
  const coloris = (Array.isArray(produit.axes) && produit.axes[1] && Array.isArray(produit.axes[1].values))
    ? produit.axes[1].values : [];

  const morceaux = [];
  if (produit.desc) morceaux.push(String(produit.desc).replace(/\s+/g, " ").trim());
  if (pointures.length) morceaux.push("Pointures " + pointures[0] + " à " + pointures[pointures.length - 1] + ".");
  if (coloris.length > 1) morceaux.push(coloris.length + " coloris.");
  morceaux.push(prixTexte(prix) + ", livraison gratuite partout à Bamako et paiement à la livraison.");
  const description = morceaux.join(" ").slice(0, 300);

  const titrePage = titreComplet + " — " + boutique + " Bamako";

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: titreComplet,
    description: produit.desc || description,
    image: photo,
    sku: id,
    offers: {
      "@type": "Offer",
      url: adresse,
      priceCurrency: "XOF",
      price: String(prix),
      availability: enStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Store", name: boutique }
    }
  };
  if (marque) jsonld.brand = { "@type": "Brand", name: marque };

  /* Chaque remplacement vise une balise vide du gabarit. Le script de la
     boutique réécrit ensuite ces mêmes éléments : le visiteur voit le même
     rendu qu'avant, le robot voit une fiche complète. */
  const remplacements = [
    ["<title>Produit — Boutique en ligne · Bamako</title>", "<title>" + esc(titrePage) + "</title>"],
    ['<meta name="description" content="Pointures disponibles, coloris et stock réel. Livraison gratuite partout à Bamako, commande par WhatsApp et paiement à la livraison." />',
     '<meta name="description" content="' + esc(description) + '" />'],
    ['<meta property="og:title" content="Produit — Boutique en ligne · Bamako" />',
     '<meta property="og:title" content="' + esc(titrePage) + '" />'],
    ['<meta property="og:description" content="Pointures disponibles, coloris et stock réel. Livraison gratuite partout à Bamako et commande par WhatsApp." />',
     '<meta property="og:description" content="' + esc(description) + '" />'],
    ['<meta property="og:image" content="https://boutique-aura-studios.vercel.app/api/share-image" />',
     '<meta property="og:image" content="' + esc(photo) + '" />'],
    ['<meta property="og:url" content="https://boutique-aura-studios.vercel.app/produit" />',
     '<meta property="og:url" content="' + esc(adresse) + '" />\n<link rel="canonical" href="' + esc(adresse) + '" />'],
    ['<meta name="twitter:title" content="Produit — Boutique en ligne · Bamako" />',
     '<meta name="twitter:title" content="' + esc(titrePage) + '" />'],
    ['<meta name="twitter:description" content="Pointures disponibles, coloris et stock réel. Commande par WhatsApp." />',
     '<meta name="twitter:description" content="' + esc(description) + '" />'],
    ['<meta name="twitter:image" content="https://boutique-aura-studios.vercel.app/api/share-image" />',
     '<meta name="twitter:image" content="' + esc(photo) + '" />'],
    ['<div class="pv-media" id="pvMedia"></div>',
     '<div class="pv-media" id="pvMedia"><img src="' + esc(photo) + '" alt="' + esc(titreComplet) + '" width="900" height="1200" /></div>'],
    ['<span class="pcat" id="pvCat"></span>',
     '<span class="pcat" id="pvCat">' + esc(marque || produit.cat || "") + "</span>"],
    ['<h1 id="pvName"></h1>', '<h1 id="pvName">' + esc(nom) + "</h1>"],
    ['<span class="price" id="pvPrice"></span>',
     '<span class="price" id="pvPrice">' + esc(prixTexte(prix)) + "</span>"],
    ['<p class="pv-desc" id="pvDesc"></p>',
     '<p class="pv-desc" id="pvDesc">' + esc(produit.desc || "") + "</p>"],
    ['<span class="stock-line" id="pvStock"></span>',
     '<span class="stock-line" id="pvStock">' + (enStock ? "En stock" : "Épuisé") + "</span>"],
    ['<div class="wrap"><a href="catalogue.html">Catalogue</a> <span id="filMarque"></span></div>',
     '<div class="wrap"><a href="catalogue.html">Catalogue</a> <span id="filMarque">' + esc(marque) + "</span></div>"],
    ["</head>", '<script type="application/ld+json">' + JSON.stringify(jsonld).replace(/</g, "\\u003c") + "</script>\n</head>"]
  ];

  for (const [avant, apres] of remplacements) {
    if (html.indexOf(avant) !== -1) html = html.replace(avant, apres);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  /* Cinq minutes au bord du réseau, une journée de tolérance : un
     changement de prix se propage vite sans que chaque visite rappelle
     Supabase. */
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
  res.end(html);
};
