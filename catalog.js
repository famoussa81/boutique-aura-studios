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
      { id: "hoodie-noir", name: "Hoodie Oversized « Noir Absolu »", cat: "hoodies", price: 25000, oldPrice: 0, badge: "Nouveau", img: "assets/hoodie-noir.webp", imgs: ["assets/hoodie-noir.webp"], desc: "Coupe oversize, tissu molletonné premium, capuche doublée et cordon contrasté. La pièce signature de la saison.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(6), "M": v(9), "L": v(12), "XL": v(7), "XXL": v(4) }, active: true, stockout: false },
      { id: "hoodie-blanc", name: "Hoodie Studio Blanc", cat: "hoodies", price: 25000, oldPrice: 0, badge: "Top vente", img: "assets/hoodie-blanc.webp", imgs: ["assets/hoodie-blanc.webp"], desc: "Édition studio en molleton lourd, silhouette épurée et finitions contrastées. Polyvalence totale.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(5), "M": v(8), "L": v(10), "XL": v(6), "XXL": v(3) }, active: true, stockout: false },
      { id: "hoodie-tech", name: "Hoodie Aura Tech", cat: "hoodies", price: 28000, oldPrice: 0, badge: "", img: "assets/hoodie-tech.webp", imgs: ["assets/hoodie-tech.webp"], desc: "Version technique hydrofuge : zip intégral, coutures scellées et poches étanches.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(4), "M": v(6), "L": v(8), "XL": v(4), "XXL": v(2) }, active: true, stockout: false },
      { id: "hoodie-urbain", name: "Hoodie Urban Flow", cat: "hoodies", price: 27000, oldPrice: 0, badge: "Nouveau", img: "assets/hoodie-urbain.webp", imgs: ["assets/hoodie-urbain.webp"], desc: "Silhouette streetwear engagée : capuche classique, poche kangourou et grammage lourd.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(6), "M": v(8), "L": v(11), "XL": v(6), "XXL": v(3) }, active: true, stockout: false },
      { id: "hoodie-trench", name: "Hoodie Trench Noir", cat: "hoodies", price: 30000, oldPrice: 0, badge: "", img: "assets/hoodie-trench.webp", imgs: ["assets/hoodie-trench.webp"], desc: "Trench technique oversize : patte boutonnée, tissu coupe-vent et finitions contrastées.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(4), "M": v(6), "L": v(8), "XL": v(5), "XXL": v(2) }, active: true, stockout: false },
      { id: "tee-graphique", name: "T-shirt Graphique AURA", cat: "tees", price: 15000, oldPrice: 0, badge: "Top vente", img: "assets/tee-graphique.webp", imgs: ["assets/tee-graphique.webp"], desc: "Coton premium 220 g/m², graphisme AURA imprimé, coupe régulière droite.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(8), "M": v(12), "L": v(14), "XL": v(8), "XXL": v(5) }, active: true, stockout: false },
      { id: "tee-core", name: "T-shirt Essential Core", cat: "tees", price: 12000, oldPrice: 15000, badge: "-20 %", img: "assets/tee-core.webp", imgs: ["assets/tee-core.webp"], desc: "Le basique absolu du dressing urbain : coton épais, col renforcé, tombé impeccable.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(10), "M": v(15), "L": v(16), "XL": v(9), "XXL": v(5) }, active: true, stockout: false },
      { id: "tee-oversized", name: "T-shirt Oversized Blanc", cat: "tees", price: 14000, oldPrice: 0, badge: "Top vente", img: "assets/tee-oversized.webp", imgs: ["assets/tee-oversized.webp"], desc: "Coupe oversized confortable, manches tombantes et coton épais au toucher premium.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(7), "M": v(10), "L": v(12), "XL": v(7), "XXL": v(4) }, active: true, stockout: false },
      { id: "tee-print", name: "T-shirt Print Studio", cat: "tees", price: 16000, oldPrice: 0, badge: "Nouveau", img: "assets/tee-print.webp", imgs: ["assets/tee-print.webp"], desc: "Sérigraphie éditoriale en face avant et arrière, coton peigné à séchage rapide.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(6), "M": v(9), "L": v(11), "XL": v(6), "XXL": v(3) }, active: true, stockout: false },
      { id: "cargo-technique", name: "Pantalon Cargo Technique", cat: "pants", price: 36000, oldPrice: 45000, badge: "-20 %", img: "assets/cargo-technique.webp", imgs: ["assets/cargo-technique.webp"], desc: "Série technique : tissu anti-déchirure, coupe ample, poches cargo zippées et cordon cheville.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(6), "M": v(9), "L": v(10), "XL": v(5), "XXL": v(3) }, active: true, stockout: false },
      { id: "cargo-noir", name: "Cargo Noir Slim", cat: "pants", price: 34000, oldPrice: 42000, badge: "-20 %", img: "assets/cargo-noir.webp", imgs: ["assets/cargo-noir.webp"], desc: "Cargo ajusté aux chevilles, toile épaisse et six poches utilitaires.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(6), "M": v(8), "L": v(10), "XL": v(5), "XXL": v(3) }, active: true, stockout: false },
      { id: "cargo-beige", name: "Pantalon Cargo Beige", cat: "pants", price: 38000, oldPrice: 0, badge: "Nouveau", img: "assets/cargo-beige.webp", imgs: ["assets/cargo-beige.webp"], desc: "Tonalité sable, coupe droite et poches cargo volumineuses : le cargo color-block de la saison.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(5), "M": v(8), "L": v(9), "XL": v(5), "XXL": v(2) }, active: true, stockout: false },
      { id: "casquette-aura", name: "Casquette Ajustée AURA", cat: "accessoires", price: 10000, oldPrice: 0, badge: "Nouveau", img: "assets/casquette.webp", imgs: ["assets/casquette.webp"], desc: "Coton gabardine, broderie AURA, visière courbée et fermeture ajustable.", axes: [], variants: { "": v(20) }, active: true, stockout: false },
      { id: "bonnet-aura", name: "Bonnet AURA", cat: "accessoires", price: 8000, oldPrice: 0, badge: "Nouveau", img: "assets/bonnet.webp", imgs: ["assets/bonnet.webp"], desc: "Bonnet en maille souple au toucher doux, liseré brodé AURA : l'accessoire signature de l'hiver urbain.", axes: [], variants: { "": v(18) }, active: true, stockout: false },
      { id: "ensemble-blanc", name: "Ensemble Molleton Blanc", cat: "hoodies", price: 42000, oldPrice: 0, badge: "Nouveau", img: "assets/ensemble-blanc.webp", imgs: ["assets/ensemble-blanc.webp"], desc: "Hoodie et jogger assortis en molleton lourd. Vendu en ensemble : la pièce la plus simple à porter du vestiaire, du matin au soir.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(4), "M": v(7), "L": v(8), "XL": v(5), "XXL": v(2) }, active: true, stockout: false },
      { id: "hoodie-capuche", name: "Hoodie Capuche Profonde", cat: "hoodies", price: 26000, oldPrice: 0, badge: "", img: "assets/hoodie-capuche.webp", imgs: ["assets/hoodie-capuche.webp"], desc: "Capuche doublée à tombé profond, molleton gratté à l'intérieur. Il garde sa forme lavage après lavage.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(5), "M": v(9), "L": v(10), "XL": v(6), "XXL": v(3) }, active: true, stockout: false },
      { id: "tee-poche", name: "T-shirt Poche Délavé", cat: "tees", price: 13000, oldPrice: 0, badge: "Nouveau", img: "assets/tee-poche.webp", imgs: ["assets/tee-poche.webp"], desc: "Coton délavé pièce par pièce : la couleur est déjà stabilisée, elle ne partira pas au lavage. Poche poitrine renforcée.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(7), "M": v(11), "L": v(12), "XL": v(7), "XXL": v(4) }, active: true, stockout: false },
      { id: "tee-essentiel", name: "T-shirt Essentiel Blanc", cat: "tees", price: 12000, oldPrice: 0, badge: "", img: "assets/tee-essentiel.webp", imgs: ["assets/tee-essentiel.webp"], desc: "Coupe droite classique, col côtelé qui ne se détend pas. Coton 190 g/m² : il reste opaque, même en blanc.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(9), "M": v(14), "L": v(15), "XL": v(8), "XXL": v(5) }, active: true, stockout: false },
      { id: "cargo-ivoire", name: "Cargo Ivoire", cat: "pants", price: 35000, oldPrice: 0, badge: "Nouveau", img: "assets/cargo-ivoire.webp", imgs: ["assets/cargo-ivoire.webp"], desc: "Toile de coton ivoire, coupe droite et six poches. La pièce claire qui va avec tout le reste du vestiaire.", axes: [{ name: "Taille", values: ["S", "M", "L", "XL", "XXL"] }], variants: { "S": v(5), "M": v(8), "L": v(9), "XL": v(5), "XXL": v(3) }, active: true, stockout: false },
      { id: "casquette-trucker", name: "Casquette Trucker Bicolore", cat: "accessoires", price: 9000, oldPrice: 0, badge: "", img: "assets/casquette-trucker.webp", imgs: ["assets/casquette-trucker.webp"], desc: "Devant coton blanc, filet noir à l'arrière : elle ventile vraiment sous la chaleur. Fermeture à pression réglable.", axes: [], variants: { "": v(24) }, active: true, stockout: false }
    ];
  }

  function settings() {
    return {
      whatsapp: "22376759515",
      shopName: "AURA STUDIOS",
      deliveryFee: 1500,
      freeFrom: 35000,
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
        { key: "hoodies",     label: "Hoodies", axes: [{ name: "Taille", values: [{ v: "S" }, { v: "M" }, { v: "L" }, { v: "XL" }, { v: "XXL" }] }] },
        { key: "tees",        label: "T-shirts", axes: [{ name: "Taille", values: [{ v: "S" }, { v: "M" }, { v: "L" }, { v: "XL" }, { v: "XXL" }] }] },
        { key: "pants",       label: "Cargos", axes: [{ name: "Taille", values: [{ v: "S" }, { v: "M" }, { v: "L" }, { v: "XL" }, { v: "XXL" }] }] },
        { key: "accessoires", label: "Accessoires", axes: [] }
      ],
      announcement: "Livraison gratuite à Bamako dès 35 000 FCFA d'achat",
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
      { key: "hoodies",     label: "Hoodies", axes: [{ name: "Taille", values: [{ v: "S" }, { v: "M" }, { v: "L" }, { v: "XL" }, { v: "XXL" }] }] },
      { key: "tees",        label: "T-shirts", axes: [{ name: "Taille", values: [{ v: "S" }, { v: "M" }, { v: "L" }, { v: "XL" }, { v: "XXL" }] }] },
      { key: "pants",       label: "Cargos", axes: [{ name: "Taille", values: [{ v: "S" }, { v: "M" }, { v: "L" }, { v: "XL" }, { v: "XXL" }] }] },
      { key: "accessoires", label: "Accessoires", axes: [] }
    ]
  };
})();
