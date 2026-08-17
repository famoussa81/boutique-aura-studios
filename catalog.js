/* ============================================================
   AURA STUDIOS — Catalogue et réglages par défaut (source unique)
   ------------------------------------------------------------
   Ce fichier est chargé par la boutique ET par l'administration.
   Il ne doit exister qu'une seule définition du catalogue : toute
   divergence entre les deux pages viendrait d'une copie locale.

   Aucune commande de démonstration n'est incluse : la boutique
   démarre avec un historique vide, comme en production.
   ============================================================ */
(function () {
  /* Une variante : quantité en stock, quantité réservée par une commande
     en attente. La clé qui la porte est la combinaison des valeurs d'axes. */
  function v(s) { return { s: s, r: 0 }; }

  function products() {
    return [
      { id: "ck-pool", name: "Claquette Pool Logo", cat: "claquettes", collection: "calvin-klein", price: 22000, oldPrice: 0,
        badge: "Top vente", img: "assets/cl-noir.webp", imgs: ["assets/cl-noir.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Noir", "Blanc", "Beige", "Bleu"] }],
        variants: { "39::Noir": v(3), "40::Noir": v(5), "41::Noir": v(6), "42::Noir": v(6), "43::Noir": v(5), "44::Noir": v(4), "45::Noir": v(2), "39::Blanc": v(3), "40::Blanc": v(5), "41::Blanc": v(6), "42::Blanc": v(6), "43::Blanc": v(5), "44::Blanc": v(4), "45::Blanc": v(2), "39::Beige": v(3), "40::Beige": v(5), "41::Beige": v(6), "42::Beige": v(6), "43::Beige": v(5), "44::Beige": v(4), "45::Beige": v(2), "39::Bleu": v(3), "40::Bleu": v(5), "41::Bleu": v(6), "42::Bleu": v(6), "43::Bleu": v(5), "44::Bleu": v(4), "45::Bleu": v(2) }, active: true, stockout: false },
      { id: "lv-mule", name: "Mule Cuir Monogram", cat: "mules", collection: "louis-vuitton", price: 45000, oldPrice: 0,
        badge: "", img: "assets/cl-cuir.webp", imgs: ["assets/cl-cuir.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Noir", "Blanc cassé"] }],
        variants: { "39::Noir": v(2), "40::Noir": v(4), "41::Noir": v(5), "42::Noir": v(5), "43::Noir": v(4), "44::Noir": v(3), "45::Noir": v(1), "39::Blanc cassé": v(2), "40::Blanc cassé": v(4), "41::Blanc cassé": v(5), "42::Blanc cassé": v(5), "43::Blanc cassé": v(4), "44::Blanc cassé": v(3), "45::Blanc cassé": v(1) }, active: true, stockout: false },
      { id: "lv-bande", name: "Claquette Bande LV", cat: "claquettes", collection: "louis-vuitton", price: 42000, oldPrice: 0,
        badge: "Top vente", img: "assets/cl-bleu.webp", imgs: ["assets/cl-bleu.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Bleu ciel", "Noir", "Marron", "Bleu marine"] }],
        variants: { "39::Bleu ciel": v(1), "40::Bleu ciel": v(3), "41::Bleu ciel": v(4), "42::Bleu ciel": v(4), "43::Bleu ciel": v(3), "44::Bleu ciel": v(2), "45::Bleu ciel": v(0), "39::Noir": v(1), "40::Noir": v(3), "41::Noir": v(4), "42::Noir": v(4), "43::Noir": v(3), "44::Noir": v(2), "45::Noir": v(0), "39::Marron": v(1), "40::Marron": v(3), "41::Marron": v(4), "42::Marron": v(4), "43::Marron": v(3), "44::Marron": v(2), "45::Marron": v(0), "39::Bleu marine": v(1), "40::Bleu marine": v(3), "41::Bleu marine": v(4), "42::Bleu marine": v(4), "43::Bleu marine": v(3), "44::Bleu marine": v(2), "45::Bleu marine": v(0) }, active: true, stockout: false },
      { id: "bb-check", name: "Claquette Vintage Check", cat: "claquettes", collection: "burberry", price: 38000, oldPrice: 0,
        badge: "", img: "assets/cl-pile.webp", imgs: ["assets/cl-pile.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Vert", "Beige", "Bleu ciel"] }],
        variants: { "39::Vert": v(3), "40::Vert": v(5), "41::Vert": v(6), "42::Vert": v(6), "43::Vert": v(5), "44::Vert": v(4), "45::Vert": v(2), "39::Beige": v(3), "40::Beige": v(5), "41::Beige": v(6), "42::Beige": v(6), "43::Beige": v(5), "44::Beige": v(4), "45::Beige": v(2), "39::Bleu ciel": v(3), "40::Bleu ciel": v(5), "41::Bleu ciel": v(6), "42::Bleu ciel": v(6), "43::Bleu ciel": v(5), "44::Bleu ciel": v(4), "45::Bleu ciel": v(2) }, active: true, stockout: false },
      { id: "gv-paris", name: "Paris Logo Slide", cat: "claquettes", collection: "givenchy", price: 40000, oldPrice: 0,
        badge: "Nouveau", img: "assets/cl-noir.webp", imgs: ["assets/cl-noir.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Blanc", "Noir", "Bleu", "Tan"] }],
        variants: { "39::Blanc": v(2), "40::Blanc": v(4), "41::Blanc": v(5), "42::Blanc": v(5), "43::Blanc": v(4), "44::Blanc": v(3), "45::Blanc": v(1), "39::Noir": v(2), "40::Noir": v(4), "41::Noir": v(5), "42::Noir": v(5), "43::Noir": v(4), "44::Noir": v(3), "45::Noir": v(1), "39::Bleu": v(2), "40::Bleu": v(4), "41::Bleu": v(5), "42::Bleu": v(5), "43::Bleu": v(4), "44::Bleu": v(3), "45::Bleu": v(1), "39::Tan": v(2), "40::Tan": v(4), "41::Tan": v(5), "42::Tan": v(5), "43::Tan": v(4), "44::Tan": v(3), "45::Tan": v(1) }, active: true, stockout: false },
      { id: "dr-oblique", name: "Mule Oblique", cat: "mules", collection: "dior", price: 48000, oldPrice: 0,
        badge: "", img: "assets/cl-interieur.webp", imgs: ["assets/cl-interieur.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Noir"] }],
        variants: { "39::Noir": v(1), "40::Noir": v(3), "41::Noir": v(4), "42::Noir": v(4), "43::Noir": v(3), "44::Noir": v(2), "45::Noir": v(0) }, active: true, stockout: false },
      { id: "bl-mold", name: "Sabot Moulé", cat: "mules", collection: "balenciaga", price: 44000, oldPrice: 0,
        badge: "Nouveau", img: "assets/cl-beige.webp", imgs: ["assets/cl-beige.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Noir"] }],
        variants: { "39::Noir": v(3), "40::Noir": v(5), "41::Noir": v(6), "42::Noir": v(6), "43::Noir": v(5), "44::Noir": v(4), "45::Noir": v(2) }, active: true, stockout: false },
      { id: "hg-match", name: "Match Slide", cat: "claquettes", collection: "hugo", price: 24000, oldPrice: 0,
        badge: "", img: "assets/cl-rouge.webp", imgs: ["assets/cl-rouge.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Noir et rouge"] }],
        variants: { "39::Noir et rouge": v(2), "40::Noir et rouge": v(4), "41::Noir et rouge": v(5), "42::Noir et rouge": v(5), "43::Noir et rouge": v(4), "44::Noir et rouge": v(3), "45::Noir et rouge": v(1) }, active: true, stockout: false },
      { id: "hg-mono", name: "Claquette Monogramme", cat: "claquettes", collection: "hugo", price: 23000, oldPrice: 0,
        badge: "", img: "assets/cl-noir.webp", imgs: ["assets/cl-noir.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Noir", "Blanc et bleu", "Bleu et blanc"] }],
        variants: { "39::Noir": v(1), "40::Noir": v(3), "41::Noir": v(4), "42::Noir": v(4), "43::Noir": v(3), "44::Noir": v(2), "45::Noir": v(0), "39::Blanc et bleu": v(1), "40::Blanc et bleu": v(3), "41::Blanc et bleu": v(4), "42::Blanc et bleu": v(4), "43::Blanc et bleu": v(3), "44::Blanc et bleu": v(2), "45::Blanc et bleu": v(0), "39::Bleu et blanc": v(1), "40::Bleu et blanc": v(3), "41::Bleu et blanc": v(4), "42::Bleu et blanc": v(4), "43::Bleu et blanc": v(3), "44::Bleu et blanc": v(2), "45::Bleu et blanc": v(0) }, active: true, stockout: false },
      { id: "tj-flag", name: "Claquette Flag", cat: "claquettes", collection: "tommy-jeans", price: 20000, oldPrice: 0,
        badge: "", img: "assets/cl-bleu.webp", imgs: ["assets/cl-bleu.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Tricolore"] }],
        variants: { "39::Tricolore": v(3), "40::Tricolore": v(5), "41::Tricolore": v(6), "42::Tricolore": v(6), "43::Tricolore": v(5), "44::Tricolore": v(4), "45::Tricolore": v(2) }, active: true, stockout: false },
      { id: "mc-mono", name: "Claquette Monogramme", cat: "claquettes", collection: "moncler", price: 35000, oldPrice: 0,
        badge: "", img: "assets/cl-bleu.webp", imgs: ["assets/cl-bleu.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Bleu et blanc"] }],
        variants: { "39::Bleu et blanc": v(2), "40::Bleu et blanc": v(4), "41::Bleu et blanc": v(5), "42::Bleu et blanc": v(5), "43::Bleu et blanc": v(4), "44::Bleu et blanc": v(3), "45::Bleu et blanc": v(1) }, active: true, stockout: false },
      { id: "ea-logo", name: "Claquette Logo", cat: "claquettes", collection: "ea7", price: 21000, oldPrice: 0,
        badge: "", img: "assets/cl-beige.webp", imgs: ["assets/cl-beige.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Noir", "Beige"] }],
        variants: { "39::Noir": v(1), "40::Noir": v(3), "41::Noir": v(4), "42::Noir": v(4), "43::Noir": v(3), "44::Noir": v(2), "45::Noir": v(0), "39::Beige": v(1), "40::Beige": v(3), "41::Beige": v(4), "42::Beige": v(4), "43::Beige": v(3), "44::Beige": v(2), "45::Beige": v(0) }, active: true, stockout: false },
      { id: "as-pool", name: "Claquette Piscine", cat: "claquettes", collection: "allsaints", price: 20000, oldPrice: 0,
        badge: "", img: "assets/cl-bleu.webp", imgs: ["assets/cl-bleu.webp"],
        desc: "Semelle moulée à mémoire, bride renforcée. Se porte pieds nus toute la journée.",
        axes: [{ name: "Pointure", values: ["39", "40", "41", "42", "43", "44", "45"] }, { name: "Coloris", values: ["Bleu marine"] }],
        variants: { "39::Bleu marine": v(3), "40::Bleu marine": v(5), "41::Bleu marine": v(6), "42::Bleu marine": v(6), "43::Bleu marine": v(5), "44::Bleu marine": v(4), "45::Bleu marine": v(2) }, active: true, stockout: false }
    ];
  }

  function settings() {
    return {
      whatsapp: "22376759515",
      shopName: "SNEAK BAMAKO",
      deliveryFee: 1500,
      freeFrom: 40000,
      /* Délai de livraison annoncé. Modifiable depuis l'administration :
         il alimente à la fois les cartes produit, le bandeau de réassurance
         et les mentions du hero, pour qu'ils ne puissent jamais diverger.
         Exemples : "24h", "48h", "2 à 3 jours", "1 semaine". */
      deliveryTime: "24h",
      /* Délai d'échange annoncé. Comme le délai de livraison, il est écrit
         une seule fois ici : une promesse figée dans le HTML ne peut plus
         être ajustée quand la réalité du terrain change. */
      exchangeTime: "48h",
      /* Avis clients : rempli depuis l'administration, jamais pre-rempli.
         Section masquee en boutique tant que la liste est vide. */
      reviews: [],
      /* Categories de la boutique. Modifiables depuis l'administration :
         ajouter « Vestes » ou « Chaussures » ne demande aucune ligne de code. */
      categories: [
        { key: "claquettes", label: "Claquettes", cover: "assets/cat-claquettes.webp", axes: [{ name: "Pointure", values: [{ v: "39" }, { v: "40" }, { v: "41" }, { v: "42" }, { v: "43" }, { v: "44" }, { v: "45" }] }, { name: "Coloris", values: [{ v: "Noir", hex: "#111111" }, { v: "Blanc", hex: "#f2f2f2" }, { v: "Blanc cassé", hex: "#e8e2d5" }, { v: "Beige", hex: "#c8b79b" }, { v: "Tan", hex: "#b08a5e" }, { v: "Marron", hex: "#6b4a2f" }, { v: "Bleu", hex: "#2b4f8e" }, { v: "Bleu ciel", hex: "#8fb8d8" }, { v: "Bleu marine", hex: "#1c2b4a" }, { v: "Vert", hex: "#5a6b4f" }, { v: "Noir et rouge", hex: "#a3262b" }, { v: "Blanc et bleu", hex: "#dbe4f0" }, { v: "Bleu et blanc", hex: "#3d6ea8" }, { v: "Tricolore", hex: "#8c2f39" }] }] },
        { key: "mules", label: "Mules & sabots", cover: "assets/cat-mules.webp", axes: [{ name: "Pointure", values: [{ v: "39" }, { v: "40" }, { v: "41" }, { v: "42" }, { v: "43" }, { v: "44" }, { v: "45" }] }, { name: "Coloris", values: [{ v: "Noir", hex: "#111111" }, { v: "Blanc", hex: "#f2f2f2" }, { v: "Blanc cassé", hex: "#e8e2d5" }, { v: "Beige", hex: "#c8b79b" }, { v: "Tan", hex: "#b08a5e" }, { v: "Marron", hex: "#6b4a2f" }, { v: "Bleu", hex: "#2b4f8e" }, { v: "Bleu ciel", hex: "#8fb8d8" }, { v: "Bleu marine", hex: "#1c2b4a" }, { v: "Vert", hex: "#5a6b4f" }, { v: "Noir et rouge", hex: "#a3262b" }, { v: "Blanc et bleu", hex: "#dbe4f0" }, { v: "Bleu et blanc", hex: "#3d6ea8" }, { v: "Tricolore", hex: "#8c2f39" }] }] }
      ],
      /* Collections : marques, capsules, univers. Vides par défaut — une
         boutique mono-marque n'en a pas besoin et n'en voit aucune trace.
         Chacune porte son identité : couverture, accroche, description, et
         une couleur d'accent bornée à trois usages décoratifs. */
      collections: [
        { key: "calvin-klein", label: "Calvin Klein", tagline: "Minimalisme américain", accent: "#1f2933", cover: "assets/marque-1.webp",
          desc: "Le logo embossé sur bride large. Une claquette qui se reconnaît de loin." },
        { key: "louis-vuitton", label: "Louis Vuitton", tagline: "Monogram", accent: "#6b4f2a", cover: "assets/marque-2.webp",
          desc: "Cuir embossé et bande signature. La pièce que tout le monde identifie." },
        { key: "burberry", label: "Burberry", tagline: "Vintage Check", accent: "#7d6b4f", cover: "assets/marque-3.webp",
          desc: "Le tartan maison, décliné en trois teintes." },
        { key: "givenchy", label: "Givenchy", tagline: "Paris", accent: "#2b2b2b", cover: "assets/marque-4.webp",
          desc: "L'inscription signature centrée sur la bride. Sobre et immédiat." },
        { key: "dior", label: "Dior", tagline: "Oblique", accent: "#3a3a3a", cover: "assets/marque-5.webp",
          desc: "Toile jacquard au motif maison. La mule d'intérieur qui se porte dehors." },
        { key: "balenciaga", label: "Balenciaga", tagline: "Mold", accent: "#111111", cover: "assets/marque-6.webp",
          desc: "Caoutchouc moulé d'une seule pièce. Une silhouette qu'on ne confond pas." },
        { key: "hugo", label: "HUGO", tagline: "Bande rouge", accent: "#a3262b", cover: "assets/marque-7.webp",
          desc: "La bande contrastée et le monogramme répété. Sport et net." },
        { key: "tommy-jeans", label: "Tommy Jeans", tagline: "Flag", accent: "#1c3a6e", cover: "assets/marque-8.webp",
          desc: "Le drapeau tricolore en grand sur la bride." },
        { key: "moncler", label: "Moncler", tagline: "Monogramme", accent: "#1d4f8b", cover: "assets/marque-9.webp",
          desc: "Imprimé graphique intégral, bleu et blanc." },
        { key: "ea7", label: "EA7 Emporio Armani", tagline: "Sport", accent: "#4a4a4a", cover: "assets/marque-10.webp",
          desc: "Texture technique et logo large. Pensée pour l'été." },
        { key: "allsaints", label: "AllSaints", tagline: "Minimal", accent: "#22303c", cover: "assets/marque-11.webp",
          desc: "Bleu marine et logo blanc. Rien de plus." }
      ],
      announcement: "Livraison gratuite à Bamako dès 40 000 FCFA d'achat",
      instagram: "",
      tiktok: "",
      youtube: ""
    };
  }

  window.AURA_CATALOG = {
    /* État initial d'une boutique neuve : catalogue rempli, historique vide. */
    seed: function () {
      return { settings: settings(), products: products(), orders: [] };
    },
    products: products,
    settings: settings,
    /* Séparateur des valeurs d'axes dans une clé de variante. Interdit
       dans les valeurs saisies, contrôlé par l'administration. */
    VSEP: "::",
    /* Categories par defaut. Elles ne sont qu'une graine : la liste
       effective vit dans les reglages et se modifie depuis l'administration. */
    CATEGORIES: [
        { key: "claquettes", label: "Claquettes", cover: "assets/cat-claquettes.webp", axes: [{ name: "Pointure", values: [{ v: "39" }, { v: "40" }, { v: "41" }, { v: "42" }, { v: "43" }, { v: "44" }, { v: "45" }] }, { name: "Coloris", values: [{ v: "Noir", hex: "#111111" }, { v: "Blanc", hex: "#f2f2f2" }, { v: "Blanc cassé", hex: "#e8e2d5" }, { v: "Beige", hex: "#c8b79b" }, { v: "Tan", hex: "#b08a5e" }, { v: "Marron", hex: "#6b4a2f" }, { v: "Bleu", hex: "#2b4f8e" }, { v: "Bleu ciel", hex: "#8fb8d8" }, { v: "Bleu marine", hex: "#1c2b4a" }, { v: "Vert", hex: "#5a6b4f" }, { v: "Noir et rouge", hex: "#a3262b" }, { v: "Blanc et bleu", hex: "#dbe4f0" }, { v: "Bleu et blanc", hex: "#3d6ea8" }, { v: "Tricolore", hex: "#8c2f39" }] }] },
        { key: "mules", label: "Mules & sabots", cover: "assets/cat-mules.webp", axes: [{ name: "Pointure", values: [{ v: "39" }, { v: "40" }, { v: "41" }, { v: "42" }, { v: "43" }, { v: "44" }, { v: "45" }] }, { name: "Coloris", values: [{ v: "Noir", hex: "#111111" }, { v: "Blanc", hex: "#f2f2f2" }, { v: "Blanc cassé", hex: "#e8e2d5" }, { v: "Beige", hex: "#c8b79b" }, { v: "Tan", hex: "#b08a5e" }, { v: "Marron", hex: "#6b4a2f" }, { v: "Bleu", hex: "#2b4f8e" }, { v: "Bleu ciel", hex: "#8fb8d8" }, { v: "Bleu marine", hex: "#1c2b4a" }, { v: "Vert", hex: "#5a6b4f" }, { v: "Noir et rouge", hex: "#a3262b" }, { v: "Blanc et bleu", hex: "#dbe4f0" }, { v: "Bleu et blanc", hex: "#3d6ea8" }, { v: "Tricolore", hex: "#8c2f39" }] }] }
    ]
  };
})();
