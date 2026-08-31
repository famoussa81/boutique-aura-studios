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
    var pointuresHomme = ["39", "40", "41", "42", "43", "44", "45"];
    var stock = [2, 4, 5, 5, 4, 3, 1];
    function make(spec) {
      var pointures = (spec.sizes || pointuresHomme).slice();
      var variants = {};
      var studio = spec.studio || (spec.audience === "femme" ? spec.img : "assets/studio/" + spec.id + ".webp");
      var photosReelles = spec.imgs || [spec.img];
      var valueImages = {};
      Object.keys(spec.valueImages || {}).forEach(function (key) { valueImages[key] = spec.valueImages[key]; });
      spec.colors.forEach(function (coloris) {
        var key = "Coloris::" + coloris;
        if (!valueImages[key]) valueImages[key] = spec.img;
      });
      /* Les quantités sont lues par position. Une liste plus courte que celle
         des pointures — l'oubli classique en recopiant une fiche — produisait
         une variante sans nombre : le stock s'affichait « NaN » et la
         pointure devenait incommandable. La dernière valeur connue prend le
         relais, et zéro à défaut. */
      spec.colors.forEach(function (coloris) {
        /* Un coloris peut être épuisé sans que le produit entier le soit.
           La quantité propre au coloris l'emporte sur le stock général. */
        var quantites = (spec.stockByColor && spec.stockByColor[coloris]) || spec.stock || stock;
        pointures.forEach(function (pointure, i) {
          var q = quantites[i];
          if (typeof q !== "number" || isNaN(q)) q = Number(quantites[quantites.length - 1]) || 0;
          variants[pointure + "::" + coloris] = v(q);
        });
      });
      return {
        id: spec.id,
        name: spec.name,
        /* Troisième classement, distinct de la catégorie et de la marque.
           Les produits historiques sont tous Homme ; l'administration pose
           explicitement la valeur sur les prochains produits. */
        audience: spec.audience === "femme" ? "femme" : "homme",
        cat: spec.cat || "claquettes",
        collection: spec.brand,
        price: spec.price,
        oldPrice: 0,
        badge: spec.badge || "",
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
        active: spec.active !== false,
        stockout: !!spec.stockout
      };
    }
    return [
      make({ id: "ferragamo-gancini", name: "Claquette Gancini Croisée", brand: "ferragamo", price: 42000, badge: "Nouveau",
        img: "assets/products/ferragamo-croisee-vert.webp", imgs: ["assets/products/ferragamo-croisee-vert.webp", "assets/products/ferragamo-croisee-marron.webp"],
        colors: ["Vert olive", "Marron cognac"], valueImages: { "Coloris::Vert olive": "assets/products/ferragamo-croisee-vert.webp", "Coloris::Marron cognac": "assets/products/ferragamo-croisee-marron.webp" },
        stock: [2, 3, 5, 5, 4, 3, 1], desc: "Claquette à larges brides croisées, détail Gancini et semelle intérieure contrastée." }),
      make({ id: "bally-sangle-croisee", name: "Claquette Sangle Croisée", brand: "bally", price: 40000, badge: "Nouveau",
        img: "assets/products/bally-croisee-marine.webp", imgs: ["assets/products/bally-croisee-marine.webp", "assets/products/bally-croisee-noir.webp"],
        colors: ["Bleu marine", "Noir"], valueImages: { "Coloris::Bleu marine": "assets/products/bally-croisee-marine.webp", "Coloris::Noir": "assets/products/bally-croisee-noir.webp" },
        stock: [1, 3, 4, 5, 4, 2, 1], desc: "Brides textiles croisées, lettrage Bally en relief et assise souple." }),
      make({ id: "ck-double-bride", name: "Claquette Double Bride", brand: "calvin-klein", price: 25000, badge: "Nouveau",
        img: "assets/products/ck-jeans-double-noir.webp", imgs: ["assets/products/ck-jeans-double-noir.webp", "assets/products/ck-jeans-double-kaki.webp"],
        colors: ["Noir", "Kaki"], valueImages: { "Coloris::Noir": "assets/products/ck-jeans-double-noir.webp", "Coloris::Kaki": "assets/products/ck-jeans-double-kaki.webp" },
        stock: [2, 4, 5, 6, 4, 3, 1], desc: "Deux brides rembourrées et réglables, signature Calvin Klein Jeans brodée." }),
      make({ id: "lv-monogramme-textile", name: "Claquette Monogramme Textile", brand: "louis-vuitton", price: 48000, badge: "Nouveau",
        img: "assets/products/lv-monogram-noir.webp", colors: ["Noir et blanc"],
        valueImages: { "Coloris::Noir et blanc": "assets/products/lv-monogram-noir.webp" },
        stock: [1, 3, 4, 5, 4, 2, 1], desc: "Large bride textile à motif monogramme contrasté sur semelle noire." }),
      make({ id: "lv-damier", name: "Claquette Damier", brand: "louis-vuitton", price: 48000, badge: "Nouveau",
        studio: "assets/products/lv-damier-bleu-studio.webp", img: "assets/products/lv-damier-noir.webp", imgs: ["assets/products/lv-damier-noir.webp", "assets/products/lv-damier-bleu-studio.webp"], colors: ["Noir et gris", "Bleu"],
        valueImages: { "Coloris::Noir et gris": "assets/products/lv-damier-noir.webp", "Coloris::Bleu": "assets/products/lv-damier-bleu-studio.webp" },
        stock: [2, 3, 4, 5, 3, 2, 1], desc: "Bride large à motif damier noir et gris, montée sur une semelle noire souple." }),
      make({ id: "lv-v-croisee", name: "Claquette V Croisée", brand: "louis-vuitton", price: 46000, badge: "Nouveau",
        img: "assets/products/lv-v-croisee-noir.webp", imgs: ["assets/products/lv-v-croisee-noir.webp", "assets/products/lv-v-croisee-marron.webp", "assets/products/lv-v-croisee-marine.webp"],
        colors: ["Noir", "Marron", "Bleu marine"], valueImages: { "Coloris::Noir": "assets/products/lv-v-croisee-noir.webp", "Coloris::Marron": "assets/products/lv-v-croisee-marron.webp", "Coloris::Bleu marine": "assets/products/lv-v-croisee-marine.webp" },
        stock: [2, 4, 5, 5, 4, 3, 1], desc: "Bride graphique en V avec liseré contrasté et semelle matelassée." }),
      make({ id: "lv-denim", name: "Claquette Denim Monogramme", brand: "louis-vuitton", price: 47000, badge: "Nouveau",
        img: "assets/products/lv-denim-bleu.webp", imgs: ["assets/products/lv-denim-bleu.webp", "assets/products/lv-denim-noir.webp"],
        colors: ["Denim bleu", "Denim noir et doré"], valueImages: { "Coloris::Denim bleu": "assets/products/lv-denim-bleu.webp", "Coloris::Denim noir et doré": "assets/products/lv-denim-noir.webp" },
        stock: [1, 3, 5, 5, 4, 2, 1], desc: "Bride en denim à grand monogramme brodé et semelle rembourrée." }),
      make({ id: "lv-autruche", name: "Claquette V Effet Autruche", brand: "louis-vuitton", price: 52000, badge: "Nouveau",
        img: "assets/products/lv-autruche-caramel.webp", imgs: ["assets/products/lv-autruche-caramel.webp", "assets/products/lv-autruche-marron.webp"],
        colors: ["Caramel", "Marron foncé"], valueImages: { "Coloris::Caramel": "assets/products/lv-autruche-caramel.webp", "Coloris::Marron foncé": "assets/products/lv-autruche-marron.webp" },
        stock: [1, 2, 4, 5, 4, 2, 1], desc: "Bride découpée en V à texture grainée effet autruche, ton sur ton." }),
      make({ id: "lv-croco", name: "Claquette V Effet Croco", brand: "louis-vuitton", price: 50000, badge: "Nouveau",
        img: "assets/products/lv-croco-ivoire.webp", imgs: ["assets/products/lv-croco-ivoire.webp", "assets/products/lv-croco-bordeaux.webp"],
        colors: ["Ivoire", "Bordeaux"], valueImages: { "Coloris::Ivoire": "assets/products/lv-croco-ivoire.webp", "Coloris::Bordeaux": "assets/products/lv-croco-bordeaux.webp" },
        stock: [2, 3, 4, 5, 4, 2, 1], desc: "Bride large à texture croco et motif V ton sur ton, sur semelle contrastée." }),
      make({ id: "lv-epi", name: "Claquette V Cuir Épi", brand: "louis-vuitton", price: 49000, badge: "Nouveau",
        img: "assets/products/lv-eppi-marine.webp", imgs: ["assets/products/lv-eppi-marine.webp", "assets/products/lv-eppi-noir.webp"],
        colors: ["Bleu marine", "Noir"], valueImages: { "Coloris::Bleu marine": "assets/products/lv-eppi-marine.webp", "Coloris::Noir": "assets/products/lv-eppi-noir.webp" },
        stock: [2, 4, 5, 5, 3, 2, 1], desc: "Bride texturée façon cuir Épi, monogramme en relief et semelle matelassée." }),
      make({ id: "ck-ribbed", name: "Claquette Logo Relief", brand: "calvin-klein", price: 22000,
        img: "assets/products/ck-ribbed-noir.webp", imgs: ["assets/products/ck-ribbed-noir.webp", "assets/products/ck-ribbed-blanc.webp"],
        colors: ["Noir", "Blanc"], valueImages: { "Coloris::Noir": "assets/products/ck-ribbed-noir.webp", "Coloris::Blanc": "assets/products/ck-ribbed-blanc.webp" },
        stock: [0, 0, 0, 0, 0, 0, 0], stockout: true,
        desc: "Claquette monobloc à bride côtelée et logo en relief, pensée pour un usage quotidien." }),
      make({ id: "ck-jeans", name: "Claquette CK Jeans", brand: "calvin-klein", price: 23000,
        studio: "assets/products/calvin-klein-monogramme-blanc-studio.webp", img: "assets/products/calvin-klein-monogramme-blanc-studio.webp", imgs: ["assets/products/calvin-klein-monogramme-blanc-studio.webp", "assets/products/calvin-klein-monogramme-bleu-studio.webp"], colors: ["Blanc", "Bleu"],
        valueImages: { "Coloris::Blanc": "assets/products/calvin-klein-monogramme-blanc-studio.webp", "Coloris::Bleu": "assets/products/calvin-klein-monogramme-bleu-studio.webp" },
        desc: "Bride large ton sur ton, semelle souple et signature CK Jeans embossée." }),
      make({ id: "ck-band", name: "Claquette Bande Signature", brand: "calvin-klein", price: 22000,
        img: "assets/products/ck-bande-beige-white-v2.webp", colors: ["Beige"],
        desc: "Modèle beige épuré avec bande signature contrastée et semelle moulée." }),
      make({ id: "lv-signature", name: "Claquette Signature LV", brand: "louis-vuitton", price: 45000,
        img: "assets/products/lv-signature-bleu-white-20260826.jpg", imgs: ["assets/products/lv-signature-bleu-white-20260826.jpg", "assets/products/lv-signature-noir-white-20260826.jpg", "assets/products/lv-signature-marron-white-20260826.jpg"],
        colors: ["Bleu", "Noir", "Marron"], valueImages: { "Coloris::Bleu": "assets/products/lv-signature-bleu-white-20260826.jpg", "Coloris::Noir": "assets/products/lv-signature-noir-white-20260826.jpg", "Coloris::Marron": "assets/products/lv-signature-marron-white-20260826.jpg" },
        desc: "Bride large à signature textile, semelle rembourrée et finitions contrastées." }),
      make({ id: "lv-relief", name: "Claquette Monogramme Relief", brand: "louis-vuitton", price: 47000,
        img: "assets/products/lv-relief-paire-noir.webp", imgs: ["assets/products/lv-relief-paire-noir.webp", "assets/products/lv-relief-paire-bordeaux.webp", "assets/products/lv-relief-paire-ivoire.webp"],
        colors: ["Noir", "Bordeaux", "Ivoire"], valueImages: { "Coloris::Noir": "assets/products/lv-relief-paire-noir.webp", "Coloris::Bordeaux": "assets/products/lv-relief-paire-bordeaux.webp", "Coloris::Ivoire": "assets/products/lv-relief-paire-ivoire.webp" },
        desc: "Bride texturée à monogramme en relief, assise matelassée et couture périphérique." }),
      make({ id: "hermes-chypre", name: "Sandale H Cuir", brand: "hermes", price: 55000,
        img: "assets/products/hermes-chypre-orange.webp", colors: ["Orange"],
        desc: "Sandale à double bride en cuir orange, découpe H et semelle noire crantée." }),
      make({ id: "hermes-croisee-bicolore", name: "Sandale Croisée Bicolore", brand: "hermes", price: 55000, badge: "Nouveau",
        img: "assets/products/hermes-croisee-bicolore-white-20260824.webp", colors: ["Noir et camel"],
        stock: [0, 0, 0, 0, 0, 0, 0], stockout: true,
        desc: "Sandale noire à brides croisées contrastées camel, assise souple et ligne habillée." }),
      make({ id: "hermes-h-double-noir", name: "Sandale H Double Bride", brand: "hermes", price: 55000, badge: "Nouveau",
        img: "assets/products/hermes-h-double-noir-white-20260824.webp", colors: ["Noir"],
        stock: [0, 0, 0, 0, 0, 0, 0], stockout: true,
        desc: "Sandale noire à double bride, large découpe H et semelle intérieure rembourrée." }),
      make({ id: "bb-check", name: "Claquette Vintage Check", brand: "burberry", price: 38000,
        studio: "assets/products/burberry-check-beige-tan-studio.webp", img: "assets/products/burberry-check-beige-tan-studio.webp", imgs: ["assets/products/burberry-check-beige-tan-studio.webp", "assets/products/burberry-check-vert-studio.webp", "assets/products/burberry-check-bleu-studio.webp", "assets/products/burberry-check-beige-noir-studio.webp"],
        colors: ["Beige", "Vert", "Bleu ciel", "Noir"], valueImages: { "Coloris::Beige": "assets/products/burberry-check-beige-tan-studio.webp", "Coloris::Vert": "assets/products/burberry-check-vert-studio.webp", "Coloris::Bleu ciel": "assets/products/burberry-check-bleu-studio.webp", "Coloris::Noir": "assets/products/burberry-check-beige-noir-studio.webp" },
        stockByColor: { "Beige": [0, 0, 0, 0, 0, 0, 0] },
        desc: "Claquette à bride imprimée carreaux, déclinée en quatre associations faciles à porter." }),
      make({ id: "gv-paris", name: "Claquette Paris", brand: "givenchy", price: 40000,
        studio: "assets/products/givenchy-logo-noir-studio.webp", img: "assets/products/givenchy-logo-noir-studio.webp", imgs: ["assets/products/givenchy-logo-noir-studio.webp", "assets/products/givenchy-logo-blanc-studio.webp", "assets/products/givenchy-logo-gris-studio.webp", "assets/products/givenchy-logo-kaki-studio.webp"],
        colors: ["Noir", "Blanc", "Gris", "Kaki"], valueImages: { "Coloris::Noir": "assets/products/givenchy-logo-noir-studio.webp", "Coloris::Blanc": "assets/products/givenchy-logo-blanc-studio.webp", "Coloris::Gris": "assets/products/givenchy-logo-gris-studio.webp", "Coloris::Kaki": "assets/products/givenchy-logo-kaki-studio.webp" },
        desc: "Bride lisse à lettrage Paris contrasté, avec semelle légère et profil minimal." }),
      make({ id: "dr-oblique", name: "Mule Oblique", cat: "mules", brand: "dior", price: 48000,
        img: "assets/products/dior-oblique-noir-white-20260826.jpg", imgs: ["assets/products/dior-oblique-noir-white-20260826.jpg", "assets/products/dior-oblique-gris-white-20260826.jpg"], colors: ["Noir", "Gris"],
        valueImages: { "Coloris::Noir": "assets/products/dior-oblique-noir-white-20260826.jpg", "Coloris::Gris": "assets/products/dior-oblique-gris-white-20260826.jpg" },
        desc: "Mule fermée en textile monogrammé, maintenue par une bride latérale réglable." }),
      make({ id: "bl-mold", name: "Sabot Moulé", cat: "mules", brand: "balenciaga", price: 44000,
        img: "assets/products/balenciaga-sabot-white-v2.webp", colors: ["Noir"],
        desc: "Sabot monobloc noir à talon ouvert et bride mobile, facile à enfiler." }),
      make({ id: "hg-mono", name: "Claquette Monogramme", brand: "hugo", price: 24000,
        studio: "assets/products/hugo-repeat-rouge-noir-studio.webp", img: "assets/products/hugo-repeat-rouge-noir-studio.webp", imgs: ["assets/products/hugo-repeat-rouge-noir-studio.webp", "assets/products/hugo-repeat-noir-blanc-studio.webp", "assets/products/hugo-repeat-blanc-studio.webp", "assets/products/hugo-script-noir-studio.webp", "assets/products/hugo-relief-bleu-studio.webp", "assets/products/hugo-typographique-bleu-blanc-studio.webp"],
        colors: ["Noir et rouge", "Noir et blanc", "Blanc et noir", "Script noir", "Bleu ciel", "Bleu et blanc"], valueImages: { "Coloris::Noir et rouge": "assets/products/hugo-repeat-rouge-noir-studio.webp", "Coloris::Noir et blanc": "assets/products/hugo-repeat-noir-blanc-studio.webp", "Coloris::Blanc et noir": "assets/products/hugo-repeat-blanc-studio.webp", "Coloris::Script noir": "assets/products/hugo-script-noir-studio.webp", "Coloris::Bleu ciel": "assets/products/hugo-relief-bleu-studio.webp", "Coloris::Bleu et blanc": "assets/products/hugo-typographique-bleu-blanc-studio.webp" },
        desc: "Bride souple à motif HUGO répété, montée sur une semelle noire ou blanche." }),
      make({ id: "hg-red", name: "Claquette Bande Rouge", brand: "hugo", price: 25000,
        img: "assets/products/hugo-bande-rouge.webp", colors: ["Noir et rouge"],
        desc: "Modèle noir à bride rouge dégradée, avec semelle crantée et signature graphique." }),
      make({ id: "tj-flag", name: "Claquette Flag", brand: "tommy-jeans", price: 20000,
        img: "assets/products/tommy-flag.webp", colors: ["Tricolore"],
        desc: "Bride tricolore à écusson central, sur une semelle bleu marine confortable." }),
      make({ id: "mc-mono", name: "Claquette Monogramme", brand: "moncler", price: 35000,
        img: "assets/products/moncler-monogramme-white-v2.webp", colors: ["Bleu et blanc"],
        desc: "Claquette bleu glacier à motif intégral contrasté et semelle moulée." }),
      make({ id: "ea-logo", name: "Claquette Logo", brand: "ea7", price: 21000,
        img: "assets/products/ea7-logo-paire-noir-white-v2.webp", imgs: ["assets/products/ea7-logo-paire-noir-white-v2.webp", "assets/products/ea7-logo-paire-beige-white-v2.webp"], colors: ["Noir", "Beige"],
        valueImages: { "Coloris::Noir": "assets/products/ea7-logo-paire-noir-white-v2.webp", "Coloris::Beige": "assets/products/ea7-logo-paire-beige-white-v2.webp" },
        desc: "Bride imprimée au grand logo EA7, proposée sur semelle noire ou beige." }),
      make({ id: "as-pool", name: "Claquette Logo", brand: "allsaints", price: 20000,
        img: "assets/products/allsaints-logo-white-v2.webp", colors: ["Bleu marine"],
        desc: "Claquette bleu marine minimaliste à logo blanc, avec assise texturée." }),

      make({ id: "diesel-logo", name: "Claquette Logo Graphique", brand: "diesel", price: 29000, badge: "Nouveau",
        studio: "assets/products/diesel-logo-noir-studio.webp", img: "assets/products/diesel-logo-noir-studio.webp", imgs: ["assets/products/diesel-logo-noir-studio.webp", "assets/products/diesel-logo-argent-studio.webp"], colors: ["Noir et rouge", "Argent"],
        valueImages: { "Coloris::Noir et rouge": "assets/products/diesel-logo-noir-studio.webp", "Coloris::Argent": "assets/products/diesel-logo-argent-studio.webp" },
        desc: "Bride large à signature graphique en relief sur une semelle noire texturée." }),
      make({ id: "diesel-denim", name: "Claquette Denim", brand: "diesel", price: 29000, badge: "Nouveau",
        studio: "assets/products/diesel-denim-noir-studio.webp", img: "assets/products/diesel-denim-noir-studio.webp", imgs: ["assets/products/diesel-denim-noir-studio.webp", "assets/products/diesel-denim-rouge-studio.webp"], colors: ["Noir", "Rouge"],
        valueImages: { "Coloris::Noir": "assets/products/diesel-denim-noir-studio.webp", "Coloris::Rouge": "assets/products/diesel-denim-rouge-studio.webp" },
        desc: "Bride en textile denim à étiquette signature et semelle noire souple." }),
      make({ id: "diesel-relief", name: "Claquette Relief", brand: "diesel", price: 28000,
        studio: "assets/products/diesel-relief-gris-studio.webp", img: "assets/products/diesel-relief-gris-studio.webp", imgs: ["assets/products/diesel-relief-gris-studio.webp", "assets/products/diesel-camo-noir-studio.webp"], colors: ["Gris", "Camouflage noir"],
        valueImages: { "Coloris::Gris": "assets/products/diesel-relief-gris-studio.webp", "Coloris::Camouflage noir": "assets/products/diesel-camo-noir-studio.webp" },
        desc: "Bride souple à motif en relief, proposée en gris ou camouflage noir." }),
      make({ id: "gucci-stripe", name: "Claquette Bande Signature", brand: "gucci", price: 42000, badge: "Nouveau",
        studio: "assets/products/gucci-stripe-noir-studio.webp", img: "assets/products/gucci-stripe-noir-studio.webp", imgs: ["assets/products/gucci-stripe-noir-studio.webp", "assets/products/gucci-stripe-blanc-studio.webp"], colors: ["Noir", "Blanc"],
        valueImages: { "Coloris::Noir": "assets/products/gucci-stripe-noir-studio.webp", "Coloris::Blanc": "assets/products/gucci-stripe-blanc-studio.webp" },
        desc: "Bride large à bande contrastée sur une semelle moulée ton sur ton." }),
      make({ id: "ck-cadre", name: "Claquette Logo Encadré", brand: "calvin-klein", price: 24000,
        studio: "assets/products/calvin-klein-cadre-gris-studio.webp", img: "assets/products/calvin-klein-cadre-gris-studio.webp", imgs: ["assets/products/calvin-klein-cadre-gris-studio.webp", "assets/products/calvin-klein-cadre-blanc-studio.webp"], colors: ["Gris", "Blanc"],
        valueImages: { "Coloris::Gris": "assets/products/calvin-klein-cadre-gris-studio.webp", "Coloris::Blanc": "assets/products/calvin-klein-cadre-blanc-studio.webp" },
        desc: "Bride épurée à signature encadrée et semelle légère assortie." }),
      make({ id: "ck-logo-gris", name: "Claquette Logo Ton sur Ton", brand: "calvin-klein", price: 23000,
        studio: "assets/products/calvin-klein-logo-gris-studio.webp", img: "assets/products/calvin-klein-logo-gris-studio.webp", colors: ["Gris"],
        desc: "Modèle gris ton sur ton à signature en relief et assise moulée." }),
      make({ id: "fendi-ff", name: "Claquette Motif FF", brand: "fendi", price: 42000,
        studio: "assets/products/fendi-ff-beige-studio.webp", img: "assets/products/fendi-ff-beige-studio.webp", colors: ["Beige"],
        desc: "Bride textile à motif géométrique, avec semelle noire contrastée." }),
      make({ id: "dolce-gabbana-dg", name: "Claquette Signature DG", brand: "dolce-gabbana", price: 39000,
        studio: "assets/products/dolce-gabbana-brun-noir-studio.webp", img: "assets/products/dolce-gabbana-brun-noir-studio.webp", imgs: ["assets/products/dolce-gabbana-brun-noir-studio.webp", "assets/products/dolce-gabbana-bleu-camel-studio.webp"], colors: ["Brun et noir", "Bleu et camel"],
        valueImages: { "Coloris::Brun et noir": "assets/products/dolce-gabbana-brun-noir-studio.webp", "Coloris::Bleu et camel": "assets/products/dolce-gabbana-bleu-camel-studio.webp" },
        desc: "Bride large bicolore et semelle moulée à profil sportif." }),
      make({ id: "prada-croisee", name: "Claquette Croisée", brand: "prada", price: 43000, badge: "Nouveau",
        studio: "assets/products/prada-croisee-noir-studio.webp", img: "assets/products/prada-croisee-noir-studio.webp", imgs: ["assets/products/prada-croisee-noir-studio.webp", "assets/products/prada-croisee-bronze-studio.webp"], colors: ["Noir", "Bronze"],
        valueImages: { "Coloris::Noir": "assets/products/prada-croisee-noir-studio.webp", "Coloris::Bronze": "assets/products/prada-croisee-bronze-studio.webp" },
        desc: "Deux brides croisées matelassées sur une semelle légère assortie." }),
      make({ id: "lv-v-ton-sur-ton", name: "Claquette V Ton sur Ton", brand: "louis-vuitton", price: 49000,
        studio: "assets/products/lv-v-cognac-studio.webp", img: "assets/products/lv-v-cognac-studio.webp", imgs: ["assets/products/lv-v-cognac-studio.webp", "assets/products/lv-v-brun-fonce-studio.webp"], colors: ["Cognac", "Brun foncé"],
        valueImages: { "Coloris::Cognac": "assets/products/lv-v-cognac-studio.webp", "Coloris::Brun foncé": "assets/products/lv-v-brun-fonce-studio.webp" },
        desc: "Bride en V ton sur ton, finition grainée et semelle rembourrée." }),
      make({ id: "dior-croisee", name: "Claquette Croisée", brand: "dior", price: 48000,
        studio: "assets/products/dior-croisee-blanc-studio.webp", img: "assets/products/dior-croisee-blanc-studio.webp", colors: ["Blanc"],
        desc: "Brides croisées blanches et assise moulée pour une silhouette épurée." }),
      make({ id: "dior-oblique-slide", name: "Claquette Oblique", brand: "dior", price: 46000, badge: "Nouveau",
        studio: "assets/products/dior-oblique-noir-studio.webp", img: "assets/products/dior-oblique-noir-studio.webp", imgs: ["assets/products/dior-oblique-noir-studio.webp", "assets/products/dior-oblique-gris-studio.webp", "assets/products/dior-oblique-bleu-studio.webp", "assets/products/dior-oblique-beige-noir-studio.webp"], colors: ["Noir", "Gris", "Bleu", "Beige et noir"],
        valueImages: { "Coloris::Noir": "assets/products/dior-oblique-noir-studio.webp", "Coloris::Gris": "assets/products/dior-oblique-gris-studio.webp", "Coloris::Bleu": "assets/products/dior-oblique-bleu-studio.webp", "Coloris::Beige et noir": "assets/products/dior-oblique-beige-noir-studio.webp" },
        desc: "Bride textile à motif Oblique et semelle noire à relief discret." }),
      make({ id: "giuseppe-signature", name: "Claquette Signature Métallique", brand: "giuseppe-zanotti", price: 39000,
        studio: "assets/products/giuseppe-signature-argent-studio.webp", img: "assets/products/giuseppe-signature-argent-studio.webp", colors: ["Argent"],
        desc: "Bride argentée à finition texturée sur une semelle noire moulée." }),

      /* Catalogue Femme de démonstration. Les nombreuses teintes reçues sont
         réparties sur plusieurs fiches courtes : six coloris maximum par
         carte, tout en conservant une vraie photo pour chaque sélection. */
      make({ id: "femme-coach-mule-boucle", name: "Mule Boucle Signature", audience: "femme", cat: "claquettes", brand: "coach", price: 42000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [2, 3, 4, 4, 3, 2],
        img: "assets/products/femme/coach-mule-boucle-marron-premium.jpg",
        imgs: ["assets/products/femme/coach-mule-boucle-argent-premium.jpg", "assets/products/femme/coach-mule-boucle-ivoire-premium.jpg"],
        colors: ["Marron", "Argent", "Ivoire"],
        valueImages: { "Coloris::Marron": "assets/products/femme/coach-mule-boucle-marron-premium.jpg", "Coloris::Argent": "assets/products/femme/coach-mule-boucle-argent-premium.jpg", "Coloris::Ivoire": "assets/products/femme/coach-mule-boucle-ivoire-premium.jpg" },
        desc: "Mule ouverte à bride signature, détail métallique doré et semelle fine." }),
      make({ id: "femme-coach-matelassee", name: "Claquette Matelassée C", audience: "femme", cat: "claquettes", brand: "coach", price: 40000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [2, 3, 4, 4, 3, 2],
        img: "assets/products/femme/coach-matelassee-bleu-premium.jpg",
        imgs: ["assets/products/femme/coach-matelassee-ivoire-premium.jpg", "assets/products/femme/coach-matelassee-noir-premium.jpg", "assets/products/femme/coach-matelassee-marron-premium.jpg", "assets/products/femme/coach-matelassee-rose-premium.jpg"],
        colors: ["Bleu", "Ivoire", "Noir", "Marron", "Rose"],
        valueImages: { "Coloris::Bleu": "assets/products/femme/coach-matelassee-bleu-premium.jpg", "Coloris::Ivoire": "assets/products/femme/coach-matelassee-ivoire-premium.jpg", "Coloris::Noir": "assets/products/femme/coach-matelassee-noir-premium.jpg", "Coloris::Marron": "assets/products/femme/coach-matelassee-marron-premium.jpg", "Coloris::Rose": "assets/products/femme/coach-matelassee-rose-premium.jpg" },
        desc: "Bride matelassée souple, détail C métallique et semelle légère." }),
      make({ id: "femme-coach-signature", name: "Claquette Signature Toile", audience: "femme", cat: "claquettes", brand: "coach", price: 38000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [2, 3, 4, 4, 3, 2],
        img: "assets/products/femme/coach-signature-marron-premium.jpg", colors: ["Marron"],
        valueImages: { "Coloris::Marron": "assets/products/femme/coach-signature-marron-premium.jpg" },
        desc: "Claquette carrée en toile signature, semelle brun cognac et ligne épurée." }),
      make({ id: "femme-coach-badge", name: "Claquette Badge Signature", audience: "femme", cat: "claquettes", brand: "coach", price: 36000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [2, 3, 4, 4, 3, 2],
        img: "assets/products/femme/coach-badge-beige-premium.jpg", colors: ["Beige"],
        valueImages: { "Coloris::Beige": "assets/products/femme/coach-badge-beige-premium.jpg" },
        desc: "Bride large en toile beige, badge signature et assise souple." }),
      make({ id: "coach-slide-signature-noir", name: "Slide Signature", audience: "homme", cat: "claquettes", brand: "coach", price: 0,
        sizes: ["39", "40", "41", "42", "43", "44", "45"], stock: [0, 0, 0, 0, 0, 0, 0], active: false, stockout: true,
        studio: "assets/products/homme/coach-slide-signature-bleu-studio.jpg", img: "assets/products/homme/coach-slide-signature-bleu-studio.jpg",
        imgs: ["assets/products/homme/coach-slide-signature-beige-studio.jpg", "assets/products/homme/coach-slide-signature-marine-studio.jpg", "assets/products/homme/coach-slide-signature-olive-studio.jpg", "assets/products/homme/coach-slide-signature-noir-studio.jpg"],
        colors: ["Bleu", "Beige", "Bleu marine", "Olive", "Noir"],
        valueImages: { "Coloris::Bleu": "assets/products/homme/coach-slide-signature-bleu-studio.jpg", "Coloris::Beige": "assets/products/homme/coach-slide-signature-beige-studio.jpg", "Coloris::Bleu marine": "assets/products/homme/coach-slide-signature-marine-studio.jpg", "Coloris::Olive": "assets/products/homme/coach-slide-signature-olive-studio.jpg", "Coloris::Noir": "assets/products/homme/coach-slide-signature-noir-studio.jpg" },
        desc: "Slide à bride en toile signature et semelle monobloc." }),
      make({ id: "coach-sabot-boucle", name: "Sabot Boucle Signature", audience: "homme", cat: "mules", brand: "coach", price: 0,
        sizes: ["39", "40", "41", "42", "43", "44", "45"], stock: [0, 0, 0, 0, 0, 0, 0], active: false, stockout: true,
        studio: "assets/products/homme/coach-sabot-boucle-bleu-studio.jpg", img: "assets/products/homme/coach-sabot-boucle-bleu-studio.jpg",
        imgs: ["assets/products/homme/coach-sabot-boucle-marron-studio.jpg", "assets/products/homme/coach-sabot-boucle-noir-studio.jpg"],
        colors: ["Bleu", "Marron", "Noir"],
        valueImages: { "Coloris::Bleu": "assets/products/homme/coach-sabot-boucle-bleu-studio.jpg", "Coloris::Marron": "assets/products/homme/coach-sabot-boucle-marron-studio.jpg", "Coloris::Noir": "assets/products/homme/coach-sabot-boucle-noir-studio.jpg" },
        desc: "Sabot en toile signature avec bride réglable et boucle métallique." }),
      make({ id: "femme-coach-double-bride-rose", name: "Sandale Double Bride", audience: "femme", cat: "sandales", brand: "coach", price: 0,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [0, 0, 0, 0, 0, 0], active: false, stockout: true,
        img: "assets/products/femme/coach-double-bride-rose-studio.jpg", colors: ["Rose"],
        valueImages: { "Coloris::Rose": "assets/products/femme/coach-double-bride-rose-studio.jpg" },
        desc: "Sandale rose à deux brides en toile signature et boucle métallique." }),
      make({ id: "femme-hermes-oran-vives", name: "Sandale Oran Couleurs Vives", audience: "femme", brand: "hermes", price: 52000, badge: "Nouveau",
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [1, 2, 3, 3, 2, 1],
        img: "assets/products/femme/hermes-oran-rouge.jpg", colors: ["Rouge", "Vert", "Bleu ciel", "Bleu marine", "Corail", "Orange"],
        valueImages: { "Coloris::Rouge": "assets/products/femme/hermes-oran-rouge.jpg", "Coloris::Vert": "assets/products/femme/hermes-oran-vert.jpg", "Coloris::Bleu ciel": "assets/products/femme/hermes-oran-bleu-ciel.jpg", "Coloris::Bleu marine": "assets/products/femme/hermes-oran-marine.jpg", "Coloris::Corail": "assets/products/femme/hermes-oran-corail.jpg", "Coloris::Orange": "assets/products/femme/hermes-oran-orange.jpg" },
        desc: "Sandale ouverte à découpe H, proposée dans une sélection de couleurs franches." }),
      make({ id: "femme-hermes-oran-douces", name: "Sandale Oran Tons Doux", audience: "femme", brand: "hermes", price: 52000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [1, 2, 3, 3, 2, 1],
        img: "assets/products/femme/hermes-oran-jaune.jpg", colors: ["Jaune", "Beige", "Taupe", "Violet", "Fuchsia", "Rose"],
        valueImages: { "Coloris::Jaune": "assets/products/femme/hermes-oran-jaune.jpg", "Coloris::Beige": "assets/products/femme/hermes-oran-beige.jpg", "Coloris::Taupe": "assets/products/femme/hermes-oran-taupe.jpg", "Coloris::Violet": "assets/products/femme/hermes-oran-violet.jpg", "Coloris::Fuchsia": "assets/products/femme/hermes-oran-fuchsia.jpg", "Coloris::Rose": "assets/products/femme/hermes-oran-rose.jpg" },
        desc: "La découpe H emblématique dans des teintes douces et lumineuses." }),
      make({ id: "femme-hermes-oran-essentiels", name: "Sandale Oran Les Essentiels", audience: "femme", brand: "hermes", price: 52000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [1, 2, 3, 3, 2, 1],
        img: "assets/products/femme/hermes-oran-rose-poudre.jpg", colors: ["Rose poudré", "Rose doré", "Caramel", "Marron", "Noir", "Blanc"],
        valueImages: { "Coloris::Rose poudré": "assets/products/femme/hermes-oran-rose-poudre.jpg", "Coloris::Rose doré": "assets/products/femme/hermes-oran-rose-dore.jpg", "Coloris::Caramel": "assets/products/femme/hermes-oran-caramel.jpg", "Coloris::Marron": "assets/products/femme/hermes-oran-marron.jpg", "Coloris::Noir": "assets/products/femme/hermes-oran-noir.jpg", "Coloris::Blanc": "assets/products/femme/hermes-oran-blanc.jpg" },
        desc: "Six teintes essentielles faciles à porter, sur une semelle fine et épurée." }),
      make({ id: "femme-hermes-oran-soiree", name: "Sandale Oran Finitions Soirée", audience: "femme", brand: "hermes", price: 55000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [1, 2, 2, 2, 1, 1],
        img: "assets/products/femme/hermes-oran-noir-tan.jpg", colors: ["Noir et camel", "Noir et or", "Noir et argent", "Noir graphique", "Noir strass", "Orange cuir"],
        valueImages: { "Coloris::Noir et camel": "assets/products/femme/hermes-oran-noir-tan.jpg", "Coloris::Noir et or": "assets/products/femme/hermes-oran-noir-or.jpg", "Coloris::Noir et argent": "assets/products/femme/hermes-oran-noir-argent.jpg", "Coloris::Noir graphique": "assets/products/femme/hermes-oran-noir-graphique.jpg", "Coloris::Noir strass": "assets/products/femme/hermes-oran-noir-strass.jpg", "Coloris::Orange cuir": "assets/products/femme/hermes-oran-orange-cuir.jpg" },
        desc: "Des finitions métallisées et graphiques pour une allure plus habillée." }),
      make({ id: "femme-dior-dway-bleus", name: "Claquette Dway Bleus & Noirs", audience: "femme", brand: "dior", price: 48000, badge: "Nouveau",
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [1, 2, 3, 3, 2, 1],
        img: "assets/products/femme/dior-dway-marine-studio.jpg", colors: ["Toile bleu-noir", "Toile bleue", "Toile dorée", "Noir", "Toile noire", "Rose poudré"],
        valueImages: { "Coloris::Toile bleu-noir": "assets/products/femme/dior-dway-toile-bleu-noir.jpg", "Coloris::Toile bleue": "assets/products/femme/dior-dway-toile-bleu.jpg", "Coloris::Toile dorée": "assets/products/femme/dior-dway-toile-gris.jpg", "Coloris::Noir": "assets/products/femme/dior-dway-noir.jpg", "Coloris::Toile noire": "assets/products/femme/dior-dway-toile-noir.jpg", "Coloris::Rose poudré": "assets/products/femme/dior-dway-rose-poudre.jpg" },
        desc: "Claquette à bride textile large, déclinée dans des motifs bleus, noirs et gris." }),
      make({ id: "femme-dior-dway-pastels", name: "Claquette Dway Tons Pastel", audience: "femme", brand: "dior", price: 48000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [1, 2, 3, 3, 2, 1],
        img: "assets/products/femme/dior-dway-rose.jpg", colors: ["Ivoire doré", "Noir profond", "Rose", "Toile rose", "Marine", "Gris anthracite"],
        valueImages: { "Coloris::Ivoire doré": "assets/products/femme/dior-dway-bleu-glacier.jpg", "Coloris::Noir profond": "assets/products/femme/dior-dway-noir-profond.jpg", "Coloris::Rose": "assets/products/femme/dior-dway-rose.jpg", "Coloris::Toile rose": "assets/products/femme/dior-dway-lilas.jpg", "Coloris::Marine": "assets/products/femme/dior-dway-marine.jpg", "Coloris::Gris anthracite": "assets/products/femme/dior-dway-gris-anthracite.jpg" },
        desc: "Une seconde sélection de teintes pastel et profondes pour garder chaque fiche lisible." }),
      make({ id: "femme-birkenstock-boston-rose", name: "Sabot Boston Rose", audience: "femme", cat: "mules", brand: "birkenstock", price: 32000, badge: "Nouveau",
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [1, 2, 3, 3, 2, 1],
        img: "assets/products/femme/birkenstock-boston-rose-studio.jpg", colors: ["Rose poudré"],
        valueImages: { "Coloris::Rose poudré": "assets/products/femme/birkenstock-boston-rose-studio.jpg" },
        desc: "Sabot fermé en matière douce rose poudré, bride réglable et semelle contrastée." }),
      make({ id: "femme-hermes-chypre-bleu", name: "Sandale Chypre Bleu Glacier", audience: "femme", brand: "hermes", price: 55000,
        sizes: ["36", "37", "38", "39", "40", "41"], stock: [1, 2, 3, 3, 2, 1],
        img: "assets/products/femme/hermes-chypre-bleu-studio.jpg", colors: ["Ivoire doré"],
        valueImages: { "Coloris::Ivoire doré": "assets/products/femme/hermes-chypre-bleu-studio.jpg" },
        desc: "Sandale bleu glacier à double bride, découpe H et semelle noire contrastée." })
    ];
  }

  function settings() {
    return {
      whatsapp: "22393249365",
      shopName: "T&K SHOES",
      logo: "assets/brand/tk-shoes-nav.png",
      shareImage: "https://boutique-aura-studios.vercel.app/assets/brand/tk-shoes-share.jpg",
      address: "Kalaban Coura, Bamako",
      hours: "Lun–ven 09h–22h · Sam 10h–22h · Dim fermé",
      deliveryFee: 2500,
      deliveryFeeMin: 2000,
      freeFrom: 40000,
      /* Délai de livraison annoncé. Modifiable depuis l'administration :
         il alimente à la fois les cartes produit, le bandeau de réassurance
         et les mentions du hero, pour qu'ils ne puissent jamais diverger.
         Exemples : "5 jours", "48h", "2 à 3 jours", "1 semaine". */
      deliveryTime: "5 jours",
      /* Délai d'échange annoncé. Comme le délai de livraison, il est écrit
         une seule fois ici : une promesse figée dans le HTML ne peut plus
         être ajustée quand la réalité du terrain change. */
      exchangeTime: "24h",
      payments: ["Espèces à la livraison", "Espèces au retrait", "Orange Money"],
      legal: { forme: "", email: "mohamedsambakessy8@gmail.com", adresse: "Kalaban Coura, Bamako", rccm: "", nif: "" },
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
          image: "assets/hero-hugo-20260824.webp",
          badge: "Collection 2026 · Bamako",
          kicker: "Claquettes · Mules · Sabots",
          title: "Les modèles qui comptent",
          sub: "Des modèles originaux, en pointures 39 à 45. Commande simple par WhatsApp et livraison à Bamako.",
          cta1: "Voir les marques",
          cta2: "Tout le catalogue"
        },
        banner: {
          on: true,
          image: "assets/banniere-premium-20260824.webp",
          kicker: "Sélection de la semaine",
          title: "Prêtes à porter, tout de suite.",
          text: "Semelle moulée, bride renforcée, pointures complètes. Les modèles qui partent le plus vite.",
          cta1: "Voir la sélection",
          cta2: "Les mules"
        },
        editorial: {
          on: true,
          image: "assets/editorial-selection-20260824.webp",
          kicker: "La maison",
          title: "Le vrai, au bon prix",
          text: "T&K SHOES sélectionne des modèles originaux de plusieurs marques. Ce que vous voyez est ce que vous recevez.",
          pillars: [
            { title: "Produits originaux", text: "Chaque modèle est vendu comme produit original par un revendeur multimarques indépendant." },
            { title: "Pointures complètes", text: "Du 39 au 45 sur la majorité des modèles, avec le stock réel affiché." },
            { title: "Livraison simple", text: "Bamako sous 5 jours. Paiement à la livraison, au retrait ou par Orange Money après confirmation." }
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
      /* Deux univers éditoriaux sous la même identité T&K. Femme reste hors
         navigation tant qu'il n'a ni vraie bannière ni vrai produit actif. */
      audiencePages: {
        homme: {
          heroImage: "assets/hero-hugo-20260824.webp",
          title: "Les modèles Homme",
          text: "Claquettes, mules et sabots sélectionnés pour leur style, leur confort et leur disponibilité à Bamako.",
          featuredProducts: ["gucci-stripe", "prada-croisee", "dior-oblique-slide", "diesel-logo"]
        },
        femme: {
          heroImage: "assets/hero-femme-20260824.jpg",
          title: "Les modèles Femme",
          text: "Sandales, claquettes et sabots en pointures 36 à 41, avec chaque coloris visible avant de commander.",
          /* Ces modèles viennent d'un autre circuit que le stock présent en
             boutique : annoncer le délai du rayon Homme serait une promesse
             intenable. Vide, le rayon reprendrait le délai général. */
          deliveryTime: "10 jours",
          featuredProducts: ["femme-coach-mule-boucle", "femme-coach-matelassee", "femme-hermes-oran-vives", "femme-dior-dway-bleus"]
        }
      },
      collections: [
        { key: "louis-vuitton", featured: true, label: "Louis Vuitton", logo: "assets/logos/louis-vuitton.png", tagline: "Monogram", accent: "#6b4f2a", cover: "assets/brand-banners/louis-vuitton.webp", homeProducts: ["lv-signature", "lv-relief", "lv-v-croisee", "lv-damier"],
          desc: "Cuir embossé et bande signature. La pièce que tout le monde identifie." },
        { key: "calvin-klein", featured: true, label: "Calvin Klein", logo: "assets/logos/calvin-klein.svg", tagline: "Minimalisme américain", accent: "#2E3A46", cover: "assets/brand-banners/calvin-klein.webp", homeProducts: ["ck-double-bride", "ck-jeans", "ck-band", "ck-pool"],
          desc: "Le logo embossé sur bride large. Une claquette qui se reconnaît de loin." },
        { key: "hugo", featured: true, label: "HUGO", logo: "assets/logos/hugo.svg", tagline: "Bande rouge", accent: "#a3262b", cover: "assets/brand-banners/hugo.webp", homeProducts: ["hg-red", "hg-mono"],
          desc: "La bande contrastée et le monogramme répété. Sport et net." },
        { key: "hermes", featured: true, label: "Hermès", logo: "assets/logos/hermes.png", tagline: "H signature", accent: "#d86f25", cover: "assets/brand-banners/hermes.webp", homeProducts: ["hermes-chypre", "hermes-chypre-bordeaux", "hermes-chypre-vives", "hermes-chypre-daim"],
          desc: "Cuir orange, découpe H et semelle noire. Une silhouette immédiatement reconnaissable." },
        { key: "burberry", label: "Burberry", logo: "assets/logos/burberry.png", tagline: "Vintage Check", accent: "#B08A5E", cover: "assets/brand-banners/burberry.webp",
          desc: "Le tartan maison, décliné en trois teintes." },
        { key: "givenchy", label: "Givenchy", logo: "assets/logos/givenchy.png", tagline: "Paris", accent: "#4A3B52", cover: "assets/brand-banners/givenchy.webp",
          desc: "L'inscription signature centrée sur la bride. Sobre et immédiat." },
        { key: "dior", label: "Dior", logo: "assets/logos/dior.svg", tagline: "Oblique", accent: "#5B6B7A", cover: "assets/brand-banners/dior.webp",
          desc: "Toile jacquard au motif maison. La mule d'intérieur qui se porte dehors." },
        { key: "birkenstock", label: "Birkenstock", logo: "", tagline: "Boston", accent: "#B78F86", cover: "assets/products/femme/birkenstock-boston-rose-studio.jpg",
          desc: "Le sabot fermé à boucle, dans une teinte rose poudré facile à porter." },
        { key: "balenciaga", label: "Balenciaga", logo: "assets/logos/capture-balenciaga.png", tagline: "Mold", accent: "#111111", cover: "assets/brand-banners/balenciaga.webp",
          desc: "Caoutchouc moulé d'une seule pièce. Une silhouette qu'on ne confond pas." },
        { key: "tommy-jeans", label: "Tommy Jeans", logo: "assets/logos/capture-tommy-jeans.png", tagline: "Flag", accent: "#1c3a6e", cover: "assets/brand-banners/tommy-jeans.webp",
          desc: "Le drapeau tricolore en grand sur la bride." },
        { key: "moncler", label: "Moncler", logo: "assets/logos/capture-moncler.png", tagline: "Monogramme", accent: "#2F7FC4", cover: "assets/brand-banners/moncler.webp",
          desc: "Imprimé graphique intégral, bleu et blanc." },
        { key: "ea7", label: "EA7 Emporio Armani", logo: "assets/logos/capture-ea7.png", tagline: "Sport", accent: "#5D7A8C", cover: "assets/brand-banners/ea7.webp",
          desc: "Texture technique et logo large. Pensée pour l'été." },
        { key: "allsaints", label: "AllSaints", logo: "assets/logos/allsaints.svg", tagline: "Minimal", accent: "#6E6459", cover: "assets/brand-banners/allsaints.webp",
          desc: "Bleu marine et logo blanc. Rien de plus." },
        { key: "ferragamo", label: "Ferragamo", logo: "assets/logos/ferragamo.svg", tagline: "Gancini", accent: "#4F5730", cover: "assets/brand-banners/ferragamo.webp",
          desc: "Bride croisée et détail Gancini. Une ligne souple aux tons naturels." },
        { key: "bally", label: "Bally", logo: "assets/logos/bally.svg", tagline: "Swiss heritage", accent: "#15233A", cover: "assets/brand-banners/bally.webp",
          desc: "Brides croisées et contraste graphique. Une silhouette nette et confortable." }
        ,{ key: "diesel", label: "Diesel", logo: "", tagline: "Graphique", accent: "#C31F26", cover: "assets/products/diesel-logo-noir-studio.webp",
          desc: "Claquettes graphiques, denim et reliefs sur semelles moulées." }
        ,{ key: "gucci", label: "Gucci", logo: "", tagline: "Bande signature", accent: "#315B3B", cover: "assets/products/gucci-stripe-noir-studio.webp",
          desc: "Une ligne nette construite autour de la bande contrastée." }
        ,{ key: "fendi", label: "Fendi", logo: "", tagline: "Motif FF", accent: "#A9854D", cover: "assets/products/fendi-ff-beige-studio.webp",
          desc: "Motif géométrique beige et noir sur une silhouette quotidienne." }
        ,{ key: "dolce-gabbana", label: "Dolce & Gabbana", logo: "", tagline: "Signature DG", accent: "#4F382A", cover: "assets/products/dolce-gabbana-brun-noir-studio.webp",
          desc: "Brides bicolores et semelles sportives aux contrastes affirmés." }
        ,{ key: "prada", label: "Prada", logo: "", tagline: "Croisée", accent: "#6B5B4B", cover: "assets/products/prada-croisee-noir-studio.webp",
          desc: "Brides croisées matelassées et palette sobre." }
        ,{ key: "giuseppe-zanotti", label: "Giuseppe Zanotti", logo: "", tagline: "Signature métallique", accent: "#777777", cover: "assets/products/giuseppe-signature-argent-studio.webp",
          desc: "Finition métallique et semelle noire pour une ligne habillée." }
,{ key: "coach", featured: true, label: "Coach", logo: "assets/logos/coach.svg", tagline: "Signature C", accent: "#9A6B45", cover: "assets/brand-banners/coach.jpg", homeProducts: ["femme-coach-mule-boucle", "femme-coach-matelassee", "femme-coach-signature", "femme-coach-badge"],
          desc: "Toile signature, cuir souple et détails métalliques dorés. Une sélection féminine pensée pour l'été." }
      ],
      announcement: "Livraison offerte dès 40 000 FCFA · sous 48h à Bamako",
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
