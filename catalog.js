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

  function legacyProducts() {
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

  function products() {
    var pointures = ["39", "40", "41", "42", "43", "44", "45"];
    var stock = [2, 4, 5, 5, 4, 3, 1];
    function make(spec) {
      var variants = {};
      var studio = "assets/studio/" + spec.id + ".webp";
      var photosReelles = spec.imgs || [spec.img];
      var valueImages = {};
      Object.keys(spec.valueImages || {}).forEach(function (key) { valueImages[key] = spec.valueImages[key]; });
      spec.colors.forEach(function (coloris) {
        var key = "Coloris::" + coloris;
        if (!valueImages[key]) valueImages[key] = spec.img;
      });
      spec.colors.forEach(function (coloris) {
        pointures.forEach(function (pointure, i) {
          variants[pointure + "::" + coloris] = v(stock[i]);
        });
      });
      return {
        id: spec.id,
        name: spec.name,
        cat: spec.cat || "claquettes",
        collection: spec.brand,
        price: spec.price,
        oldPrice: 0,
        badge: "",
        /* La grille utilise une vue studio uniforme ; les photos fournies par
           le vendeur restent dans la galerie et pilotent les coloris. */
        img: studio,
        imgs: [studio].concat(photosReelles),
        desc: spec.desc,
        axes: [
          { name: "Pointure", values: pointures.slice() },
          { name: "Coloris", values: spec.colors.slice() }
        ],
        valueImages: valueImages,
        variants: variants,
        active: true,
        stockout: false
      };
    }
    return [
      make({ id: "ck-ribbed", name: "Claquette Logo Relief", brand: "calvin-klein", price: 22000,
        img: "assets/products/ck-ribbed-noir.webp", imgs: ["assets/products/ck-ribbed-noir.webp", "assets/products/ck-ribbed-blanc.webp"],
        colors: ["Noir", "Blanc"], valueImages: { "Coloris::Noir": "assets/products/ck-ribbed-noir.webp", "Coloris::Blanc": "assets/products/ck-ribbed-blanc.webp" },
        desc: "Claquette monobloc à bride côtelée et logo en relief, pensée pour un usage quotidien." }),
      make({ id: "ck-jeans", name: "Claquette CK Jeans", brand: "calvin-klein", price: 23000,
        img: "assets/products/ck-jeans.webp", colors: ["Blanc", "Bleu"],
        valueImages: { "Coloris::Blanc": "assets/products/ck-jeans.webp", "Coloris::Bleu": "assets/products/ck-jeans.webp" },
        desc: "Bride large ton sur ton, semelle souple et signature CK Jeans embossée." }),
      make({ id: "ck-band", name: "Claquette Bande Signature", brand: "calvin-klein", price: 22000,
        img: "assets/products/ck-bande-beige.webp", colors: ["Beige"],
        desc: "Modèle beige épuré avec bande signature contrastée et semelle moulée." }),
      make({ id: "lv-signature", name: "Claquette Signature LV", brand: "louis-vuitton", price: 45000,
        img: "assets/products/lv-signature-bleu.webp", imgs: ["assets/products/lv-signature-bleu.webp", "assets/products/lv-signature-noir.webp", "assets/products/lv-signature-marron.webp"],
        colors: ["Bleu", "Noir", "Marron"], valueImages: { "Coloris::Bleu": "assets/products/lv-signature-bleu.webp", "Coloris::Noir": "assets/products/lv-signature-noir.webp", "Coloris::Marron": "assets/products/lv-signature-marron.webp" },
        desc: "Bride large à signature textile, semelle rembourrée et finitions contrastées." }),
      make({ id: "lv-relief", name: "Claquette Monogramme Relief", brand: "louis-vuitton", price: 47000,
        img: "assets/products/lv-relief-multi.webp", imgs: ["assets/products/lv-relief-multi.webp", "assets/products/lv-relief-duo.webp", "assets/products/lv-relief-noir.webp"],
        colors: ["Noir", "Bordeaux", "Ivoire"], valueImages: { "Coloris::Noir": "assets/products/lv-relief-noir.webp", "Coloris::Bordeaux": "assets/products/lv-relief-duo.webp", "Coloris::Ivoire": "assets/products/lv-relief-duo.webp" },
        desc: "Bride texturée à monogramme en relief, assise matelassée et couture périphérique." }),
      make({ id: "hermes-chypre", name: "Sandale H Cuir", brand: "hermes", price: 55000,
        img: "assets/products/hermes-chypre-orange.webp", colors: ["Orange"],
        desc: "Sandale à double bride en cuir orange, découpe H et semelle noire crantée." }),
      make({ id: "bb-check", name: "Claquette Vintage Check", brand: "burberry", price: 38000,
        img: "assets/products/burberry-check-multi.webp", imgs: ["assets/products/burberry-check-multi.webp", "assets/products/burberry-check-beige.webp", "assets/products/burberry-check-vert.webp"],
        colors: ["Beige", "Vert", "Bleu ciel", "Noir"], valueImages: { "Coloris::Beige": "assets/products/burberry-check-beige.webp", "Coloris::Vert": "assets/products/burberry-check-vert.webp", "Coloris::Bleu ciel": "assets/products/burberry-check-multi.webp", "Coloris::Noir": "assets/products/burberry-check-multi.webp" },
        desc: "Claquette à bride imprimée carreaux, déclinée en quatre associations faciles à porter." }),
      make({ id: "gv-paris", name: "Claquette Paris", brand: "givenchy", price: 40000,
        img: "assets/products/givenchy-paris-multi.webp", imgs: ["assets/products/givenchy-paris-multi.webp", "assets/products/givenchy-paris-blanc.webp", "assets/products/givenchy-paris-noir.webp"],
        colors: ["Blanc", "Noir", "Bleu", "Beige"], valueImages: { "Coloris::Blanc": "assets/products/givenchy-paris-blanc.webp", "Coloris::Noir": "assets/products/givenchy-paris-noir.webp", "Coloris::Bleu": "assets/products/givenchy-paris-multi.webp", "Coloris::Beige": "assets/products/givenchy-paris-multi.webp" },
        desc: "Bride lisse à lettrage Paris contrasté, avec semelle légère et profil minimal." }),
      make({ id: "dr-oblique", name: "Mule Oblique", cat: "mules", brand: "dior", price: 48000,
        img: "assets/products/dior-oblique.webp", colors: ["Noir", "Gris"],
        valueImages: { "Coloris::Noir": "assets/products/dior-oblique.webp", "Coloris::Gris": "assets/products/dior-oblique.webp" },
        desc: "Mule fermée en textile monogrammé, maintenue par une bride latérale réglable." }),
      make({ id: "bl-mold", name: "Sabot Moulé", cat: "mules", brand: "balenciaga", price: 44000,
        img: "assets/products/balenciaga-sabot.webp", colors: ["Noir"],
        desc: "Sabot monobloc noir à talon ouvert et bride mobile, facile à enfiler." }),
      make({ id: "hg-mono", name: "Claquette Monogramme", brand: "hugo", price: 24000,
        img: "assets/products/hugo-monogramme-multi.webp", imgs: ["assets/products/hugo-monogramme-multi.webp", "assets/products/hugo-monogramme-noir.webp"],
        colors: ["Noir", "Bleu et blanc"], valueImages: { "Coloris::Noir": "assets/products/hugo-monogramme-noir.webp", "Coloris::Bleu et blanc": "assets/products/hugo-monogramme-multi.webp" },
        desc: "Bride souple à motif HUGO répété, montée sur une semelle noire ou blanche." }),
      make({ id: "hg-red", name: "Claquette Bande Rouge", brand: "hugo", price: 25000,
        img: "assets/products/hugo-bande-rouge.webp", colors: ["Noir et rouge"],
        desc: "Modèle noir à bride rouge dégradée, avec semelle crantée et signature graphique." }),
      make({ id: "tj-flag", name: "Claquette Flag", brand: "tommy-jeans", price: 20000,
        img: "assets/products/tommy-flag.webp", colors: ["Tricolore"],
        desc: "Bride tricolore à écusson central, sur une semelle bleu marine confortable." }),
      make({ id: "mc-mono", name: "Claquette Monogramme", brand: "moncler", price: 35000,
        img: "assets/products/moncler-monogramme.webp", colors: ["Bleu et blanc"],
        desc: "Claquette bleu glacier à motif intégral contrasté et semelle moulée." }),
      make({ id: "ea-logo", name: "Claquette Logo", brand: "ea7", price: 21000,
        img: "assets/products/ea7-logo.webp", colors: ["Noir", "Beige"],
        valueImages: { "Coloris::Noir": "assets/products/ea7-logo.webp", "Coloris::Beige": "assets/products/ea7-logo.webp" },
        desc: "Bride imprimée au grand logo EA7, proposée sur semelle noire ou beige." }),
      make({ id: "as-pool", name: "Claquette Logo", brand: "allsaints", price: 20000,
        img: "assets/products/allsaints-logo.webp", colors: ["Bleu marine"],
        desc: "Claquette bleu marine minimaliste à logo blanc, avec assise texturée." })
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
      /* Les anciennes photos restent hors boutique tant que les visuels reels
         du commerçant n'ont pas tous ete poses. Ces deux interrupteurs sont
         actives seulement apres validation visuelle de chaque fichier. */
      productVisualsReady: true,
      brandCoversReady: true,
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
      /* Contenu éditorial de la page d'accueil. Chaque bloc peut être masqué
         par son interrupteur `on`. Les valeurs ci-dessous ne sont qu'un
         point de départ : tout se modifie depuis l'administration. */
      content: {
        hero: {
          on: true,
          image: "assets/hero.webp",
          badge: "Collection 2026 · Bamako",
          kicker: "Claquettes · Mules · Sabots",
          title: "Le confort ne se négocie pas",
          sub: "Les grandes marques, en pointures 39 à 45. Commande simple par WhatsApp, paiement à la livraison.",
          cta1: "Voir les marques",
          cta2: "Tout le catalogue"
        },
        banner: {
          on: true,
          image: "assets/banniere.webp",
          kicker: "Sélection de la semaine",
          title: "Prêtes à porter, tout de suite.",
          text: "Semelle moulée, bride renforcée, pointures complètes. Les modèles qui partent le plus vite.",
          cta1: "Voir la sélection",
          cta2: "Les mules"
        },
        editorial: {
          on: true,
          image: "assets/editorial.webp",
          kicker: "La maison",
          title: "Le vrai, au bon prix",
          text: "Nous sélectionnons chaque paire auprès de fournisseurs vérifiés. Pas de copie, pas de mauvaise surprise : ce que vous voyez est ce que vous recevez.",
          pillars: [
            { title: "Authentique", text: "Chaque modèle vient d'un circuit vérifié. Nous montrons la boîte et l'étiquette sur demande." },
            { title: "Pointures complètes", text: "Du 39 au 45 sur la majorité des modèles, avec le stock réel affiché." },
            { title: "Livraison rapide", text: "Bamako en 24 heures, paiement à la réception. Vous ne payez rien à l'avance." }
          ]
        },
        newsletter: {
          on: true,
          kicker: "Restons en contact",
          title: "Les arrivages en avant-première",
          text: "Nouvelles paires, réassorts et offres réservées. Un message quand il y a du neuf, pas plus.",
          note: "Zéro spam. Désinscription en un clic."
        }
      },
      collections: [
        { key: "calvin-klein", label: "Calvin Klein", logo: "assets/logos/calvin-klein.svg", tagline: "Minimalisme américain", accent: "#1f2933", cover: "assets/brands/calvin-klein.webp",
          desc: "Le logo embossé sur bride large. Une claquette qui se reconnaît de loin." },
        { key: "louis-vuitton", featured: true, label: "Louis Vuitton", logo: "assets/logos/louis-vuitton.png", tagline: "Monogram", accent: "#6b4f2a", cover: "assets/brands/louis-vuitton.webp",
          desc: "Cuir embossé et bande signature. La pièce que tout le monde identifie." },
        { key: "hermes", featured: true, label: "Hermès", logo: "assets/logos/hermes.png", tagline: "H signature", accent: "#d86f25", cover: "assets/studio/hermes-chypre.webp",
          desc: "Cuir orange, découpe H et semelle noire. Une silhouette immédiatement reconnaissable." },
        { key: "burberry", label: "Burberry", logo: "assets/logos/burberry.png", tagline: "Vintage Check", accent: "#7d6b4f", cover: "assets/brands/burberry.webp",
          desc: "Le tartan maison, décliné en trois teintes." },
        { key: "givenchy", label: "Givenchy", logo: "assets/logos/givenchy.png", tagline: "Paris", accent: "#2b2b2b", cover: "assets/brands/givenchy.webp",
          desc: "L'inscription signature centrée sur la bride. Sobre et immédiat." },
        { key: "dior", label: "Dior", logo: "assets/logos/dior.svg", tagline: "Oblique", accent: "#3a3a3a", cover: "assets/brands/dior.webp",
          desc: "Toile jacquard au motif maison. La mule d'intérieur qui se porte dehors." },
        { key: "balenciaga", label: "Balenciaga", logo: "assets/logos/capture-balenciaga.png", tagline: "Mold", accent: "#111111", cover: "assets/brands/balenciaga.webp",
          desc: "Caoutchouc moulé d'une seule pièce. Une silhouette qu'on ne confond pas." },
        { key: "hugo", featured: true, label: "HUGO", logo: "assets/logos/hugo.svg", tagline: "Bande rouge", accent: "#a3262b", cover: "assets/brands/hugo.webp",
          desc: "La bande contrastée et le monogramme répété. Sport et net." },
        { key: "tommy-jeans", label: "Tommy Jeans", logo: "assets/logos/capture-tommy-jeans.png", tagline: "Flag", accent: "#1c3a6e", cover: "assets/brands/tommy-jeans.webp",
          desc: "Le drapeau tricolore en grand sur la bride." },
        { key: "moncler", label: "Moncler", logo: "assets/logos/capture-moncler.png", tagline: "Monogramme", accent: "#1d4f8b", cover: "assets/brands/moncler.webp",
          desc: "Imprimé graphique intégral, bleu et blanc." },
        { key: "ea7", label: "EA7 Emporio Armani", logo: "assets/logos/capture-ea7.png", tagline: "Sport", accent: "#4a4a4a", cover: "assets/brands/ea7.webp",
          desc: "Texture technique et logo large. Pensée pour l'été." },
        { key: "allsaints", label: "AllSaints", logo: "assets/logos/allsaints.svg", tagline: "Minimal", accent: "#22303c", cover: "assets/brands/allsaints.webp",
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
        { key: "claquettes", label: "Claquettes", cover: "assets/cat-claquettes.webp", axes: [{ name: "Pointure", values: [{ v: "39" }, { v: "40" }, { v: "41" }, { v: "42" }, { v: "43" }, { v: "44" }, { v: "45" }] }, { name: "Coloris", values: [{ v: "Noir", hex: "#111111" }, { v: "Blanc", hex: "#f2f2f2" }, { v: "Blanc cassé", hex: "#e8e2d5" }, { v: "Beige", hex: "#c8b79b" }, { v: "Orange", hex: "#d86f25" }, { v: "Tan", hex: "#b08a5e" }, { v: "Marron", hex: "#6b4a2f" }, { v: "Bleu", hex: "#2b4f8e" }, { v: "Bleu ciel", hex: "#8fb8d8" }, { v: "Bleu marine", hex: "#1c2b4a" }, { v: "Vert", hex: "#5a6b4f" }, { v: "Noir et rouge", hex: "#a3262b" }, { v: "Blanc et bleu", hex: "#dbe4f0" }, { v: "Bleu et blanc", hex: "#3d6ea8" }, { v: "Tricolore", hex: "#8c2f39" }] }] },
        { key: "mules", label: "Mules & sabots", cover: "assets/cat-mules.webp", axes: [{ name: "Pointure", values: [{ v: "39" }, { v: "40" }, { v: "41" }, { v: "42" }, { v: "43" }, { v: "44" }, { v: "45" }] }, { name: "Coloris", values: [{ v: "Noir", hex: "#111111" }, { v: "Blanc", hex: "#f2f2f2" }, { v: "Blanc cassé", hex: "#e8e2d5" }, { v: "Beige", hex: "#c8b79b" }, { v: "Tan", hex: "#b08a5e" }, { v: "Marron", hex: "#6b4a2f" }, { v: "Bleu", hex: "#2b4f8e" }, { v: "Bleu ciel", hex: "#8fb8d8" }, { v: "Bleu marine", hex: "#1c2b4a" }, { v: "Vert", hex: "#5a6b4f" }, { v: "Noir et rouge", hex: "#a3262b" }, { v: "Blanc et bleu", hex: "#dbe4f0" }, { v: "Bleu et blanc", hex: "#3d6ea8" }, { v: "Tricolore", hex: "#8c2f39" }] }] }
    ]
  };
})();
