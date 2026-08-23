/* Logique de la boutique. Extraite de la page pour être partagée par
   l'accueil, les pages de marque et le catalogue : une seule définition,
   donc aucune divergence possible entre les pages. */

/* ---------------- Coque partagée ----------------
   Bandeau d'annonce, navigation, menu mobile, tiroir panier, modales, bouton
   WhatsApp, message flottant et pied de page sont identiques sur toutes les
   pages. Ils sont injectés ici plutôt que recopiés dans chaque fichier : une
   correction se fait à un seul endroit. */
(function construireCoque(){
  var avant = '  <a class="skip-link" href="catalogue.html">Aller au catalogue</a>\n' +
    '  <div class="announce" data-od-id="announcement-bar" id="announce"></div>\n' +
    '\n' +
    '  <header class="nav" data-od-id="page-nav">\n' +
    '    <div class="nav-inner">\n' +
    '      <div class="nav-left">\n' +
    '        <button class="icon-btn burger" data-od-id="nav-burger" id="navBurger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobileMenu">\n' +
    '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>\n' +
    '        </button>\n' +
    '        <a href="index.html" class="logo" id="logoNav" data-od-id="brand-wordmark"></a>\n' +
    '      </div>\n' +
    '      <nav class="nav-links" id="navLinks" aria-label="Navigation principale">\n' +
    '        <a href="catalogue.html" data-goto="tous">Nouveautés</a>\n' +
    '      </nav>\n' +
    '      <div class="nav-right">\n' +
    '        <button class="icon-btn" data-od-id="nav-search" id="navSearch" aria-label="Rechercher">\n' +
    '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>\n' +
    '        </button>\n' +
    '        <button class="icon-btn" data-od-id="nav-cart" aria-label="Ouvrir le panier">\n' +
    '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.4"/><circle cx="19" cy="21" r="1.4"/><path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21.5 7H6.1"/></svg>\n' +
    '          <span class="cart-count" id="cartCount" data-hidden="true">0</span>\n' +
    '        </button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="mobile-menu" id="mobileMenu" data-od-id="nav-mobile-menu">\n' +
    '      <a href="catalogue.html" data-goto="tous">Nouveautés</a>\n' +
    '    </div>\n' +
    '  </header>';
  var apres = '  <footer class="footer" data-od-id="footer">\n' +
    '    <div class="wrap">\n' +
    '      <div class="footer-grid">\n' +
    '        <div class="footer-brand">\n' +
    '          <a href="index.html" class="logo" id="logoPied" style="font-size:26px"></a>\n' +
    '          <p id="piedTexte"></p>\n' +
    '          <p class="footer-independent">Revendeur multimarques indépendant.</p>\n' +
    '          <p id="footerContact" class="footer-contact" hidden></p>\n' +
    '          <div class="social" id="socialRow">\n' +
    '            <a href="#" id="socialIG" target="_blank" rel="noopener" aria-label="Instagram" data-od-id="social-instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg></a>\n' +
    '            <a href="#" id="socialTT" target="_blank" rel="noopener" aria-label="TikTok" data-od-id="social-tiktok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4c.5 2.5 2.5 4.5 5 5"/></svg></a>\n' +
    '            <a href="#" id="socialYT" target="_blank" rel="noopener" aria-label="YouTube" data-od-id="social-youtube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="3.5"/><path d="M10 9.5 15 12l-5 2.5Z" fill="currentColor" stroke="none"/></svg></a>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="fcol" data-od-id="footer-col-boutique">\n' +
    '          <h2>Boutique</h2>\n' +
    '          <ul id="footShop"></ul>\n' +
    '        </div>\n' +
    '        <div class="fcol" data-od-id="footer-col-aide">\n' +
    '          <h2>Aide</h2>\n' +
    '          <ul>\n' +
    '            <li><a href="#" id="helpDelivery" target="_blank" rel="noopener">Livraison à Bamako</a></li>\n' +
    '            <li><a href="guide-des-tailles.html">Guide des tailles</a></li>\n' +
    '            <li><a href="#" id="helpOrder" target="_blank" rel="noopener">Suivi de commande</a></li>\n' +
    '            <li><a href="#" id="helpContact" target="_blank" rel="noopener">Contact WhatsApp</a></li>\n' +
    '          </ul>\n' +
    '        </div>\n' +
    '        <div class="fcol" data-od-id="footer-col-apropos">\n' +
    '          <h2>À propos</h2>\n' +
    '          <ul>\n' +
    '            <li><a href="index.html#a-propos">Notre histoire</a></li>\n' +
    '            <li><a href="#" id="helpPress" target="_blank" rel="noopener">Presse</a></li>\n' +
    '            <li><a href="admin.html">Espace vendeur</a></li>\n' +
    '          </ul>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="footer-bottom">\n' +
    '        <p id="footerBrandLine">© 2026 SNEAK BAMAKO. Tous droits réservés.</p>\n' +
    '        <nav>\n' +
    '          <a href="cgv.html">CGV</a>\n' +
    '          <a href="confidentialite.html">Confidentialité</a>\n' +
    '          <a href="admin.html">Administration</a>\n' +
    '        </nav>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </footer>\n' +
    '  <div class="overlay" id="overlay" data-od-id="cart-overlay"></div>\n' +
    '  <div class="m-overlay" id="errOverlay" role="alertdialog" aria-modal="true" aria-labelledby="errTitle" aria-hidden="true">\n' +
    '    <div class="modal s-modal">\n' +
    '      <div class="m-head">\n' +
    '        <h3 id="errTitle">Commande non enregistrée</h3>\n' +
    '        <button class="icon-btn" data-close="errOverlay" aria-label="Fermer">\n' +
    '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>\n' +
    '        </button>\n' +
    '      </div>\n' +
    '      <div class="m-body">\n' +
    '        <p id="errText" style="margin-bottom:16px"></p>\n' +
    '        <button class="btn btn-primary btn-full" data-close="errOverlay">Fermer</button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <aside class="drawer" id="cartDrawer" data-od-id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true">\n' +
    '    <div class="drawer-head">\n' +
    '      <h3 id="cartTitle">Mon panier</h3>\n' +
    '      <button class="icon-btn" id="cartClose" data-od-id="cart-close" aria-label="Fermer le panier">\n' +
    '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '    <div class="drawer-body" id="cartBody"></div>\n' +
    '    <div class="drawer-foot" id="cartFoot">\n' +
    '      <div class="freeship" id="freeShip" hidden>\n' +
    '        <p id="freeShipMsg"></p>\n' +
    '        <div class="bar"><i id="freeShipBar" style="width:0%"></i></div>\n' +
    '      </div>\n' +
    '      <div class="subtotal-row"><span>Sous-total</span><strong id="cartSubtotal">0 FCFA</strong></div>\n' +
    '      <div class="subtotal-row" id="cartDeliveryRow"><span>Livraison</span><strong id="cartDelivery">0 FCFA</strong></div>\n' +
    '      <div class="subtotal-row" style="font-size:15px"><span>Total</span><strong id="cartTotal">0 FCFA</strong></div>\n' +
    '      <p class="delivery-note" id="cartDeliveryNote"></p>\n' +
    '      <button class="btn btn-primary btn-full" data-od-id="cart-checkout" id="checkoutBtn">Passer commande</button>\n' +
    '      <button class="btn btn-ghost-dark btn-full" id="cartContinue" data-od-id="cart-continue">Continuer mes achats</button>\n' +
    '    </div>\n' +
    '  </aside>\n' +
    '\n' +
    '  <div class="m-overlay" id="pvOverlay" role="dialog" aria-modal="true" aria-label="Fiche produit" aria-hidden="true">\n' +
    '    <div class="modal">\n' +
    '      <div class="m-head">\n' +
    '        <h3>Fiche produit</h3>\n' +
    '        <button class="icon-btn" data-close="pvOverlay" aria-label="Fermer">\n' +
    '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>\n' +
    '        </button>\n' +
    '      </div>\n' +
    '      <div class="pv-grid">\n' +
    '        <div class="pv-media" id="pvMedia"></div>\n' +
    '        <div class="pv-info">\n' +
    '          <span class="pcat" id="pvCat"></span>\n' +
    '          <h3 id="pvName"></h3>\n' +
    '          <span class="price" id="pvPrice"></span>\n' +
    '          <p class="pv-desc" id="pvDesc"></p>\n' +
    '          <span class="size-label" style="margin-top:6px">Taille</span>\n' +
    '          <div id="pvAxes"></div>\n' +
    '          <span class="stock-line" id="pvStock"></span>\n' +
    '          <div id="pvWaitlistHost"></div>\n' +
    '          <span class="size-label">Quantité</span>\n' +
    '          <div class="qty-stepper">\n' +
    '            <button id="pvMinus" aria-label="Diminuer">−</button>\n' +
    '            <span id="pvQtyVal">1</span>\n' +
    '            <button id="pvPlus" aria-label="Augmenter">+</button>\n' +
    '          </div>\n' +
    '          <button class="btn btn-primary btn-full" id="pvAdd" style="margin-top:8px">Ajouter au panier</button>\n' +
    '          <button type="button" class="about-link" id="pvBuyNow" style="justify-content:center">Commander maintenant</button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="m-overlay" id="coOverlay" role="dialog" aria-modal="true" aria-label="Finaliser la commande" aria-hidden="true">\n' +
    '    <div class="modal">\n' +
    '      <div class="m-head">\n' +
    '        <h3>Finaliser la commande</h3>\n' +
    '        <button class="icon-btn" data-close="coOverlay" aria-label="Fermer">\n' +
    '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>\n' +
    '        </button>\n' +
    '      </div>\n' +
    '      <div class="m-body" id="coStepForm">\n' +
    '        <div id="coSummary"></div>\n' +
    '        <form id="coForm" novalidate>\n' +
    '          <div class="field">\n' +
    '            <label for="coName">Nom complet</label>\n' +
    '            <input type="text" id="coName" placeholder="Adama Traoré" autocomplete="name" />\n' +
    '            <p class="err" id="errName">Veuillez indiquer votre nom complet.</p>\n' +
    '          </div>\n' +
    '          <div class="field">\n' +
    '            <label for="coPhone">Numéro de téléphone</label>\n' +
    '            <input type="tel" id="coPhone" placeholder="76 12 34 56" inputmode="tel" autocomplete="tel" />\n' +
    '            <p class="hint">Format Mali : 76 12 34 56</p>\n' +
    '            <p class="err" id="errPhone">Numéro invalide (8 chiffres minimum).</p>\n' +
    '          </div>\n' +
    '          <div class="field">\n' +
    '            <label for="coQuartier">Quartier de livraison (Bamako)</label>\n' +
    '            <input type="text" id="coQuartier" placeholder="ACI 2000, Hamdallaye, Korofina…" list="quartiers" />\n' +
    '            <datalist id="quartiers">\n' +
    '              <option value="ACI 2000"></option><option value="Hamdallaye"></option><option value="Korofina"></option>\n' +
    '              <option value="Badalabougou"></option><option value="Lafiabougou"></option><option value="Faladié"></option>\n' +
    '              <option value="Magnambougou"></option><option value="Niamakoro"></option><option value="Sanja"></option><option value="Sotuba"></option>\n' +
    '            </datalist>\n' +
    '            <p class="err" id="errQuartier">Veuillez indiquer votre quartier de livraison.</p>\n' +
    '          </div>\n' +
    '          <div class="wa-note">\n' +
    '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;flex-shrink:0"><path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 7.8 19.4Z"/></svg>\n' +
    '            <span>Aucun paiement en ligne. Vous serez redirigé vers WhatsApp : un agent confirme votre commande et la livraison.</span>\n' +
    '          </div>\n' +
    '          <button type="submit" class="btn btn-primary btn-full" id="coSubmit">Commander via WhatsApp</button>\n' +
    '        </form>\n' +
    '      </div>\n' +
    '      <div class="m-body" id="coStepDone" style="display:none">\n' +
    '        <div class="wa-success">\n' +
    '          <div class="ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>\n' +
    '          <h3>Commande enregistrée !</h3>\n' +
    '          <span class="ref-line">Référence : <strong id="waRef"></strong></span>\n' +
    '          <p>Un agent vous répondra sur WhatsApp pour valider la livraison. Si l\'application ne s\'ouvre pas, copiez le texte de la commande.</p>\n' +
    '          <textarea class="wa-msg" id="waMsg" readonly aria-label="Résumé de la commande"></textarea>\n' +
    '          <div class="wa-buttons">\n' +
    '            <a class="btn btn-primary btn-full" id="waLink" target="_blank" rel="noopener">Ouvrir WhatsApp</a>\n' +
    '            <button class="btn btn-ghost-dark btn-full" id="waCopy">Copier le texte de la commande</button>\n' +
    '            <button class="btn btn-ghost-dark btn-full" id="waClose">Fermer</button>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="m-overlay" id="soOverlay" role="dialog" aria-modal="true" aria-label="Recherche" aria-hidden="true">\n' +
    '    <div class="modal s-modal">\n' +
    '      <div class="m-head">\n' +
    '        <h3>Rechercher</h3>\n' +
    '        <button class="icon-btn" data-close="soOverlay" aria-label="Fermer">\n' +
    '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>\n' +
    '        </button>\n' +
    '      </div>\n' +
    '      <div class="m-body">\n' +
    '        <input class="search-in" id="soInput" type="search" aria-label="Rechercher un produit" placeholder="Marque, modèle, pointure…" autocomplete="off" />\n' +
    '        <ul class="search-results" id="soRes"></ul>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <a class="wa-float" id="waFloat" target="_blank" rel="noopener" aria-label="Nous ecrire sur WhatsApp">\n' +
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>\n' +
    '    <span>WhatsApp</span>\n' +
    '  </a>\n' +
    '\n' +
    '  <div class="toast" id="toast" data-od-id="toast" role="status" aria-live="polite"></div>';
  var conteneur = document.getElementById("page");
  if (!conteneur) return;
  conteneur.insertAdjacentHTML("beforebegin", avant);
  conteneur.insertAdjacentHTML("afterend", apres);
  /* La page produit affiche la fiche en pleine page et porte donc deja
     `pvMedia`, `pvAxes`, `pvAdd`… La modale injectee par la coque
     dupliquerait ces identifiants : le script ecrirait dans la copie
     cachee et la page resterait vide. On la retire. */
  if (document.body.getAttribute("data-page") === "produit"){
    var modale = document.getElementById("pvOverlay");
    if (modale) modale.remove();
  }
})();

/* Une photo qui échoue est réessayée une fois avec un paramètre unique,
   puis effacée en silence si elle manque vraiment. Le navigateur garde en
   cache les réponses manquantes : un visiteur venu pendant une mise en
   ligne incomplète continuait à voir des trous longtemps après la
   correction, alors que le fichier était revenu sur le serveur. */
window.AURA_IMG = function (img) {
  if (!img || img.dataset.retry === "1") { if (img) img.style.opacity = 0; return; }
  img.dataset.retry = "1";
  var src = img.getAttribute("src") || "";
  if (!src) { img.style.opacity = 0; return; }
  img.setAttribute("src", src + (src.indexOf("?") >= 0 ? "&" : "?") + "r=" + Date.now());
};

(function(){
  /* Nouvelle clé après le remplacement des visuels : un téléphone revenu
     plusieurs jours plus tard ne doit pas repeindre l'ancien catalogue
     depuis son stockage local avant la réponse du serveur. */
  var KEY = "aura_store_v10";
  var CKEY = "aura_cart_v1";
  var WKEY = "aura_wish_v1";
  var LOCAL_DEMO = (location.hostname === "127.0.0.1" || location.hostname === "localhost") &&
    (/[?&](?:demo|preview)=1(?:&|$)/.test(location.search) || sessionStorage.getItem("aura_preview_active") === "1");
  var VSEP = window.AURA_CATALOG.VSEP || "::";

  /* ---------------- Variantes ----------------
     Un produit porte ses axes (« Taille », « Pointure », « Couleur »…) et un
     stock par combinaison. Aucun axe : une seule variante, de clé vide. */
  function prodAxes(p){
    return (p && Array.isArray(p.axes)) ? p.axes.filter(function(a){
      return a && a.name && Array.isArray(a.values) && a.values.length;
    }) : [];
  }
  /* Valeurs déclarées par la catégorie : elles portent la pastille de couleur
     et l'image associée, que le produit ne redéfinit pas. */
  function catAxisValue(catKey, axisName, value){
    var c = catList().filter(function(x){ return x.key === catKey; })[0];
    if (!c || !Array.isArray(c.axes)) return null;
    var ax = c.axes.filter(function(a){ return a.name === axisName; })[0];
    if (!ax || !Array.isArray(ax.values)) return null;
    return ax.values.filter(function(v){ return (v && v.v) === value; })[0] || null;
  }
  function keyOf(values){ return (values || []).join(VSEP); }
  function valuesOf(key){ return key === "" ? [] : String(key).split(VSEP); }
  function variantLabel(p, key){
    var vals = valuesOf(key);
    if (!vals.length) return "";
    return vals.join(" · ");
  }
  /* Toutes les combinaisons déclarées par le produit, dans l'ordre des axes. */
  function allKeys(p){
    var axes = prodAxes(p);
    if (!axes.length) return [""];
    var out = [""];
    axes.forEach(function(ax){
      var suivant = [];
      out.forEach(function(prefixe){
        ax.values.forEach(function(v){
          suivant.push(prefixe === "" ? v : prefixe + VSEP + v);
        });
      });
      out = suivant;
    });
    return out;
  }
  function firstAvailableKey(p){
    var k = allKeys(p);
    for (var i=0;i<k.length;i++) if (availFor(p, k[i]) > 0) return k[i];
    /* Tout est épuisé : on sélectionne quand même une combinaison existante
       pour que le formulaire « me prévenir » ait un objet. */
    return k.length ? k[0] : "";
  }
  /* Table libelle par cle, reconstruite a chaque changement de reglages. */
  var CATS = {};
  function catList(){
    var c = store.settings.categories;
    if (!Array.isArray(c) || !c.length) c = window.AURA_CATALOG.CATEGORIES;
    return c.filter(function(x){ return x && x.key && x.label; });
  }
  function rebuildCats(){
    CATS = {};
    catList().forEach(function(c){ CATS[c.key] = c.label; });
  }

  /* Catalogue et réglages viennent de catalog.js : une seule définition
     partagée avec l'administration, donc aucune divergence possible. */
  function SEED(){ return window.AURA_CATALOG.seed(); }

  /* Progression des tailles de vêtement. Toute valeur absente de cette liste
     est laissée à sa place : on ne devine pas l'ordre d'un axe libre.
     La liste vit dans la fonction : déclarée dehors avec `var`, elle valait
     `undefined` pour tout appel situé plus haut dans le fichier. */
  function trierValeurs(vals){
    var ORDRE_TAILLES = ["XXS","XS","S","M","L","XL","XXL","XXXL","3XL","4XL"];
    var v = vals.slice();
    var tousNombres = v.every(function(x){ return /^\d+([.,]\d+)?$/.test(String(x).trim()); });
    if (tousNombres) return v.sort(function(a, b){
      return parseFloat(String(a).replace(",", ".")) - parseFloat(String(b).replace(",", "."));
    });
    var toutesConnues = v.every(function(x){ return ORDRE_TAILLES.indexOf(String(x).toUpperCase()) >= 0; });
    if (toutesConnues) return v.sort(function(a, b){
      return ORDRE_TAILLES.indexOf(String(a).toUpperCase()) - ORDRE_TAILLES.indexOf(String(b).toUpperCase());
    });
    return v;
  }

  /* Convertit un produit resté au format « sizes » vers le format
     « axes + variants ». Aucune écriture : la conversion vit en mémoire. */
  function normalizeProduct(p){
    if (!p) return p;
    /* Corrige les anciennes photos qui montraient plusieurs coloris dans le
       même cadre. La migration ne touche que les chemins locaux connus : une
       photo téléversée ensuite par le commerçant reste toujours prioritaire. */
    var correctionsPhotos = {
      "ck-jeans": {
        anciens:["assets/products/ck-jeans.webp"],
        nouveaux:["assets/products/ck-jeans-paire-blanc.webp","assets/products/ck-jeans-paire-bleu.webp"],
        coloris:{"Blanc":"assets/products/ck-jeans-paire-blanc.webp","Bleu":"assets/products/ck-jeans-paire-bleu.webp"}
      },
      "lv-signature": {
        anciens:["assets/products/lv-signature-bleu.webp","assets/products/lv-signature-noir.webp","assets/products/lv-signature-marron.webp"],
        nouveaux:["assets/products/lv-signature-paire-bleu.webp","assets/products/lv-signature-paire-noir.webp","assets/products/lv-signature-paire-marron.webp"],
        coloris:{"Bleu":"assets/products/lv-signature-paire-bleu.webp","Noir":"assets/products/lv-signature-paire-noir.webp","Marron":"assets/products/lv-signature-paire-marron.webp"}
      },
      "lv-relief": {
        anciens:["assets/products/lv-relief-multi.webp","assets/products/lv-relief-duo.webp","assets/products/lv-relief-noir.webp"],
        nouveaux:["assets/products/lv-relief-paire-noir.webp","assets/products/lv-relief-paire-bordeaux.webp","assets/products/lv-relief-paire-ivoire.webp"],
        coloris:{"Noir":"assets/products/lv-relief-paire-noir.webp","Bordeaux":"assets/products/lv-relief-paire-bordeaux.webp","Ivoire":"assets/products/lv-relief-paire-ivoire.webp"}
      },
      "bb-check": {
        anciens:["assets/products/burberry-check-multi.webp"],
        nouveaux:["assets/products/burberry-check-paire-bleu-ciel.webp","assets/products/burberry-check-paire-noir.webp"],
        coloris:{"Bleu ciel":"assets/products/burberry-check-paire-bleu-ciel.webp","Noir":"assets/products/burberry-check-paire-noir.webp"}
      },
      "gv-paris": {
        anciens:["assets/products/givenchy-paris-multi.webp"],
        nouveaux:["assets/products/givenchy-paris-paire-bleu.webp","assets/products/givenchy-paris-paire-beige.webp"],
        coloris:{"Bleu":"assets/products/givenchy-paris-paire-bleu.webp","Beige":"assets/products/givenchy-paris-paire-beige.webp"}
      },
      "dr-oblique": {
        anciens:["assets/products/dior-oblique.webp"],
        nouveaux:["assets/products/dior-oblique-paire-noir.webp","assets/products/dior-oblique-paire-gris.webp"],
        coloris:{"Noir":"assets/products/dior-oblique-paire-noir.webp","Gris":"assets/products/dior-oblique-paire-gris.webp"}
      },
      "hg-mono": {
        anciens:["assets/products/hugo-monogramme-multi.webp"],
        nouveaux:["assets/products/hugo-monogramme-paire-bleu-blanc.webp"],
        coloris:{"Bleu et blanc":"assets/products/hugo-monogramme-paire-bleu-blanc.webp"}
      },
      "ea-logo": {
        anciens:["assets/products/ea7-logo.webp"],
        nouveaux:["assets/products/ea7-logo-paire-noir.webp","assets/products/ea7-logo-paire-beige.webp"],
        coloris:{"Noir":"assets/products/ea7-logo-paire-noir.webp","Beige":"assets/products/ea7-logo-paire-beige.webp"}
      }
    };
    var correction = correctionsPhotos[p.id];
    if (correction){
      var refs = [p.img].concat(Array.isArray(p.imgs) ? p.imgs : []);
      if (p.valueImages) Object.keys(p.valueImages).forEach(function(k){ refs.push(p.valueImages[k]); });
      var ancienPresent = refs.some(function(src){ return correction.anciens.indexOf(src) >= 0; });
      if (ancienPresent){
        if (correction.anciens.indexOf(p.img) >= 0) p.img = correction.nouveaux[0];
        var galerie = (Array.isArray(p.imgs) ? p.imgs : []).filter(function(src){
          return correction.anciens.indexOf(src) < 0;
        });
        correction.nouveaux.forEach(function(src){ if (galerie.indexOf(src) < 0) galerie.push(src); });
        p.imgs = galerie.length ? galerie : correction.nouveaux.slice();
        p.valueImages = p.valueImages || {};
        Object.keys(correction.coloris).forEach(function(couleur){
          var cle = "Coloris" + VSEP + couleur;
          if (!p.valueImages[cle] || correction.anciens.indexOf(p.valueImages[cle]) >= 0){
            p.valueImages[cle] = correction.coloris[couleur];
          }
        });
      }
    }
    if (p.variants){
      /* Déjà au bon format : on assure seulement l'ordre d'affichage. */
      if (Array.isArray(p.axes)) p.axes.forEach(function(ax){
        if (Array.isArray(ax.values)) ax.values = trierValeurs(ax.values);
      });
      return p;
    }
    if (!p.sizes) { p.axes = p.axes || []; p.variants = { "": { s: 0, r: 0 } }; return p; }
    var cles = Object.keys(p.sizes);
    if (cles.length === 1 && cles[0] === "TU"){
      p.axes = [];
      p.variants = { "": p.sizes.TU };
    } else {
      p.axes = [{ name: "Taille", values: trierValeurs(cles) }];
      p.variants = {};
      cles.forEach(function(k){ p.variants[k] = p.sizes[k]; });
    }
    return p;
  }
  function normalizeProducts(list){
    return (list || []).map(normalizeProduct);
  }

  function readStore(){
    try {
      var previewRequested = /[?&]preview=1(?:&|$)/.test(location.search);
      if (previewRequested) sessionStorage.setItem("aura_preview_active", "1");
      if (previewRequested || sessionStorage.getItem("aura_preview_active") === "1"){
        var preview = JSON.parse(sessionStorage.getItem("aura_preview_store") || "null");
        if (preview && preview.products && preview.settings){
          document.documentElement.setAttribute("data-preview", "true");
          preview.products = normalizeProducts(preview.products);
          /* Le brouillon de l'administration ne transporte que les réglages
             et les produits : l'historique des commandes n'a rien à y faire.
             Sans cette liste vide, passer une commande d'essai depuis
             « Voir le brouillon » plantait avant l'écran WhatsApp — le
             commerçant croyait sa boutique cassée à l'instant de la vérifier. */
          if (!Array.isArray(preview.orders)) preview.orders = [];
          return preview;
        }
      }
    } catch(e){}
    try {
      var raw = localStorage.getItem(KEY);
      if (raw){
        var s = JSON.parse(raw);
        if (s && s.products && s.settings){
          s.products = normalizeProducts(s.products);
          if (!Array.isArray(s.orders)) s.orders = [];
          return s;
        }
      }
    } catch(e){}
    var s = SEED();
    saveStore(s);
    return s;
  }
  function saveStore(s){ try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e){} }
  function readCart(){ try { var r = localStorage.getItem(CKEY); return r ? JSON.parse(r) : []; } catch(e){ return []; } }
  function persistCart(){ try { localStorage.setItem(CKEY, JSON.stringify(cart)); } catch(e){} }

  var store = readStore();
  if (document.documentElement.getAttribute("data-preview") === "true"){
    var previewBar = document.createElement("div");
    previewBar.className = "preview-bar";
    previewBar.setAttribute("role", "status");
    previewBar.innerHTML = '<span>APERÇU — les clients ne voient pas encore ces changements</span><a href="admin.html' + (LOCAL_DEMO ? '?demo=1' : '') + '">Retour au dashboard</a>';
    document.body.insertBefore(previewBar, document.body.firstChild);
    previewBar.querySelector("a").addEventListener("click", function(){
      try { sessionStorage.removeItem("aura_preview_active"); sessionStorage.removeItem("aura_preview_store"); } catch(e){}
    });
  }
  var cart = readCart();

  function reconcileCart(){
    var before="";
    try{before=JSON.stringify(cart);}catch(e){}
    var next=[];
    (Array.isArray(cart)?cart:[]).forEach(function(it){
      var p=findProduct(it&&it.id);
      if(!p||p.active===false||p.archived||p.stockout||!p.variants)return;
      var key=it.variant!=null?String(it.variant):String(it.size||"");
      if(!(key in p.variants)){
        if((key==="TU"||key==="")&&("" in p.variants))key="";
        else if((key==="TU"||key==="")&&("TU" in p.variants))key="TU";
        else return;
      }
      var qty=Math.min(Math.max(0,Number(it.qty)||0),Math.max(0,availFor(p,key)));
      if(qty<1)return;
      next.push({
        id:p.id,variant:key,variantLabel:variantLabel(p,key),qty:qty,
        name:p.name,brand:marqueDe(p),cat:CATS[p.cat]||p.cat,
        price:Number(p.price)||0,img:p.img||""
      });
    });
    cart=next;
    var after="";try{after=JSON.stringify(cart);}catch(e){}
    if(before!==after)persistCart();
  }

  /* ---------------- Utilitaires ---------------- */
  function $(s){ return document.querySelector(s); }
  function $$(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  /* Les médias statiques sont servis un an en cache. Cette révision change
     leur URL à chaque livraison : le téléphone reçoit immédiatement la
     nouvelle image, puis la garde sans refaire de téléchargement inutile. */
  var MEDIA_REV = "20260823b";
  function mediaUrl(src){
    src = String(src || "");
    if (!/^(?:\.\/)?(?:assets|logos)\//.test(src)) return src;
    return src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + MEDIA_REV;
  }
  function lazyAttrs(src){
    return 'data-src="' + esc(mediaUrl(src)) + '" loading="lazy" decoding="async"';
  }
  /* La grille n'a pas besoin des fichiers pleine definition de la fiche.
     Les miniatures locales sont generees a part ; une photo distante ajoutee
     par le commercant retombe simplement sur son URL d'origine. */
  function cardThumbUrl(src){
    src = String(src || "");
    if (/^assets\/studio\/[^/]+\.webp$/i.test(src))
      return src.replace(/^assets\/studio\//i, "assets/thumbs/cards/studio/");
    return src;
  }
  function colorThumbUrl(src){
    src = String(src || "");
    if (/^assets\/products\/[^/]+\.webp$/i.test(src))
      return src.replace(/^assets\/products\//i, "assets/thumbs/colors/products/");
    return src;
  }
  function brandCardThumbUrl(src){
    src = String(src || "");
    if (/^assets\/brand-banners\/[^/]+\.webp$/i.test(src))
      return src.replace(/^assets\/brand-banners\//i, "assets/thumbs/brand-banners/");
    return src;
  }
  function detailThumbUrl(src){
    var card = cardThumbUrl(src);
    return card !== src ? card : colorThumbUrl(src);
  }

  /* Les images du prochain écran commencent à charger avant que le visiteur
     les voie. Cela évite le blanc après un défilement rapide, sans télécharger
     tout le catalogue au chargement. */
  var lazyObserver = "IntersectionObserver" in window ? new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      var img = entry.target, src = img.getAttribute("data-src");
      if (src){ img.loading = "eager"; img.fetchPriority = "low"; img.setAttribute("src", src); }
      img.removeAttribute("data-src");
      lazyObserver.unobserve(img);
    });
  }, { rootMargin: "800px 0px" }) : null;
  function observeLazy(root){
    var imgs = (root || document).querySelectorAll("img[data-src]");
    for (var i = 0; i < imgs.length; i++){
      if (lazyObserver) lazyObserver.observe(imgs[i]);
      else {
        imgs[i].setAttribute("src", imgs[i].getAttribute("data-src"));
        imgs[i].removeAttribute("data-src");
      }
    }
  }
  new MutationObserver(function(records){
    records.forEach(function(record){
      for (var i = 0; i < record.addedNodes.length; i++){
        var node = record.addedNodes[i];
        if (node.nodeType === 1) observeLazy(node.matches && node.matches("img[data-src]") ? node.parentNode : node);
      }
    });
  }).observe(document.documentElement, { childList:true, subtree:true });
  function fmtShort(n){ return (Math.round(Number(n)||0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g," "); }
  function fmt(n){ return (Math.round(Number(n)||0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g," ") + " FCFA"; }
  function digits(s){ return String(s||"").replace(/\D/g,""); }
  function localPhone(d){
    d = digits(d);
    if (d.length === 11 && d.slice(0,3) === "223") d = d.slice(3);
    d = d.slice(0,8);
    return "+223 " + d.slice(0,2) + " " + d.slice(2,4) + " " + d.slice(4,6) + " " + d.slice(6,8);
  }
  function findProduct(id){ for (var i=0;i<store.products.length;i++) if (store.products[i].id === id) return store.products[i]; return null; }
  function availFor(p, key){
    var v = p && p.variants ? p.variants[key] : null;
    return v ? (v.s - v.r) : 0;
  }
  function totalFor(p){
    var t = 0;
    if (p && p.variants) for (var k in p.variants) t += p.variants[k].s;
    return t;
  }
  function availableTotalFor(p){
    var t=0;
    if(p&&p.variants)for(var k in p.variants)t+=Math.max(0,(Number(p.variants[k].s)||0)-(Number(p.variants[k].r)||0));
    return t;
  }
  function isOut(p){ if (p.stockout) return true; return availableTotalFor(p) <= 0; }
  function waLink(phone, text){ return "https://wa.me/" + digits(phone) + "?text=" + encodeURIComponent(text); }

  var toastTimer;
  function toast(msg){
    var t = $("#toast");
    t.textContent = msg;
    t.setAttribute("data-visible","true");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.setAttribute("data-visible","false"); }, 2400);
  }

  /* ---------------- Favoris (persistés dans le navigateur) ---------------- */
  function readWish(){ try { var r = localStorage.getItem(WKEY); return r ? JSON.parse(r) : []; } catch(e){ return []; } }
  var wish = readWish();
  function persistWish(){ try { localStorage.setItem(WKEY, JSON.stringify(wish)); } catch(e){} }
  function isWished(id){ return wish.indexOf(id) >= 0; }
  function toggleWish(id){
    var i = wish.indexOf(id);
    if (i >= 0) wish.splice(i, 1); else wish.push(id);
    persistWish();
    return i < 0;
  }

  /* ---------------- Frais de livraison ---------------- */
  /* La bannière annonce la livraison offerte au-delà d'un montant :
     le calcul doit appliquer réellement ce seuil. */
  function deliveryFor(sub){
    var free = Number(store.settings.freeFrom) || 0;
    if (free > 0 && sub >= free) return 0;
    return Number(store.settings.deliveryFee) || 0;
  }

  /* ---------------- Liens issus des réglages ---------------- */
  function helpLink(msg){ return waLink(store.settings.whatsapp, msg); }
  function setSocial(sel, url){
    var e = $(sel); if (!e) return;
    if (url && /^https?:\/\//i.test(url)){
      e.href = url;
      e.style.display = "";
      e.removeAttribute("aria-hidden");
      e.removeAttribute("tabindex");
    } else {
      /* Pas d'URL renseignée : on masque l'icône plutôt que de laisser
         un lien qui ne mène nulle part — et on la retire aussi du parcours
         clavier et des lecteurs d'écran. */
      e.style.display = "none";
      e.setAttribute("aria-hidden", "true");
      e.setAttribute("tabindex", "-1");
    }
  }
  /* Le seuil de gratuite est un reglage : le bandeau doit dire le vrai
     montant, pas une promesse figee dans le HTML. */
  /* Avis clients. Rien n'est invente : sans avis saisi, la section entiere
     reste retiree du document. Une preuve sociale fabriquee se repere, et le
     jour ou elle se voit la marque est morte. */
  function renderReviews(){
    var sec = $("#avis"), grid = $("#revGrid"), count = $("#revCount");
    if (!sec || !grid) return;
    var list = (store.settings.reviews || []).filter(function(r){
      return r && r.text && r.name;
    });
    if (!list.length){ sec.hidden = true; grid.innerHTML = ""; return; }
    sec.hidden = false;
    grid.innerHTML = list.slice(0, 3).map(function(r){
      var note = Math.min(5, Math.max(0, parseInt(r.rating, 10) || 0));
      var dots = "";
      if (note){
        for (var i = 1; i <= 5; i++) dots += '<i' + (i > note ? ' data-off' : '') + '></i>';
        dots = '<div class="rev-note" role="img" aria-label="Note : ' + note + ' sur 5">' + dots + '</div>';
      }
      var meta = [r.quartier, r.product].filter(Boolean).map(esc).join(" · ");
      return '<figure class="rev-item">' + dots +
        '<blockquote class="rev-text">« ' + esc(r.text) + ' »</blockquote>' +
        '<figcaption><div class="rev-who">' + esc(r.name) + '</div>' +
        (meta ? '<div class="rev-meta">' + meta + '</div>' : '') +
        '</figcaption></figure>';
    }).join("");
    count.textContent = list.length > 3
      ? list.length + " avis clients recueillis à Bamako."
      : "";
    addReviewSchema(list);
  }

  /* Donnees structurees : emises uniquement s'il existe de vrais avis notes.
     Declarer une note moyenne sans avis reel est une infraction aux regles
     de Google et expose a une penalite. */
  function addReviewSchema(list){
    var old = document.getElementById("revSchema");
    if (old) old.remove();
    var rated = list.filter(function(r){ return parseInt(r.rating, 10) > 0; });
    if (rated.length < 1) return;
    var sum = rated.reduce(function(a, r){ return a + parseInt(r.rating, 10); }, 0);
    var el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "revSchema";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Store",
      "name": store.settings.shopName || "SNEAK BAMAKO",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (sum / rated.length).toFixed(1),
        "reviewCount": rated.length,
        "bestRating": 5,
        "worstRating": 1
      }
    });
    document.head.appendChild(el);
  }

  /* Onglets, navigation et pied de page sont bati depuis la liste : une
     categorie ajoutee dans l'administration apparait partout d'un coup. */
  function renderCategories(){
    rebuildCats();
    var list = catList();
    var tabs = $("#filterTabs");
    if (tabs){
      var active = curFilter;
      tabs.innerHTML = '<button class="tab' + (active === "tous" ? " active" : "") + '" data-filter="tous">Tous</button>' +
        list.map(function(c){
          return '<button class="tab' + (active === c.key ? " active" : "") + '" data-filter="' + esc(c.key) + '">' + esc(c.label) + '</button>';
        }).join("");
    }
    /* Les liens pointent sur le catalogue, une vraie adresse : ouverture dans
       un nouvel onglet, partage et indexation fonctionnent. Quand la grille
       est déjà là, le clic est intercepté et filtre sans recharger. */
    var links = list.map(function(c){
      return '<a href="catalogue.html?cat=' + encodeURIComponent(c.key) + '" data-goto="' + esc(c.key) + '">' + esc(c.label) + '</a>';
    }).join("");
    var nav = $("#navLinks");
    if (nav) nav.innerHTML = '<a href="marques.html">Marques</a><a href="catalogue.html" data-goto="tous">Tout voir</a>' + links;
    var mob = $("#mobileMenu");
    if (mob) mob.innerHTML = '<a href="marques.html">Marques</a><a href="catalogue.html" data-goto="tous">Tout voir</a>' + links;
    var foot = $("#footShop");
    if (foot) foot.innerHTML = '<li><a href="marques.html">Toutes les marques</a></li><li><a href="catalogue.html" data-goto="tous">Tout voir</a></li>' +
      list.map(function(c){
        return '<li><a href="catalogue.html?cat=' + encodeURIComponent(c.key) + '" data-goto="' + esc(c.key) + '">' + esc(c.label) + '</a></li>';
      }).join("");
    /* Le filtre courant peut viser une categorie supprimee entre-temps. */
    if (curFilter !== "tous" && !CATS[curFilter]) curFilter = "tous";
  }

  /* Délai de livraison : une seule valeur dans les réglages alimente la
     carte produit, le bandeau de réassurance et le hero. Sans cette source
     unique, changer « 24h » pour « 1 semaine » laisserait des mentions
     contradictoires sur la page. */
  function deliveryDelay(){
    var d = (store.settings.deliveryTime || "").toString().trim();
    return d;
  }
  function deliveryLabel(){
    var d = deliveryDelay();
    return d ? "Livré en " + d : "Livraison à Bamako";
  }

  /* La section « univers » montre les collections quand il y en a, les
     catégories sinon. Une boutique mono-marque garde sa page à l'identique. */
  /* Type de page, déclaré par `data-page` sur le `body`. Le même script sert
     l'accueil, les pages de marque et le catalogue : il n'anime que ce que la
     page contient réellement, et adapte titre et adresse canonique. */
  function typePage(){
    return (document.body && document.body.getAttribute("data-page")) || "accueil";
  }
  function poserMeta(nom, valeur){
    var m = document.head.querySelector('meta[name="' + nom + '"]');
    if (m) m.setAttribute("content", valeur);
  }
  function poserCanonique(url){
    var l = document.head.querySelector('link[rel="canonical"]');
    if (!l){
      l=document.createElement("link");
      l.setAttribute("rel","canonical");
      document.head.appendChild(l);
    }
    l.setAttribute("href", url);
  }

  /* Marques mises en avant sur l'accueil : bandeau large puis rangée de
     modèles. Le commerçant les coche dans l'administration ; sans choix, les
     trois premières marques qui ont des produits sont prises, pour qu'une
     boutique installée à l'instant ne montre pas une page vide.
     Plafonné à quatre : au-delà, l'accueil devient un catalogue déguisé et
     plus personne ne descend jusqu'aux autres marques. */
  var MAX_BANDES = 4, MAX_MODELES = 8;
  function imageMarque(c, desktopKey, mobileKey){
    var mobile = false;
    try { mobile = !!(mobileKey && window.matchMedia && window.matchMedia("(max-width:640px)").matches); } catch(e){}
    if (mobile && c[mobileKey]) return c[mobileKey];
    return c[desktopKey] || c.cover || "";
  }
  function marquesEnAvant(colls){
    var actifs = {};
    store.products.forEach(function(p){
      if (p.active && p.collection) actifs[p.collection] = (actifs[p.collection] || 0) + 1;
    });
    var avec = colls.filter(function(c){ return actifs[c.key]; });
    var choisies = avec.filter(function(c){ return c.featured; });
    /* Choix automatique : au moins deux modèles, sinon le bandeau annonce une
       marque et ne montre qu'une paire — l'effet inverse de celui recherché.
       Un choix explicite du commerçant est respecté tel quel : c'est lui qui
       sait ce qu'il veut pousser cette semaine. */
    if (!choisies.length) choisies = avec.filter(function(c){ return actifs[c.key] >= 2; }).slice(0, 3);
    return choisies.slice(0, MAX_BANDES);
  }
  function renderBandes(colls){
    var host = $("#marquesBandes");
    if (!host) return [];
    var choisies = marquesEnAvant(colls);
    host.innerHTML = choisies.map(function(c){
      var bandCover=imageMarque(c,"homeCover","homeCoverMobile");
      var produits = store.products.filter(function(p){
        return p.active && p.collection === c.key;
      }).slice(0, MAX_MODELES);
      var n = produits.length;
      /* Chaque maison tient sa bande : sa photo d'ambiance en fond, sa couleur
         sur le filet et le lien. Tant qu'aucune photo n'est fournie, la
         couleur remplit la bande — jamais un trou, jamais un fond gris. */
      return '<div class="mband' + (bandCover ? ' a-photo' : '') + '"' +
        (c.accent ? ' style="--accent-marque:' + esc(c.accent) + '"' : '') + '>' +
        '<a class="mband-top" href="collection.html?c=' + encodeURIComponent(c.key) + '"' +
          ' aria-label="' + (n > 1 ? 'Voir les ' + n + ' modèles ' : 'Voir le modèle ') + esc(c.label) + '">' +
          (bandCover ? '<img class="mband-cover" ' + lazyAttrs(bandCover) + ' alt="" onerror="AURA_IMG(this)" />' : '') +
          '<span class="mband-in">' +
            '<span>' +
              (c.tagline ? '<span class="mband-tag">' + esc(c.tagline) + '</span>' : '') +
              '<span class="mband-name">' + esc(c.label) + '</span>' +
            '</span>' +
            '<span class="mband-go"><span>' + (n > 1 ? 'Voir les ' + n + ' modèles' : 'Voir le modèle') + '</span>' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>' +
          '</span>' +
        '</a>' +
        /* Quatre modèles ou moins tiennent sur une ligne : une barre de
           défilement qui ne défile pas donne l'impression d'un bug. */
        '<div class="mrow' + (n <= 4 ? ' mrow-fixe' : '') + '">' +
          produits.map(cardHTML).join("") + '</div>' +
      '</div>';
    }).join("");
    return choisies.map(function(c){ return c.key; });
  }

  /* Entête de la grille du catalogue et des pages de marque. C'étaient les
     derniers textes du site que le commerçant ne pouvait pas changer. Les
     valeurs écrites dans la page servent de repli : tant qu'il n'y touche
     pas, rien ne bouge. */
  function renderEntetePage(){
    var t = typePage();
    if (t !== "catalogue" && t !== "collection") return;
    var c = contenu();
    var e = c["entete-" + t] || {};
    /* Éteindre le bloc masque l'entête entière, pas seulement ses mots :
       trois lignes vides au-dessus d'une grille se voient plus qu'une
       absence. */
    var tete = $("#pgTitre") && $("#pgTitre").closest(".sec-head");
    if (tete) tete.hidden = e.on === false;
    function poserSi(sel, val){
      var el = $(sel);
      if (!el) return;
      var v = (val || "").toString().trim();
      if (v) el.textContent = v;
      el.hidden = false;
    }
    poserSi("#pgKicker", e.kicker);
    poserSi("#pgTitre", e.title);
    poserSi("#pgSub", e.sub);
  }

  function renderUnivers(){
    var grille = $("#univGrille");
    if (!grille) return;
    var colls = collList();
    var titre = $("#univTitre"), kicker = $("#univKicker");

    if (colls.length){
      if (kicker) kicker.textContent = "Les marques";
      if (titre) titre.textContent = "Parcourez les marques";
      renderBandes(colls);
      var actifs = {};
      store.products.forEach(function(p){
        if (p.active && p.collection) actifs[p.collection] = (actifs[p.collection] || 0) + 1;
      });
      var disponibles = colls.filter(function(c){ return actifs[c.key]; });
      var choisies = disponibles.filter(function(c){ return c.featured; });
      disponibles.forEach(function(c){
        if (choisies.indexOf(c) < 0) choisies.push(c);
      });
      choisies = choisies.slice(0, 6);
      var reste = $("#marquesReste");
      if (reste) reste.hidden = !choisies.length;
      grille.innerHTML = choisies.map(function(c){ return carteMarqueLogoHTML(c); }).join("");
      var tout = $("#homeBrandsAll");
      if (tout) tout.textContent = disponibles.length ? "Voir les " + disponibles.length + " marques" : "Voir toutes les marques";
      return;
    }

    if (kicker) kicker.textContent = "Les univers";
    if (titre) titre.textContent = "Explorez les collections";
    grille.innerHTML = catList().map(function(c){
      return '<a href="catalogue.html?cat=' + encodeURIComponent(c.key) + '" class="cat-card" data-goto="' + esc(c.key) + '">' +
        (c.cover ? '<img ' + lazyAttrs(c.cover) + ' alt="" width="800" height="600" onerror="AURA_IMG(this)" />' : '') +
        '<div class="cat-body">' +
          '<span class="cat-label">' + esc(c.label) + '</span>' +
          '<span class="cat-link">Découvrir <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>' +
        '</div>' +
      '</a>';
    }).join("");
  }

  function carteMarqueHTML(c, i){
    var gridCover=imageMarque(c,"gridCover","");
    return '<a class="brand-directory-card" href="collection.html?c=' + encodeURIComponent(c.key) + '"' +
      (c.accent ? ' style="--accent-marque:' + esc(c.accent) + '"' : '') +
      ' aria-label="Voir les modèles ' + esc(c.label) + '">' +
        (gridCover ? '<img ' + lazyAttrs(brandCardThumbUrl(gridCover)) + ' alt="" width="400" height="300" onerror="AURA_IMG(this)" />' : '') +
        '<span class="brand-directory-shade"></span>' +
        '<span class="brand-directory-copy">' +
          (c.tagline ? '<span>' + esc(c.tagline) + '</span>' : '') +
          '<strong>' + esc(c.label) + '</strong>' +
        '</span>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>' +
      '</a>';
  }

  /* Le répertoire dédié utilise les vrais logos fournis, sur un fond calme.
     Cette carte reste séparée de carteMarqueHTML : l'accueil conserve ses
     photos et ses bannières, comme demandé. */
  function carteMarqueLogoHTML(c){
    var logosVerifies = {
      "hugo": "assets/logos/hugo-fashion.svg",
      "tommy-jeans": "assets/logos/tommy-hilfiger-flag.svg"
    };
    var logo = logosVerifies[c.key] || c.logo || "";
    return '<a class="brand-logo-card" data-brand="' + esc(c.key) + '" href="collection.html?c=' + encodeURIComponent(c.key) + '"' +
      ' aria-label="Voir les modèles ' + esc(c.label) + '">' +
        '<span class="brand-logo-visual">' +
          (logo ? '<img class="brand-logo-img" ' + lazyAttrs(logo) + ' alt="' + esc(c.label) + '" onerror="this.hidden=true;this.nextElementSibling.hidden=false" />' : '') +
          '<strong class="brand-logo-fallback"' + (logo ? ' hidden' : '') + '>' + esc(c.label) + '</strong>' +
        '</span>' +
        '<span class="brand-logo-action">' + esc(c.label) + '</span>' +
      '</a>';
  }

  /* Répertoire dédié : aucune paire dans cette grille, seulement les maisons.
     Sur mobile deux colonnes restent visibles d'un regard, sans carrousel ni
     défilement horizontal. Le nombre vient du catalogue réel et disparaît si
     une marque n'a aucun produit actif. */
  function renderToutesMarques(){
    var host = $("#brandsDirectory");
    if (!host) return;
    var marques = collList().map(function(c){
      var n = store.products.filter(function(p){ return p.active && p.collection === c.key; }).length;
      return { marque:c, nombre:n };
    }).filter(function(x){ return x.nombre > 0; });
    host.innerHTML = marques.map(function(x){ return carteMarqueLogoHTML(x.marque); }).join("");
  }

  /* Bannière de la collection ouverte. L'accent, s'il est défini, ne touche
     que le filet du sur-titre : borné là, il personnalise sans rien casser. */
  function renderCollBanniere(){
    var box = $("#collBanniere");
    if (!box) return;
    var c = curColl ? collById(curColl) : null;
    if (!c){ box.hidden = true; return; }
    var pageCover=imageMarque(c,"pageCover","pageCoverMobile");
    box.hidden = false;
    box.classList.toggle("has-brand-cover", !!pageCover);
    box.classList.toggle("has-brand-logo", !pageCover && !!c.logo);
    var img = $("#collImage");
    if (img){
      img.classList.remove("brand-logo");
      if (pageCover){ img.src = mediaUrl(pageCover); img.alt = ""; img.hidden = false; }
      else if (c.logo){ img.src = mediaUrl(c.logo); img.alt = "Logo " + c.label; img.classList.add("brand-logo"); img.hidden = false; }
      else { img.removeAttribute("src"); img.hidden = true; }
    }
    var k = $("#collKicker");
    if (k){
      k.textContent = c.tagline || "Collection";
      k.style.setProperty("--accent-coll", c.accent || "");
      k.classList.toggle("has-accent", !!c.accent);
    }
    var t = $("#collTitre"); if (t) t.textContent = c.label;
    var d = $("#collTexte"); if (d) d.textContent = c.desc || "";
  }

  function setCollection(key){
    curColl = key || "";
    curFilter = "tous";
    renderCollBanniere();
    renderCategories();
    renderGrid();
    syncUrl(curFilter);
    document.title = (curColl && collById(curColl) ? collById(curColl).label + " — " : "") +
      store.settings.shopName + " — Boutique en ligne · Bamako";
  }

  /* Le logo suit le nom de la boutique. Coupé au premier espace : la première
     partie en gras, le reste en petit, comme le dessin d'origine. */
  function renderLogo(){
    var nom = (store.settings.shopName || "").trim();
    if (!nom) return;
    var i = nom.indexOf(" ");
    var tete = i > 0 ? nom.slice(0, i) : nom;
    var reste = i > 0 ? nom.slice(i + 1) : "";
    var nav = $("#logoNav");
    if (nav) nav.innerHTML = store.settings.logo ? '<img src="'+esc(mediaUrl(store.settings.logo))+'" alt="'+esc(nom)+'" class="store-logo" />' : esc(tete) + (reste ? '<span>' + esc(reste) + '</span>' : '');
    var pied = $("#logoPied");
    if (pied) pied.innerHTML = store.settings.logo ? '<img src="'+esc(mediaUrl(store.settings.logo))+'" alt="'+esc(nom)+'" class="store-logo store-logo-foot" />' : esc(tete) + (reste ? '<span style="font-size:11px">' + esc(reste) + '</span>' : '');
  }

  /* Contenu éditorial. Chaque bloc a son interrupteur : masquer vaut mieux
     que remplir de texte de remplissage. Un champ vide masque son élément
     plutôt que de laisser un blanc dans la mise en page. */
  function contenu(){
    var c = store.settings.content;
    return (c && typeof c === "object") ? c : {};
  }
  function poser(sel, texte){
    var e = $(sel);
    if (!e) return;
    var v = (texte || "").toString().trim();
    e.textContent = v;
    e.hidden = !v;
  }
  function poserImage(sel, url, prioritaire){
    var e = $(sel);
    if (!e) return;
    if (url){
      if (prioritaire){
        e.removeAttribute("data-src");
        var sourceMobile = e.id === "heroImage" ? $("#heroMobileSource") : null;
        if (e.id === "heroImage" && /^(?:\.\/)?assets\/hero\.webp$/i.test(String(url))){
          if (sourceMobile) sourceMobile.srcset = mediaUrl("assets/hero-960.webp");
        } else {
          if (sourceMobile) sourceMobile.removeAttribute("srcset");
        }
        e.src = mediaUrl(url);
      } else {
        e.removeAttribute("src");
        e.setAttribute("data-src", mediaUrl(url));
        observeLazy(e.parentNode || document);
      }
      e.hidden = false;
    }
    else { e.removeAttribute("src"); e.removeAttribute("data-src"); e.hidden = true; }
  }
  function poserBouton(sel, texte){
    var e = $(sel);
    if (!e) return;
    var v = (texte || "").toString().trim();
    e.textContent = v;
    e.hidden = !v;
  }

  function renderContenu(){
    var c = contenu();

    var h = c.hero || {};
    var hs = $("#heroSection");
    if (hs) hs.hidden = h.on === false;
    poserImage("#heroImage", h.image, true);
    poser("#heroBadge", h.badge);
    poser("#heroKicker", h.kicker);
    poser("#heroTitre", h.title);
    poser("#heroSub", h.sub);
    poserBouton("[data-od-id='hero-cta-primary']", h.cta1);
    poserBouton("[data-od-id='hero-cta-secondary']", h.cta2);

    var b = c.banner || {};
    var bs = $("#bannerSection");
    if (bs) bs.hidden = b.on === false;
    poserImage("#bannerImage", b.image, false);
    poser("#bannerKicker", b.kicker);
    poser("#bannerTitre", b.title);
    poser("#bannerTexte", b.text);
    poserBouton("[data-od-id='collection-cta']", b.cta1);
    poserBouton("[data-od-id='collection-cta-alt']", b.cta2);

    var e = c.editorial || {};
    var es = $("#a-propos");
    if (es) es.hidden = e.on === false;
    poserImage("#edImage", e.image, false);
    poser("#edKicker", e.kicker);
    poser("#edTitre", e.title);
    poser("#edTexte", e.text);
    var host = $("#edPiliers");
    if (host){
      var piliers = Array.isArray(e.pillars) ? e.pillars.filter(function(x){ return x && (x.title || x.text); }) : [];
      host.innerHTML = piliers.map(function(x, i){
        return '<div class="pillar">' +
          '<span class="idx">' + ("0" + (i + 1)).slice(-2) + '</span>' +
          '<div><h3>' + esc(x.title || "") + '</h3><p>' + esc(x.text || "") + '</p></div>' +
        '</div>';
      }).join("");
      host.hidden = !piliers.length;
    }

    var nl = c.newsletter || {};
    var ns = $("#nlSection");
    if (ns) ns.hidden = nl.on === false;
    poser("#nlKicker", nl.kicker);
    poser("#nlTitre", nl.title);
    poser("#nlTexte", nl.text);
    poser("#nlNote", nl.note);
  }

  function applySellingCopy(){
    var s = store.settings;
    var free = Number(s.freeFrom) || 0;
    var d = deliveryDelay();
    var libelle = d ? "Livraison en " + d + " à Bamako" : "Livraison à Bamako";
    var ex = (store.settings.exchangeTime || "").toString().trim();
    /* Le bandeau est désormais rendu depuis la liste unique des garanties.
       Le seuil de livraison offerte, lui, reste un chiffre de réglage : il
       doit suivre le champ, pas un texte libre. */
    renderTrustBar();
    if (free > 0){
      var libre = document.querySelector(".trust-grid .trust-item:nth-child(2) span");
      if (libre) libre.textContent = "Offerte dès " + fmt(free) + " d'achat.";
    }
    var he = $("#heroExchange"); if (he) he.textContent = ex ? "Échange sous " + ex : "Échange possible";
    var hd = $("#heroDelay"); if (hd) hd.textContent = libelle;
    var wa = $("#waFloat");
    if (wa) wa.href = waLink(s.whatsapp, "Bonjour " + (s.shopName || "SNEAK BAMAKO") + " 👋 J'ai une question sur un article.");
    renderLogo();
    renderContenu();
    renderReviews();
    renderUnivers();
    renderToutesMarques();
    renderEntetePage();
    renderCategories();
    renderCollBanniere();
    /* Les marques et les bandeaux viennent d'être fabriqués : c'est
       maintenant qu'ils peuvent être animés. */
    animerApparitions();
    /* Une adresse du type ?cat=hoodies doit ouvrir directement la catégorie,
       y compris après l'arrivée des réglages depuis Supabase. */
    var voulueColl = collFromUrl();
    if (voulueColl && collById(voulueColl) && curColl !== voulueColl){
      curColl = voulueColl;
      renderCollBanniere();
      renderGrid();
    }
    /* Page de marque : le titre et l'adresse canonique doivent nommer la
       marque, sinon les onze pages se ressemblent pour un moteur de
       recherche et se cannibalisent. Une marque inconnue — lien périmé,
       marque retirée par le commerçant — renvoie au catalogue plutôt que
       d'afficher une page vide. */
    if (typePage() === "produit"){
      var vid = "";
      try { var mm = location.search.match(/[?&]id=([^&]+)/); vid = mm ? decodeURIComponent(mm[1]) : ""; } catch(e){}
      var prod = vid ? findProduct(vid) : null;
      /* Produit retiré du catalogue ou lien périmé : le catalogue vaut mieux
         qu'une page vide, et garde le client dans la boutique. */
      if (!prod || !prod.active || prod.archived){ location.replace("catalogue.html"); return; }
      openPV(prod.id);
      return;
    }
    if (typePage() === "collection"){
      var c = curColl ? collById(curColl) : null;
      if (!c){ location.replace("catalogue.html"); return; }
      document.title = c.label + " — " + store.settings.shopName + " — Boutique en ligne · Bamako";
      poserMeta("description", c.desc || ("Les modèles " + c.label + " disponibles à Bamako. Commande par WhatsApp, paiement à la livraison."));
      poserCanonique(location.origin + location.pathname + "?c=" + encodeURIComponent(c.key));
    }
    var voulue = catFromUrl();
    if (voulue && CATS[voulue] && curFilter !== voulue){
      curFilter = voulue;
      renderCategories();
      renderGrid();
    }
    /* Une adresse partagée porte toute la sélection, pas seulement la
       pointure : le client qui reçoit le lien voit exactement la même
       vitrine que celui qui l'a envoyé. */
    var vTaille = tailleFromUrl(), vMarques = listeUrl("m");
    var vPrix = paramUrl("p"), vDispo = paramUrl("dispo") === "1", vTri = paramUrl("tri");
    var change = false;
    if (vTaille && curTaille !== vTaille){ curTaille = vTaille; change = true; }
    if (vMarques.length && curMarques.join(",") !== vMarques.join(",")){ curMarques = vMarques; change = true; }
    if (vPrix && curPrix !== vPrix){ curPrix = vPrix; change = true; }
    if (vDispo && !curDispo){ curDispo = true; change = true; }
    if (vTri && curTri !== vTri){ curTri = vTri; change = true; }
    if (change) renderGrid();
  }
  function applySettings(){
    var s = store.settings;
    var accents=["#000000","#0759ea","#c2410c","#15803d"];
    document.documentElement.style.setProperty("--accent",accents.indexOf(s.accent)>=0?s.accent:"#000000");
    if(s.shareImage){var og=document.querySelector('meta[property="og:image"]');if(og)og.setAttribute("content",s.shareImage);}
    document.body.classList.toggle("product-visuals-ready", s.productVisualsReady === true);
    document.body.classList.toggle("brand-covers-ready", s.brandCoversReady === true);
    /* Le nom de la boutique est modifiable et le titre le suit. Sur une page
       de marque, c'est la marque qui prime : le titre y est posé au
       démarrage, une fois la marque connue. */
    if (typePage() !== "collection"){
      document.title = (typePage() === "catalogue" ? "Catalogue — " : typePage() === "marques" ? "Marques — " : "") +
        s.shopName + " — Boutique en ligne · Bamako";
    }
    var an = $("#announce"); if (an) an.textContent = s.announcement || "";
    /* Phrase de présentation du pied de page. Elle décrivait du streetwear
       sur une boutique de claquettes et n'était modifiable nulle part :
       c'était le seul texte du site figé dans le script. */
    var pt = $("#piedTexte");
    if (pt) pt.textContent = (s.footerText || "").toString().trim() ||
      (s.shopName + " — vente en ligne à Bamako. Paiement à la livraison.");
    var fc=$("#footerContact"),contact=[];
    if(s.address)contact.push(String(s.address).trim());
    if(s.hours)contact.push(String(s.hours).trim());
    if(fc){fc.textContent=contact.join(" · ");fc.hidden=!contact.length;}
    var free = Number(s.freeFrom) || 0;
    var note = $("#cartDeliveryNote");
    if (note){
      note.textContent = free > 0
        ? "Livraison à Bamako : " + fmt(s.deliveryFee) + " · offerte dès " + fmt(free)
        : "Livraison à Bamako : " + fmt(s.deliveryFee);
    }
    var wa = waLink(s.whatsapp, "Bonjour " + s.shopName + " 👋");
    ["#contactBtn","#helpContact"].forEach(function(sel){ var e = $(sel); if (e) e.href = wa; });
    var d = $("#helpDelivery"); if (d) d.href = helpLink("Bonjour " + s.shopName + ", j'aimerais connaître les modalités de livraison à Bamako.");
    var o = $("#helpOrder"); if (o) o.href = helpLink("Bonjour " + s.shopName + ", j'aimerais suivre ma commande.");
    var pr = $("#helpPress"); if (pr) pr.href = helpLink("Bonjour " + s.shopName + ", je vous contacte dans le cadre d'une demande presse.");
    setSocial("#socialIG", s.instagram);
    setSocial("#socialTT", s.tiktok);
    setSocial("#socialYT", s.youtube);
    var f = $("#footerBrandLine");
    if (f) f.textContent = "© " + new Date().getFullYear() + " " + s.shopName + ". Tous droits réservés.";
    applySellingCopy();
  }

  /* ---------------- Hydratation Supabase (catalogue + réglages) ---------------- */
  function hydrate(){
    if (document.documentElement.getAttribute("data-preview") === "true") return;
    /* En local, montrer exactement le catalogue du dépôt en cours d'édition.
       La production continue de lire Supabase, sa source de vérité. */
    if (location.hostname === "127.0.0.1" || location.hostname === "localhost") return;
    if (typeof window.AURA_DB === "undefined" || !window.AURA_DB.ready()) return;
    window.AURA_DB.loadSettings(function(es, s){
      if (es || !s) return;
      var defaults=SEED().settings;
      store.settings={};
      for(var dk in defaults)store.settings[dk]=defaults[dk];
      for (var k in s) store.settings[k] = s[k];
      saveStore(store);
      applySettings();
      reconcileCart();
      renderCount();
      renderCart();
    });
    window.AURA_DB.loadProducts(function(ep, rows){
      if (ep || !rows) return;
      store.products = normalizeProducts(rows);
      saveStore(store);
      reconcileCart();
      renderCount();
      renderUnivers();
      renderToutesMarques();
      renderGrid();
      renderCart();
      if(typePage()==="produit"){
        var currentId="";
        try{var foundId=location.search.match(/[?&]id=([^&]+)/);currentId=foundId?decodeURIComponent(foundId[1]):"";}catch(e){}
        var fresh=currentId?findProduct(currentId):null;
        if(!fresh||fresh.active===false||fresh.archived){location.replace("catalogue.html");return;}
        openPV(fresh.id);
      }
    });
  }

  /* L'état de la fiche doit exister avant le premier applySettings() :
     une page produit peut appeler openPV() pendant ce premier rendu. */
  var pvProduct = null, pvSel = [], pvQty = 1, pvBuy = false, pvImgs = [], pvPhotoChoice = false;
  var curFilter = "tous", curQuery = "", curColl = "";
  /* État du tri du catalogue. Déclaré ici, avec les autres critères de
     navigation : la lecture de l'adresse se fait avant le rendu de la
     grille, et une variable déclarée plus bas ne serait pas encore un
     tableau au moment où le lien partagé est relu. */
  var curTaille = "", curMarques = [], curPrix = "", curDispo = false, curTri = "defaut";

  /* ---------------- Initialisation ---------------- */
  applySettings();

  /* ---------------- Grille produits ---------------- */

  /* ---------------- Collections ----------------
     Seconde taxonomie : la catégorie dit le type de produit et porte les
     déclinaisons, la collection dit la marque et porte l'identité. Les deux
     filtrent la grille indépendamment. */
  function collList(){
    var c = store.settings.collections;
    if (!Array.isArray(c)) return [];
    /* Migration visuelle bornée : les anciennes couvertures locales du dépôt
       sont remplacées par les compositions issues des vraies photos produit.
       Une couverture téléversée par le commerçant (URL Supabase) reste
       prioritaire et n'est jamais écrasée. Table locale à la fonction pour
       éviter toute lecture avant affectation au démarrage. */
    var bannieres = {
      "calvin-klein":"assets/brand-banners/calvin-klein.webp",
      "louis-vuitton":"assets/brand-banners/louis-vuitton.webp",
      "hermes":"assets/brand-banners/hermes.webp",
      "burberry":"assets/brand-banners/burberry.webp",
      "givenchy":"assets/brand-banners/givenchy.webp",
      "dior":"assets/brand-banners/dior.webp",
      "balenciaga":"assets/brand-banners/balenciaga.webp",
      "hugo":"assets/brand-banners/hugo.webp",
      "tommy-jeans":"assets/brand-banners/tommy-jeans.webp",
      "moncler":"assets/brand-banners/moncler.webp",
      "ea7":"assets/brand-banners/ea7.webp",
      "allsaints":"assets/brand-banners/allsaints.webp"
    };
    return c.filter(function(x){ return x && x.key && x.label; }).map(function(x){
      var ancien = (x.cover || "").toString();
      if (bannieres[x.key] && /^assets\/(brands|marques|studio)\//.test(ancien)){
        var copie = {};
        for (var k in x) copie[k] = x[k];
        copie.cover = bannieres[x.key];
        return copie;
      }
      return x;
    });
  }
  function collById(key){
    return collList().filter(function(c){ return c.key === key; })[0] || null;
  }
  function collFromUrl(){
    try {
      /* `?c=` est la forme courte des pages de marque ; `?collection=` est
         l'ancienne forme, conservée pour les liens déjà partagés. */
      var m = location.search.match(/[?&]c=([^&]+)/) || location.search.match(/[?&]collection=([^&]+)/);
      return m ? decodeURIComponent(m[1]) : "";
    } catch(e){ return ""; }
  }

  /* Sur une carte étroite, deux montants complets ne tiennent pas sur une
     ligne. L'ancien prix perd sa devise : barré et suivi du prix courant en
     FCFA, il reste parfaitement lisible. */
  function priceHTML(p){
    if (p.oldPrice > p.price) return '<span class="old">' + fmtShort(p.oldPrice) + '</span><span class="sale">' + fmt(p.price) + '</span>';
    return fmt(p.price);
  }
  function badgeHTML(p){
    if (isOut(p)) return '<span class="badge">Rupture de stock</span>';
    if (p.oldPrice > p.price){
      var remise = Math.max(1, Math.round((p.oldPrice - p.price) * 100 / p.oldPrice));
      return '<span class="badge badge-sale">-' + remise + ' %</span>';
    }
    if (p.badge) return '<span class="badge">' + esc(p.badge) + '</span>';
    return "";
  }
  /* Rarete affichee seulement sous 4 pieces, et uniquement a partir du stock
     reel : un faux compte a rebours convertit une fois puis brule la marque. */
  function stockHintHTML(p){
    if (isOut(p)) return '<span class="stock-hint">&nbsp;</span>';
    var total = 0, low = [];
    for (var k in p.variants){
      var a = availFor(p, k);
      if (a > 0){
        total += a;
        var lib = variantLabel(p, k);
        if (a <= 3) low.push(lib ? a + " en " + lib : a + " pièces");
      }
    }
    if (total === 0 || total > 8) return '<span class="stock-hint">&nbsp;</span>';
    if (low.length) return '<span class="stock-hint">Plus que ' + esc(low[0]) + '</span>';
    return '<span class="stock-hint">Plus que ' + total + ' pièces</span>';
  }
  /* Le nom du modèle ne suffit pas à l'identifier : deux marques peuvent
     vendre une « Claquette Monogramme ». Sans la marque affichée, le client
     ne sait pas ce qu'il achète et le commerçant ne sait pas quoi expédier.
     Elle accompagne donc le nom partout : carte, fiche, panier, commande. */
  function marqueDe(p){
    var c = p.collection ? collById(p.collection) : null;
    return c ? c.label : "";
  }
  /* Les coloris se montrent avec les vraies photos du produit, jamais avec
     des pastilles arbitraires. Trois apercus suffisent sur la carte ; le
     nombre indique clairement s'il reste d'autres variantes a ouvrir. */
  function cardColorisHTML(p){
    var axes = prodAxes(p), axe = null;
    for (var i = 0; i < axes.length; i++){
      if (/coloris|couleur|color/i.test(axes[i].name)){ axe = axes[i]; break; }
    }
    var photos = [];
    if (axe){
      axe.values.forEach(function(val){
        var src = p.valueImages && p.valueImages[axe.name + VSEP + val];
        if (src && !photos.some(function(x){ return x.src === src; }))
          photos.push({ src: src, label: val });
      });
    }
    if (!photos.length) return '<div class="pcolors pcolors-empty" aria-hidden="true"></div>';
    var total = photos.length, visibles = photos.slice(0, 3);
    return '<div class="pcolors" aria-label="' + total + ' coloris disponible' + (total > 1 ? 's' : '') + '">' +
      '<span class="pcolors-count">' + total + ' coloris</span>' +
      '<span class="pcolors-list" aria-hidden="true">' +
        visibles.map(function(x){
          return '<span class="pcolor-photo"><img ' + lazyAttrs(colorThumbUrl(x.src)) +
            ' alt="" width="72" height="88" onerror="AURA_IMG(this)" /></span>';
        }).join("") +
        (total > visibles.length ? '<span class="pcolor-more">+' + (total - visibles.length) + '</span>' : '') +
      '</span>' +
    '</div>';
  }
  function cardHTML(p){
    var name = esc(p.name), img = esc(p.img), alt = esc("Produit " + p.name);
    var marque = marqueDe(p);
    var out = isOut(p);
    return '<article class="pcard" data-card="' + esc(p.id) + '">' +
      '<div class="pmedia">' +
        '<img ' + lazyAttrs(cardThumbUrl(p.img)) + ' alt="' + alt + '" width="600" height="800" onerror="AURA_IMG(this)" />' +
        /* Lien en surimpression plutot qu'un <a> autour du bloc : le bouton
           favori est un vrai bouton, et un bouton dans un lien n'est pas du
           HTML valide. Le favori passe au-dessus par son z-index. */
        '<a class="pmedia-link" href="produit.html?id=' + encodeURIComponent(p.id) + '" aria-label="' + alt + '"></a>' +
        badgeHTML(p) +
        '<button class="wish" data-wish="' + esc(p.id) + '" data-on="' + (isWished(p.id) ? "true" : "false") + '" aria-pressed="' + (isWished(p.id) ? "true" : "false") + '" aria-label="' + (isWished(p.id) ? "Retirer des favoris" : "Ajouter aux favoris") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.4 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .9-4.5 2.5C10.5 3.9 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.1 3 5.5l7 6Z"/></svg></button>' +
      '</div>' +
      '<div class="pinfo">' +
        /* Le bandeau est réservé dès qu'une marque existe dans la boutique,
           même vide sur un produit sans marque : sinon deux cartes voisines
           n'ont pas la même hauteur. Une boutique sans marques n'a pas de
           bandeau du tout, donc pas d'espace perdu. */
        (collList().length ? '<span class="pbrand">' + esc(marque) + '</span>' : '') +
        '<a class="pname" href="produit.html?id=' + encodeURIComponent(p.id) + '">' + name + '</a>' +
        '<span class="pdelivery">' + esc(deliveryLabel()) + '</span>' +
        cardColorisHTML(p) +
        '<span class="price">' + priceHTML(p) + '</span>' +
        stockHintHTML(p) +
      '</div>' +
      /* Sur la grille le bouton ouvre la modale — un achat rapide sans
         quitter la liste. Le nom et la photo mènent à la fiche pleine page,
         qui a une adresse partageable. */
      '<div class="padd"><button class="btn btn-primary btn-full" data-openp="' + esc(p.id) + '">' + (out ? "Me prévenir du retour" : "Choisir la taille") + '</button></div>' +
    '</article>';
  }
  /* ---------------- Filtre par pointure ----------------
     Dans une boutique de chaussures, la question n'est pas « quels modèles
     existent » mais « lesquels existent à ma pointure ». Sans ce filtre, un
     client qui chausse du 44 ouvre les fiches une par une jusqu'à en trouver
     une disponible, et abandonne avant. Le filtre porte sur le premier axe
     de la catégorie — celui que le commerçant a nommé « Pointure » — et ne
     retient que les tailles réellement en stock. */

  function premierAxe(p){
    var axes = prodAxes(p);
    return axes.length ? axes[0] : null;
  }
  /* Vrai si le produit a au moins une combinaison disponible dont la valeur
     du premier axe est celle demandée — toutes couleurs confondues. */
  function aLaTaille(p, taille){
    var keys = allKeys(p);
    for (var i = 0; i < keys.length; i++){
      var vals = valuesOf(keys[i]);
      if (vals.length && vals[0] === taille && availFor(p, keys[i]) > 0) return true;
    }
    return false;
  }
  /* ---------------- Tri et filtres du catalogue ----------------
     Une boutique de chaussures se parcourt par pointure, puis par marque.
     Ces critères vivaient jusqu'ici à trois endroits différents — onglets
     de catégorie, rangée de pointures, recherche — sans jamais se combiner.
     Ils tiennent désormais dans un panneau unique, avec le compte de
     résultats et un ordre d'affichage. */

  /* Vrai si le produit possède cette valeur d'axe en stock, toutes autres
     valeurs confondues. `rang` vaut 0 pour la pointure, 1 pour le coloris. */
  function aLaValeur(p, rang, valeur){
    var keys = allKeys(p);
    for (var i = 0; i < keys.length; i++){
      var vals = valuesOf(keys[i]);
      if (vals.length > rang && vals[rang] === valeur && availFor(p, keys[i]) > 0) return true;
    }
    return false;
  }
  function enStock(p){
    if (p.stockout) return false;
    var keys = allKeys(p);
    for (var i = 0; i < keys.length; i++) if (availFor(p, keys[i]) > 0) return true;
    return false;
  }
  /* Trois tranches bâties sur les prix réellement présents : figées dans le
     code, elles deviendraient fausses au premier changement de catalogue. */
  function tranchesPrix(list){
    var prix = list.map(function(p){ return p.price || 0; }).filter(function(n){ return n > 0; });
    if (prix.length < 3) return [];
    var min = Math.min.apply(null, prix), max = Math.max.apply(null, prix);
    if (max - min < 3000) return [];
    var pas = Math.round((max - min) / 3 / 1000) * 1000 || 1000;
    var a = min + pas, b = min + pas * 2;
    return [
      { cle: "0-" + a, label: "Moins de " + fmt(a), min: 0, max: a - 1 },
      { cle: a + "-" + b, label: fmt(a) + " à " + fmt(b), min: a, max: b },
      { cle: b + "-", label: "Plus de " + fmt(b), min: b + 1, max: Infinity }
    ];
  }
  function trancheActive(list){
    var t = tranchesPrix(list);
    for (var i = 0; i < t.length; i++) if (t[i].cle === curPrix) return t[i];
    return null;
  }
  function passeFiltres(p, tranche){
    if (curTaille && !aLaValeur(p, 0, curTaille)) return false;
    if (curMarques.length && curMarques.indexOf(p.collection || "") < 0) return false;
    if (tranche && (p.price < tranche.min || p.price > tranche.max)) return false;
    if (curDispo && !enStock(p)) return false;
    return true;
  }
  function nbFiltres(){
    return (curTaille ? 1 : 0) + curMarques.length + (curPrix ? 1 : 0) + (curDispo ? 1 : 0);
  }
  function trier(list){
    var out = list.slice();
    if (curTri === "prix-asc") out.sort(function(a, b){ return (a.price || 0) - (b.price || 0); });
    else if (curTri === "prix-desc") out.sort(function(a, b){ return (b.price || 0) - (a.price || 0); });
    else if (curTri === "nom") out.sort(function(a, b){ return String(a.name).localeCompare(String(b.name), "fr"); });
    else if (curTri === "nouveau") out.sort(function(a, b){
      var na = /nouveau/i.test(a.badge || "") ? 0 : 1, nb = /nouveau/i.test(b.badge || "") ? 0 : 1;
      return na - nb;
    });
    return out;
  }

  /* Le panneau ne propose que ce qui existe vraiment dans la sélection en
     cours : une marque sans modèle disponible n'apparaît pas, et un filtre
     ne peut donc jamais mener à une page vide par sa seule faute. */
  function renderFiltres(base, resultats){
    var tools = $("#catTools");
    if (!tools) return;
    var panel = $("#catPanel"), actives = $("#catActives"), compte = $("#catCount");
    tools.hidden = base.length < 2;
    if (tools.hidden) return;

    var groupes = "";

    var pointures = [], nomAxe = "";
    base.forEach(function(p){
      var ax = premierAxe(p);
      if (!ax) return;
      if (!nomAxe) nomAxe = ax.name;
      ax.values.forEach(function(v){
        if (pointures.indexOf(v) < 0 && aLaValeur(p, 0, v)) pointures.push(v);
      });
    });
    if (pointures.length > 1){
      groupes += '<div class="cat-group"><h4>' + esc(nomAxe || "Pointure") + '</h4><div class="cat-opts">' +
        pointures.map(function(v){
          var n = base.filter(function(p){ return aLaValeur(p, 0, v); }).length;
          return '<button type="button" class="cat-opt" data-fpointure="' + esc(v) + '" aria-pressed="' +
            (curTaille === v ? "true" : "false") + '">' + esc(v) + '<span class="cat-n">' + n + '</span></button>';
        }).join("") + '</div></div>';
    }

    /* Sur une page de marque, proposer les marques n'a aucun sens : la
       sélection est déjà faite par la page elle-même. */
    if (!curColl){
      var marques = [];
      base.forEach(function(p){
        if (p.collection && marques.indexOf(p.collection) < 0) marques.push(p.collection);
      });
      if (marques.length > 1){
        groupes += '<div class="cat-group"><h4>Marque</h4><div class="cat-opts">' +
          marques.map(function(k){
            var c = collById(k), n = base.filter(function(p){ return p.collection === k; }).length;
            return '<button type="button" class="cat-opt" data-fmarque="' + esc(k) + '" aria-pressed="' +
              (curMarques.indexOf(k) >= 0 ? "true" : "false") + '">' + esc(c ? c.label : k) +
              '<span class="cat-n">' + n + '</span></button>';
          }).join("") + '</div></div>';
      }
    }

    var tranches = tranchesPrix(base);
    if (tranches.length){
      groupes += '<div class="cat-group"><h4>Prix</h4><div class="cat-opts">' +
        tranches.map(function(t){
          var n = base.filter(function(p){ return p.price >= t.min && p.price <= t.max; }).length;
          if (!n) return "";
          return '<button type="button" class="cat-opt" data-fprix="' + esc(t.cle) + '" aria-pressed="' +
            (curPrix === t.cle ? "true" : "false") + '">' + esc(t.label) + '<span class="cat-n">' + n + '</span></button>';
        }).join("") + '</div></div>';
    }

    groupes += '<div class="cat-group"><h4>Disponibilité</h4><div class="cat-opts">' +
      '<button type="button" class="cat-opt" data-fdispo="1" aria-pressed="' + (curDispo ? "true" : "false") +
      '">En stock seulement</button></div></div>';

    /* Sortie explicite du panneau : sans elle, refermer demande de remonter
       jusqu'au bouton « Filtrer », au-dessus de la zone qu'on vient de lire. */
    groupes += '<button type="button" class="cat-done" data-fclose>' +
      (resultats > 1 ? 'Voir les ' + resultats + ' modèles' : (resultats === 1 ? 'Voir le modèle' : 'Fermer')) +
      '</button>';

    panel.innerHTML = groupes;

    var tags = [];
    if (curTaille) tags.push({ k: "pointure", v: curTaille, l: (nomAxe || "Pointure") + " " + curTaille });
    curMarques.forEach(function(k){ var c = collById(k); tags.push({ k: "marque", v: k, l: c ? c.label : k }); });
    var ta = trancheActive(base);
    if (ta) tags.push({ k: "prix", v: ta.cle, l: ta.label });
    if (curDispo) tags.push({ k: "dispo", v: "1", l: "En stock" });

    actives.hidden = !tags.length;
    actives.innerHTML = tags.length
      ? tags.map(function(t){
          return '<button type="button" class="cat-tag" data-ftag="' + esc(t.k) + '" data-fval="' + esc(t.v) +
            '" aria-label="Retirer le filtre ' + esc(t.l) + '"><b>' + esc(t.l) + '</b><span aria-hidden="true">×</span></button>';
        }).join("") + '<button type="button" class="cat-clear" data-fclear>Tout effacer</button>'
      : "";

    var n = nbFiltres();
    compte.hidden = !n;
    compte.textContent = n;
    var tri = $("#catTri");
    if (tri && tri.value !== curTri) tri.value = curTri;
  }

  /* Le panneau se replie en hauteur : sur téléphone il pousserait sinon les
     produits sous la ligne de flottaison, et le client choisirait un critère
     sans jamais voir ce qu'il déclenche. */
  function panneauOuvert(){
    var w = $("#catPanelWrap");
    return !!w && w.getAttribute("data-open") === "true";
  }
  function ouvrirPanneau(ouvrir){
    var w = $("#catPanelWrap"), btn = $("#catFiltrer");
    if (!w || !btn) return;
    w.setAttribute("data-open", ouvrir ? "true" : "false");
    btn.setAttribute("aria-expanded", ouvrir ? "true" : "false");
  }
  /* Sur petit écran, choisir un critère referme le panneau : le client veut
     voir le résultat, pas relire la liste des options. */
  function refermerSiPetitEcran(){
    if (window.innerWidth <= 760) ouvrirPanneau(false);
  }

  function toggleDansListe(liste, valeur){
    var i = liste.indexOf(valeur);
    if (i >= 0) liste.splice(i, 1); else liste.push(valeur);
    return liste;
  }
  function effacerFiltres(){
    curTaille = ""; curMarques = []; curPrix = ""; curDispo = false;
    renderGrid(); syncUrl(curFilter);
  }

  function renderBarreTailles(list){
    var box = $("#barreTailles");
    if (!box) return;
    /* Union des valeurs disponibles sur les produits affichés, dans l'ordre
       où la catégorie les déclare : 39, 40… et non 39, 40, 41 mélangés. */
    var vues = [], nomAxe = "";
    list.forEach(function(p){
      var ax = premierAxe(p);
      if (!ax) return;
      if (!nomAxe) nomAxe = ax.name;
      ax.values.forEach(function(v){
        if (vues.indexOf(v) < 0 && aLaTaille(p, v)) vues.push(v);
      });
    });
    if (vues.length < 2){ box.hidden = true; box.innerHTML = ""; return; }
    box.hidden = false;
    box.innerHTML = '<span class="sizebar-label">' + esc(nomAxe || "Taille") + '</span>' +
      '<button type="button" class="size-chip' + (curTaille ? "" : " active") + '" data-taille="">Toutes</button>' +
      vues.map(function(v){
        return '<button type="button" class="size-chip' + (curTaille === v ? " active" : "") +
               '" data-taille="' + esc(v) + '">' + esc(v) + '</button>';
      }).join("");
  }
  function setTaille(v){
    curTaille = v || "";
    renderGrid();
    syncUrl(curFilter);
  }

  function renderGrid(){
    /* Les rangées de l'accueil contiennent les mêmes cartes que la grille :
       un cœur cliqué ou un stock consommé doit s'y voir aussi. L'accueil n'a
       pas de grille, donc ce rafraîchissement passe avant la sortie. */
    if ($("#marquesBandes")) renderBandes(collList());
    var g = $("#grid");
    if (!g) return;
    var list = store.products.filter(function(p){ return p.active; });
    if (curColl) list = list.filter(function(p){ return p.collection === curColl; });
    list = list.filter(function(p){ return curFilter === "tous" || p.cat === curFilter; });
    /* La barre est bâtie avant le filtre de pointure, sinon choisir « 44 »
       ferait disparaître toutes les autres pointures de la barre et on ne
       pourrait plus en changer. */
    renderBarreTailles(list);
    /* Le panneau se construit sur la sélection d'avant les filtres : sinon
       choisir « 44 » ferait disparaître toutes les autres pointures et on ne
       pourrait plus en changer. */
    var tranche = trancheActive(list);
    var visibles = list.filter(function(p){ return passeFiltres(p, tranche); });
    renderFiltres(list, visibles.length);
    list = visibles;
    if (curQuery){
      var q = curQuery.toLowerCase();
      list = list.filter(function(p){ /* La marque est ce qu'on tape en premier dans une boutique
           multi-marques : « dior » doit trouver les modèles Dior. */
        return p.name.toLowerCase().indexOf(q) >= 0 ||
               (CATS[p.cat]||"").toLowerCase().indexOf(q) >= 0 ||
               marqueDe(p).toLowerCase().indexOf(q) >= 0; });
    }
    var total = $("#catTotal");
    if (total) total.textContent = list.length
      ? (list.length > 1 ? list.length + " modèles" : "1 modèle")
      : "";
    if (!list.length){
      /* Message adapté : dire « aucun résultat » sans dire quel critère
         exclut tout laisse le client croire que la boutique est vide. */
      g.innerHTML = '<p class="none-msg">' +
        (nbFiltres()
          ? 'Aucun modèle ne correspond à ces critères.' +
            '<br><button type="button" class="btn btn-primary" style="margin-top:16px" data-fclear>Effacer les filtres</button>'
          : 'Aucun produit ne correspond à votre recherche.' +
            '<br><button type="button" class="btn btn-primary" style="margin-top:16px" data-reset-filters>Voir tout le catalogue</button>') +
        '</p>';
      return;
    }
    g.innerHTML = trier(list).map(cardHTML).join("");
  }
  function setFilter(f){
    curFilter = f; curQuery = "";
    syncUrl(f);
    $$(".tab").forEach(function(x){ x.classList.toggle("active", x.getAttribute("data-filter") === curFilter); });
    renderGrid();
  }
  /* L'adresse suit la catégorie affichée : elle devient partageable et
     indexable. `replaceState` évite d'empiler une entrée d'historique à
     chaque clic de filtre. */
  function syncUrl(cat){
    if (!window.history || !history.replaceState) return;
    if (!$("#produits")) return;
    var params = [];
    if (curColl) params.push("c=" + encodeURIComponent(curColl));
    if (cat && cat !== "tous") params.push("cat=" + encodeURIComponent(cat));
    if (curTaille) params.push("t=" + encodeURIComponent(curTaille));
    /* Une sélection se partage : « voici les Dior en 43 » doit tenir dans un
       lien collé sur WhatsApp, sinon le client refait les clics à la main. */
    if (curMarques.length) params.push("m=" + encodeURIComponent(curMarques.join(",")));
    if (curPrix) params.push("p=" + encodeURIComponent(curPrix));
    if (curDispo) params.push("dispo=1");
    if (curTri && curTri !== "defaut") params.push("tri=" + encodeURIComponent(curTri));
    var url = location.pathname + (params.length ? "?" + params.join("&") : "");
    try { history.replaceState(null, "", url); } catch(e){}
  }
  function paramUrl(nom){
    try {
      var m = location.search.match(new RegExp("[?&]" + nom + "=([^&]+)"));
      return m ? decodeURIComponent(m[1]) : "";
    } catch(e){ return ""; }
  }
  function listeUrl(nom){
    var v = paramUrl(nom);
    return v ? v.split(",").filter(Boolean) : [];
  }
  function tailleFromUrl(){
    try {
      var m = location.search.match(/[?&]t=([^&]+)/);
      return m ? decodeURIComponent(m[1]) : "";
    } catch(e){ return ""; }
  }
  function catFromUrl(){
    try {
      var m = location.search.match(/[?&]cat=([^&]+)/);
      return m ? decodeURIComponent(m[1]) : null;
    } catch(e){ return null; }
  }

  function goTo(cat){
    setFilter(cat);
    syncUrl(cat);
    var prod = $("#produits");
    if (!prod) return;
    window.scrollTo({ top: prod.getBoundingClientRect().top + window.pageYOffset - 70, behavior: "smooth" });
  }


  /* ---------------- Fiche produit en pleine page ----------------
     La modale suffit pour ajouter vite au panier depuis une grille. Elle ne
     suffit pas pour vendre : elle n'a pas d'adresse, donc rien à envoyer sur
     WhatsApp, rien à indexer, et le bouton « retour » la referme au lieu de
     revenir. La fiche pleine page reprend le même moteur — mêmes
     identifiants, même sélection de variante — et y ajoute ce qui décide
     l'achat : garanties, guide des pointures, et les autres modèles de la
     marque. */

  /* Les garanties, source unique. Elles apparaissaient à trois endroits —
     bandeau de l'accueil, fiche produit, bas de fiche — écrites trois fois.
     Changer « Livraison 24h » pour « 48h » en laissait donc deux périmées, et
     deux promesses contradictoires sur le même site coûtent la vente. Elles
     vivent maintenant dans les réglages, modifiables par le commerçant. */
  function garantiesListe(){
    var c = contenu();
    var g = Array.isArray(c.garanties) ? c.garanties : [];
    var d = deliveryDelay();
    var e = (store.settings.exchangeTime || "").toString().trim();
    var defauts = [
      { t: "Payé à la livraison", s: "Vous essayez devant le livreur avant de payer. Rien à avancer." },
      { t: d ? "Livraison " + d : "Livraison à Bamako", s: "Partout dans la ville, prévenue par WhatsApp." },
      { t: e ? "Échange sous " + e : "Échange possible", s: "Mauvaise pointure ? On repasse l'échanger." },
      { t: "Stock réel", s: "Le nombre affiché est celui de la boutique, pointure par pointure." }
    ];
    /* Une ligne laissée vide par le commerçant reprend sa valeur par défaut
       plutôt que d'afficher un blanc. */
    return defauts.map(function(def, i){
      var x = g[i] || {};
      return { t: (x.t || "").toString().trim() || def.t,
               s: (x.s || "").toString().trim() || def.s };
    });
  }
  function garantiesVisibles(){ return contenu().garantiesOn !== false; }
  function ficheGarantiesHTML(){
    if(!garantiesVisibles())return "";
    return garantiesListe().map(function(x){
      return '<div class="trust-item"><b>' + esc(x.t) + '</b><span>' + esc(x.s) + '</span></div>';
    }).join("");
  }
  /* Le bandeau de l'accueil n'affiche que les trois premières : la quatrième
     ferait passer les cartes à deux lignes sur téléphone. */
  function renderTrustBar(){
    var host = document.querySelector(".trust-grid");
    if (!host) return;
    var section=host.closest(".trust");if(section)section.hidden=!garantiesVisibles();
    if(!garantiesVisibles()){host.innerHTML="";return;}
    host.innerHTML = garantiesListe().slice(0, 3).map(function(x){
      return '<div class="trust-item"><b>' + esc(x.t) + '</b><span>' + esc(x.s) + '</span></div>';
    }).join("");
  }

  /* Correspondance pointure / longueur de pied. Bornée aux pointures que le
     produit propose vraiment : un guide qui parle du 46 quand la boutique
     s'arrête au 45 fait douter de tout le reste. */
  function ficheGuideHTML(p){
    /* Table déclarée dans la fonction, pas au-dessus : une `var` de module
       lue avant que sa ligne d'affectation ne s'exécute vaut `undefined`, et
       le rendu s'arrête net. Le même piège avait déjà vidé le catalogue. */
    var LONGUEUR_CM = { "36":"22,5", "37":"23,2", "38":"24,0", "39":"24,7", "40":"25,3",
                        "41":"26,0", "42":"26,6", "43":"27,3", "44":"27,9", "45":"28,6",
                        "46":"29,2", "47":"29,9" };
    var axes = prodAxes(p);
    if (!axes.length) return "";
    var lignes = axes[0].values.filter(function(v){ return LONGUEUR_CM[v]; });
    if (lignes.length < 2) return "";
    return '<table class="guide-table"><tbody>' + lignes.map(function(v){
      return '<tr><th scope="row">' + esc(axes[0].name) + ' ' + esc(v) + '</th><td>' +
             LONGUEUR_CM[v] + ' cm</td></tr>';
    }).join("") + '</tbody></table>' +
    '<p class="guide-note">Mesurez votre pied du talon au gros orteil, debout, en fin de journée. Entre deux pointures, prenez au-dessus.</p>';
  }

  /* Autres modèles de la même marque, sinon de la même catégorie. Un client
     venu pour une marque en veut d'autres de la même marque ; c'est ce qui
     transforme une fiche en deuxième vente. */
  function ficheSuggestions(p){
    var actifs = store.products.filter(function(x){ return x.active && x.id !== p.id; });
    var memeMarque = p.collection
      ? actifs.filter(function(x){ return x.collection === p.collection; })
      : [];
    var liste = memeMarque.length ? memeMarque
              : actifs.filter(function(x){ return x.cat === p.cat; });
    return { titre: memeMarque.length ? "Autres modèles " + marqueDe(p) : "Dans le même rayon",
             liste: liste.slice(0, 4) };
  }

  function majFiche(){
    var p = pvProduct;
    if (!p) return;
    var marque = marqueDe(p);

    var fil = $("#filMarque");
    if (fil){
      fil.innerHTML = (p.collection && marque)
        ? '· <a href="collection.html?c=' + encodeURIComponent(p.collection) + '">' + esc(marque) + '</a>'
        : '· ' + esc(CATS[p.cat] || p.cat);
    }

    var g = $("#ficheGuideCorps");
    if (g){
      var html = ficheGuideHTML(p);
      g.innerHTML = html;
      var det = $("#ficheGuide");
      if (det) det.hidden = !html;
    }

    var sp = $("#ficheSpecs");
    if (sp){sp.innerHTML = ficheGarantiesHTML();sp.hidden=!garantiesVisibles();}
    var tr = $("#ficheTrust");
    if (tr){tr.innerHTML = garantiesVisibles()?'<div class="wrap"><div class="trust-grid">' + ficheGarantiesHTML() + '</div></div>':"";tr.hidden=!garantiesVisibles();}

    var sugg = ficheSuggestions(p);
    var host = $("#ficheSugg");
    if (host){
      host.innerHTML = sugg.liste.map(cardHTML).join("");
      var sec = $("#ficheSuggSection");
      if (sec) sec.hidden = !sugg.liste.length;
      var t = $("#ficheSuggTitre");
      if (t) t.textContent = sugg.titre;
    }

    document.title = (marque ? marque + " " : "") + p.name + " — " +
      store.settings.shopName + " — Boutique en ligne · Bamako";
    poserMeta("description", (p.desc || "").toString().slice(0, 160) ||
      ((marque ? marque + " " : "") + p.name + " à Bamako. Paiement à la livraison."));
    poserCanonique(location.origin + location.pathname + "?id=" + encodeURIComponent(p.id));
  }

  /* Barre d'achat fixe. Elle répète le prix et la variante choisie : sur
     téléphone, la sélection des pointures a défilé hors de l'écran au moment
     où le client se décide. */
  function majBuybar(){
    var bar = $("#buybar");
    if (!bar || !pvProduct) return;
    bar.hidden = false;
    var lib = variantLabel(pvProduct, pvKey());
    var v = $("#buybarVariant");
    if (v) v.textContent = lib || (CATS[pvProduct.cat] || "");
    var pr = $("#buybarPrice");
    if (pr) pr.textContent = fmt(pvProduct.price);
    var b = $("#buybarAdd");
    if (b){
      var a = availFor(pvProduct, pvKey());
      b.disabled = a <= 0;
      b.textContent = a <= 0 ? "Pointure épuisée" : "Ajouter au panier";
    }
  }

  /* ---------------- Fiche produit ---------------- */
  function pvKey(){ return keyOf(pvSel); }
  function openPV(id){
    var p = findProduct(id); if (!p) return;
    pvProduct = p; pvSel = valuesOf(firstAvailableKey(p)); pvQty = 1; pvBuy = false; pvImgs = []; pvPhotoChoice = false;
    var imgs = (p.imgs && p.imgs.length) ? p.imgs : (p.img ? [p.img] : []);
    pvImgs = imgs;
    var media = '<img class="pv-main" src="' + esc(mediaUrl(imgs[0] || "")) + '" onerror="AURA_IMG(this)" alt="' + esc(p.name) + '" />';
    if (imgs.length > 1){
      media += '<div class="pv-thumbs" id="pvThumbs">' + imgs.map(function(src, i){
        return '<button type="button" data-thumb="' + i + '" aria-label="Voir la photo ' + (i + 1) + ' sur ' + imgs.length + '"' + (i === 0 ? ' class="active"' : '') + '><img ' + lazyAttrs(detailThumbUrl(src)) + ' onerror="AURA_IMG(this)" alt="" /></button>';
      }).join("") + '</div>';
    }
    $("#pvMedia").innerHTML = media;
    var marque = marqueDe(p);
    $("#pvCat").textContent = (marque ? marque + " · " : "") + (CATS[p.cat] || p.cat);
    $("#pvName").textContent = p.name;
    $("#pvPrice").innerHTML = priceHTML(p);
    $("#pvDesc").textContent = p.desc || "";
    renderAxes();
    majPhotoPrincipale();
    updateStockLine();
    updateQty(0);
    /* En pleine page il n'y a rien a ouvrir : la fiche est deja la. */
    if ($("#pvOverlay")) openModal("pvOverlay");
    else majFiche();
  }
  /* Un sélecteur par axe. Une valeur est marquée épuisée quand aucune
     combinaison la contenant n'a de stock — ce qui reste juste avec deux axes
     sans obliger le client à tâtonner. */
  function valueHasStock(p, iAxe, val){
    return allKeys(p).some(function(k){
      var v = valuesOf(k);
      return v[iAxe] === val && availFor(p, k) > 0;
    });
  }
  /* Photo associée à la sélection courante : la première valeur choisie qui
     en déclare une l'emporte. On remonte les axes dans l'ordre, donc le
     coloris prime sur la pointure — ce qui est le bon sens : une pointure
     n'a pas de photo propre. */
  function photoDeSelection(){
    var p = pvProduct;
    if (!p || !pvPhotoChoice) return "";
    var axes = prodAxes(p);
    for (var i = axes.length - 1; i >= 0; i--){
      var propre = p.valueImages && p.valueImages[axes[i].name + "::" + pvSel[i]];
      if (propre) return propre;
      var meta = catAxisValue(p.cat, axes[i].name, pvSel[i]);
      if (meta && meta.img) return meta.img;
    }
    return "";
  }
  function majPhotoPrincipale(){
    var img = document.querySelector("#pvMedia .pv-main");
    if (!img) return;
    var voulue = photoDeSelection();
    var defaut = pvImgs[0] || "";
    var cible = mediaUrl(voulue || defaut);
    if (cible && img.getAttribute("src") !== cible) img.src = cible;
    /* La miniature active suit, sinon l'état affiché se contredit. */
    var vignettes = $$("#pvThumbs [data-thumb]");
    vignettes.forEach(function(b, i){
      b.classList.toggle("active", !voulue && i === 0);
    });
  }

  function renderAxes(){
    var p = pvProduct, host = $("#pvAxes");
    if (!host) return;
    var axes = prodAxes(p);
    if (!axes.length){ host.innerHTML = ""; return; }
    host.innerHTML = axes.map(function(ax, i){
      var boutons = ax.values.map(function(val){
        var dispo = valueHasStock(p, i, val);
        var choisi = pvSel[i] === val;
        var meta = catAxisValue(p.cat, ax.name, val) || {};
        var estColoris = /couleur|coloris|color/i.test(ax.name || "");
        var photo = (p.valueImages && p.valueImages[ax.name + "::" + val]) || (estColoris && meta.img) || "";
        /* Un coloris n'est jamais représenté par une pastille ou un mot :
           seule sa vraie photo est montrée au client. */
        if (estColoris && !photo) return "";
        var visuel = photo
          ? '<img class="choice-photo" ' + lazyAttrs(colorThumbUrl(photo)) + ' alt="" />'
          : '';
        return '<button type="button" class="size-btn' + (photo ? " has-photo" : "") +
               (choisi ? " selected" : "") + (dispo ? "" : " soldout") +
               '" data-axe="' + i + '" data-val="' + esc(val) + '"' +
               ' title="' + esc(val) + '" aria-label="' + esc(val) + (dispo ? '"' : ' — épuisé, être prévenu du retour"') +
               '>' + visuel + (photo ? '<span class="sr-only">' + esc(val) + '</span>' : esc(val)) + '</button>';
      }).join("");
      return '<div class="axe-bloc">' +
               '<span class="size-label">' + esc(ax.name) + '</span>' +
               '<div class="size-row">' + boutons + '</div>' +
             '</div>';
    }).join("");
  }

  /* Une variante epuisee, c'est un acheteur qui voulait payer. On garde son
     numero au lieu de le laisser partir sans trace. */
  function waitlistHTML(){
    if (!pvProduct) return "";
    if (availFor(pvProduct, pvKey()) > 0) return "";
    return '<div class="waitlist" id="pvWaitlist">' +
      '<p>' + esc(variantLabel(pvProduct, pvKey()) || "Ce produit") + ' épuisé. Laissez votre numéro : on vous prévient dès le réassort.</p>' +
      '<div class="waitlist-row">' +
        '<input type="tel" id="wlPhone" inputmode="tel" autocomplete="tel" placeholder="76 12 34 56" aria-label="Votre numéro WhatsApp" />' +
        '<button type="button" class="btn btn-primary" id="wlSubmit">Me prévenir</button>' +
      '</div>' +
    '</div>';
  }
  function renderWaitlist(){
    var host = $("#pvWaitlistHost");
    if (host) host.innerHTML = waitlistHTML();
  }
  function submitWaitlist(){
    var inp = $("#wlPhone");
    if (!inp) return;
    var phone = digits(inp.value);
    if (phone.length === 11 && phone.slice(0, 3) === "223") phone = phone.slice(3);
    if (phone.length !== 8){ toast("Numéro invalide (8 chiffres)"); inp.focus(); return; }
    var entry = { id: pvProduct.id, name: pvProduct.name,
                  size: variantLabel(pvProduct, pvKey()) || "—", phone: phone };
    if (window.AURA_DB && window.AURA_DB.ready()){
      window.AURA_DB.joinWaitlist(entry, function(er){
        if (er) console.warn("Liste d'attente non synchronisée", er);
      });
    }
    try {
      var local = JSON.parse(localStorage.getItem("aura_waitlist_v1") || "[]");
      local.push({ product_id: entry.id, product_name: entry.name, size: entry.size,
                   phone: entry.phone, created_at: new Date().toISOString() });
      localStorage.setItem("aura_waitlist_v1", JSON.stringify(local));
    } catch(e){}
    var host = $("#pvWaitlistHost");
    if (host) host.innerHTML = '<div class="waitlist"><p class="ok">C\'est noté. On vous écrit sur WhatsApp dès le retour de ' + esc(variantLabel(pvProduct, pvKey()) || "ce produit") + '.</p></div>';
    toast("Vous serez prévenu");
  }

  function updateStockLine(){
    var a = availFor(pvProduct, pvKey());
    var el = $("#pvStock");
    if (a <= 0) el.innerHTML = 'Rupture de stock pour cette taille';
    else el.innerHTML = 'En stock · <strong>' + a + '</strong> disponible' + (a > 1 ? "s" : "");
    var add = $("#pvAdd");
    add.disabled = a <= 0;
    renderWaitlist();
    updateQty(0);
    majBuybar();
  }
  function updateQty(delta){
    var a = availFor(pvProduct, pvKey());
    pvQty += delta;
    if (pvQty < 1) pvQty = 1;
    if (pvQty > a) pvQty = Math.max(1, a);
    $("#pvQtyVal").textContent = pvQty;
    var minus = $("#pvMinus"), plus = $("#pvPlus");
    minus.disabled = pvQty <= 1;
    plus.disabled = (a <= 0 || pvQty >= a);
    minus.style.opacity = pvQty <= 1 ? .4 : 1;
    plus.style.opacity = (a <= 0 || pvQty >= a) ? .4 : 1;
  }
  function addToCart(p, key, qty){
    var a = availFor(p, key);
    if (qty > a) qty = Math.max(0, a);
    if (qty <= 0) return false;
    var it = null;
    for (var i=0;i<cart.length;i++) if (cart[i].id === p.id && cart[i].variant === key){ it = cart[i]; break; }
    if (it) it.qty += qty;
    else cart.push({ id:p.id, variant:key, variantLabel:variantLabel(p, key), qty:qty,
                     name:p.name, brand:marqueDe(p), cat:CATS[p.cat]||p.cat,
                     price:p.price, img:p.img });
    persistCart(); renderCount(); pulserPanier(); renderCart();
    toast("Ajouté au panier");
    return true;
  }

  /* ---------------- Panier ---------------- */
  function count(){ return cart.reduce(function(a,i){ return a + i.qty; }, 0); }
  function subtotal(){ return cart.reduce(function(a,i){ return a + i.price * i.qty; }, 0); }
  function renderCount(){
    var c = count(), el = $("#cartCount");
    el.textContent = c;
    el.setAttribute("data-hidden", c > 0 ? "false" : "true");
    if (lastCount >= 0 && c > lastCount){
      el.setAttribute("data-pop", "true");
      clearTimeout(countPopTimer);
      countPopTimer = setTimeout(function(){ el.setAttribute("data-pop", "false"); }, 430);
    }
    lastCount = c;
  }
  var lastCount = -1, countPopTimer;
  function renderCart(){
    var body = $("#cartBody"), foot = $("#cartFoot");
    $("#cartTitle").textContent = "Mon panier (" + count() + ")";
    if (!cart.length){
      body.innerHTML =
        '<div class="cart-empty">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.4"/><circle cx="19" cy="21" r="1.4"/><path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21.5 7H6.1"/></svg>' +
          '<p>Votre panier est vide.</p>' +
          '<button type="button" class="btn btn-primary" data-empty-cta>Découvrir la collection</button>' +
        '</div>';
      foot.style.display = "none";
      return;
    }
    foot.style.display = "block";
    var sub = subtotal(), del = deliveryFor(sub);
    renderFreeShip(sub);
    $("#cartSubtotal").textContent = fmt(sub);
    $("#cartDelivery").textContent = del === 0 ? "Offerte" : fmt(del);
    $("#cartTotal").textContent = fmt(sub + del);
    body.innerHTML = cart.map(function(it){
      return '<div class="cart-item" data-key="' + esc(it.id + "|" + it.variant) + '">' +
        '<img ' + lazyAttrs(it.img) + ' alt="' + esc(it.name) + '" onerror="AURA_IMG(this)" />' +
        '<div>' +
          '<div class="ci-name">' + esc(it.name) + '</div>' +
          /* `brand` manque aux paniers enregistrés avant cette version : la
             ligne retombe alors sur la catégorie seule, sans casser. */
          '<div class="ci-cat">' + esc(it.brand ? it.brand + " · " + it.cat : it.cat) + '</div>' +
          (it.variantLabel ? '<div class="ci-size">' + esc(it.variantLabel) + '</div>' : "") +
          '<div class="ci-price">' + fmt(it.price) + '</div>' +
          '<div class="ci-qty">' +
            '<button data-qty="dec" aria-label="Réduire la quantité">−</button>' +
            '<span>' + it.qty + '</span>' +
            '<button data-qty="inc" aria-label="Augmenter la quantité">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="ci-right">' +
          '<button class="ci-remove" data-remove>Retirer</button>' +
          '<strong style="font-size:14px">' + fmt(it.price * it.qty) + '</strong>' +
        '</div>' +
      '</div>';
    }).join("") + xsellHTML();
  }
  /* Barre de progression vers la livraison offerte. Le seuil vient des
     reglages : c'est le levier de panier moyen le plus sûr, a condition que
     le client voie ce qu'il lui reste a parcourir. */
  function renderFreeShip(sub){
    var box = $("#freeShip");
    if (!box) return;
    var free = Number(store.settings.freeFrom) || 0;
    var fee  = Number(store.settings.deliveryFee) || 0;
    if (free <= 0 || fee <= 0){ box.hidden = true; return; }
    box.hidden = false;
    var reste = free - sub;
    if (reste <= 0){
      box.classList.add("done");
      $("#freeShipMsg").textContent = "Livraison offerte";
      $("#freeShipBar").style.width = "100%";
    } else {
      box.classList.remove("done");
      $("#freeShipMsg").textContent = "Plus que " + fmt(reste) + " pour la livraison offerte";
      $("#freeShipBar").style.width = Math.max(4, Math.round(sub / free * 100)) + "%";
    }
  }

  /* Vente croisee : deux accessoires disponibles, hors panier. Apres avoir
     accepte un hoodie, un bonnet parait secondaire — c'est la marge. */
  function xsellHTML(){
    var inCart = {};
    cart.forEach(function(it){ inCart[it.id] = true; });
    var list = store.products.filter(function(p){
      return p.active && !inCart[p.id] && !isOut(p) && p.cat === "accessoires";
    });
    if (list.length < 1){
      list = store.products.filter(function(p){
        return p.active && !inCart[p.id] && !isOut(p);
      }).sort(function(a, b){ return a.price - b.price; });
    }
    list = list.slice(0, 2);
    if (!list.length) return "";
    return '<div class="xsell"><h4>Complétez votre tenue</h4>' +
      list.map(function(p){
        return '<div class="xsell-item">' +
          '<img ' + lazyAttrs(p.img) + ' alt="" width="48" height="60" onerror="AURA_IMG(this)" />' +
          '<div><div class="xsell-name">' + esc(marqueDe(p) ? marqueDe(p) + ' ' + p.name : p.name) + '</div>' +
          '<div class="xsell-price">' + fmt(p.price) + '</div></div>' +
          '<button type="button" class="xsell-add" data-openp="' + esc(p.id) + '">Ajouter</button>' +
        '</div>';
      }).join("") + '</div>';
  }

  /* ---------------- Modales, tiroir et gestion du focus ----------------
     Chaque surface qui s'ouvre par-dessus la page doit : mémoriser le
     bouton d'origine, y renvoyer le focus à la fermeture, retenir le focus
     à l'intérieur pendant l'ouverture et se fermer avec la touche Échap. */
  var layers = [];   // pile des surfaces ouvertes
  var lastFocus = null;

  function focusables(el){
    return $$("a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex='-1'])")
      .filter(function(n){ return el.contains(n) && n.offsetParent !== null; });
  }
  /* Verrou de défilement. `overflow:hidden` sur le body ne suffit pas sur
     iOS : seule la mise en `position:fixed` bloque réellement, à condition de
     mémoriser puis restituer la position. */
  var scrollLockY = 0;
  function lockScroll(){
    if (layers.length) return;                 /* déjà verrouillé par une couche */
    scrollLockY = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.position = "fixed";
    document.body.style.top = "-" + scrollLockY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }
  function unlockScroll(){
    if (layers.length) return;                 /* une autre couche reste ouverte */
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollLockY);
  }

  function pushLayer(el, closer){
    if (!layers.length) lastFocus = document.activeElement;
    lockScroll();
    layers.push({ el: el, close: closer });
    el.setAttribute("aria-hidden", "false");
    setTimeout(function(){
      var f = focusables(el);
      if (f.length) f[0].focus();
    }, 50);
  }
  function popLayer(el){
    el.setAttribute("aria-hidden", "true");
    for (var i = layers.length - 1; i >= 0; i--) if (layers[i].el === el) layers.splice(i, 1);
    unlockScroll();
    if (!layers.length && lastFocus && typeof lastFocus.focus === "function"){
      lastFocus.focus();
      lastFocus = null;
    }
  }

  function openCart(){
    renderCart();
    $("#cartDrawer").setAttribute("data-open","true");
    $("#overlay").setAttribute("data-open","true");
    pushLayer($("#cartDrawer"), closeCart);
  }
  function closeCart(){
    $("#cartDrawer").setAttribute("data-open","false");
    $("#overlay").setAttribute("data-open","false");
    popLayer($("#cartDrawer"));
  }
  function openModal(id){
    var el = $("#" + id);
    el.setAttribute("data-open","true");
    pushLayer(el, function(){ closeModal(id); });
  }
  function closeModal(id){
    var el = $("#" + id);
    /* La fiche produit en pleine page n'a pas de modale à refermer : sans ce
       garde-fou, « Ajouter au panier » et « Commander maintenant » levaient
       une exception juste après l'ajout. L'article entrait bien au panier,
       mais ni le tiroir ni la commande ne s'ouvraient — le client n'avait
       aucun retour et ne pouvait pas acheter depuis la fiche. */
    if (!el) return;
    el.setAttribute("data-open","false");
    popLayer(el);
  }

  document.addEventListener("keydown", function(e){
    if (!layers.length) return;
    var top = layers[layers.length - 1];
    if (e.key === "Escape" || e.key === "Esc"){
      e.preventDefault();
      top.close();
      return;
    }
    if (e.key !== "Tab") return;
    var f = focusables(top.el);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    else if (!top.el.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
  });

  /* ---------------- Checkout WhatsApp ---------------- */
  function renderCheckoutSummary(){
    var el = $("#coSummary");
    el.innerHTML =
      '<div class="co-sum">' +
        cart.map(function(it){
          return '<div class="co-item"><span>' + esc(it.brand ? it.brand + ' ' + it.name : it.name) + ' <small>' + (it.variantLabel ? esc(it.variantLabel) + ' · ' : '') + it.qty + ' x</small></span><strong>' + fmt(it.price * it.qty) + '</strong></div>';
        }).join("") +
        '<div class="co-line"><span>Livraison (Bamako)</span><strong>' + (deliveryFor(subtotal()) === 0 ? "Offerte" : fmt(deliveryFor(subtotal()))) + '</strong></div>' +
        '<div class="co-total"><span>Total</span><strong>' + fmt(subtotal() + deliveryFor(subtotal())) + '</strong></div>' +
      '</div>';
  }
  function openCheckout(){
    if (!cart.length){ toast("Votre panier est vide"); return; }
    $("#coStepForm").style.display = "block";
    $("#coStepDone").style.display = "none";
    renderCheckoutSummary();
    openModal("coOverlay");
  }
  function buildWAMessage(o){
    var L = [];
    L.push("🛍️ *Nouvelle commande " + o.ref + "*");
    L.push("");
    o.items.forEach(function(it){
      var lib = it.variantLabel || it.size || "";
      L.push("• " + it.qty + " × " + (it.brand ? it.brand + " " : "") + it.name +
             (lib ? " (" + lib + ")" : "") + " — " + fmt(it.price * it.qty));
    });
    L.push("");
    L.push("🧾 *Sous-total :* " + fmt(o.subtotal));
    L.push("🚚 *Livraison :* " + (o.delivery === 0 ? "Offerte" : fmt(o.delivery)));
    L.push("💰 *Total :* " + fmt(o.total));
    L.push("👤 *Client :* " + o.client + " (" + localPhone(o.phone) + ")");
    L.push("📍 *Livraison :* Bamako, " + o.quartier);
    return L.join("\n");
  }
  function localRef(){
    /* Repli hors ligne : suffixe aléatoire au lieu d'un compteur local,
       sinon deux appareils produisent la même référence le même jour. */
    var d = new Date();
    var stamp = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
    var rnd = "";
    var alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    for (var i = 0; i < 5; i++) rnd += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return "CMD-" + stamp + "-" + rnd;
  }
  function showOrderError(msg){
    $("#errText").textContent = msg;
    openModal("errOverlay");
  }
  function finishOrder(order){
    /* Réservation locale du stock pour que l'affichage reste cohérent
       jusqu'au prochain rechargement du catalogue. */
    order.items.forEach(function(it){
      var p = findProduct(it.id);
      if (p && p.variants && p.variants[it.variant]) p.variants[it.variant].r += it.qty;
    });
    store.orders.unshift(order);
    saveStore(store);

    cart = []; persistCart(); renderCount(); renderCart(); renderGrid();

    var msg = buildWAMessage(order);
    $("#waRef").textContent = order.ref;
    $("#waMsg").value = msg;
    $("#waLink").href = waLink(store.settings.whatsapp, msg);
    $("#coStepForm").style.display = "none";
    $("#coStepDone").style.display = "block";
    $("#waLink").focus();
    toast("Commande " + order.ref + " enregistrée");
  }
  var sending = false;
  function submitOrder(){
    if (sending) return;
    var name = $("#coName").value.trim();
    var phone = digits($("#coPhone").value);
    var quartier = $("#coQuartier").value.trim();
    $("#errName").setAttribute("data-show", name.length < 2 ? "true" : "false");
    $("#errPhone").setAttribute("data-show", phone.length < 8 ? "true" : "false");
    $("#errQuartier").setAttribute("data-show", quartier.length < 2 ? "true" : "false");
    if (name.length < 2 || phone.length < 8 || quartier.length < 2){
      var bad = name.length < 2 ? "#coName" : (phone.length < 8 ? "#coPhone" : "#coQuartier");
      $(bad).focus();
      return;
    }
    if (!cart.length){ toast("Votre panier est vide"); return; }

    var items = [], sub = 0;
    cart.forEach(function(it){
      /* `variantLabel` est figé ici : une commande passée ne relit jamais le
         produit, donc renommer une couleur plus tard ne réécrit pas
         l'historique. `size` reste envoyé pour les commandes déjà en base. */
      items.push({ id: it.id, name: it.name, brand: it.brand || "", variant: it.variant,
                   variantLabel: it.variantLabel, size: it.variantLabel,
                   qty: it.qty, price: it.price });
      sub += it.price * it.qty;
    });

    var btn = $("#coSubmit");
    var draft = { client: name, phone: phone, quartier: quartier, items: items };

    /* Quand Supabase est configuré, la commande est créée par la fonction
       serveur : elle recalcule les montants, vérifie le stock et attribue
       la référence. Le navigateur ne décide plus de rien. */
    if (!LOCAL_DEMO && typeof window.AURA_DB !== "undefined" && window.AURA_DB.ready()){
      sending = true;
      btn.disabled = true;
      btn.textContent = "Envoi en cours…";
      window.AURA_DB.placeOrder(draft, function(er, order){
        sending = false;
        btn.disabled = false;
        btn.textContent = "Commander via WhatsApp";
        if (er || !order){
          showOrderError((er && er.message) ? er.message : "La commande n'a pas pu être enregistrée. Vérifiez votre connexion et réessayez.");
          return;
        }
        finishOrder(order);
      });
      return;
    }

    /* Mode autonome (Supabase désactivé) : tout reste dans le navigateur. */
    var delivery = deliveryFor(sub);
    finishOrder({
      ref: localRef(),
      date: new Date().toISOString(),
      client: name, phone: phone, quartier: quartier,
      items: items, subtotal: sub, delivery: delivery,
      total: sub + delivery, status: "PENDING"
    });
  }

  /* ---------------- Recherche ---------------- */
  function openSearch(){
    $("#soInput").value = ""; curSearch();
    openModal("soOverlay");
    setTimeout(function(){ $("#soInput").focus(); }, 60);
  }
  function curSearch(){
    var q = $("#soInput").value.trim().toLowerCase();
    var list = store.products.filter(function(p){ return p.active; });
    if (q) list = list.filter(function(p){ /* La marque est ce qu'on tape en premier dans une boutique
           multi-marques : « dior » doit trouver les modèles Dior. */
        return p.name.toLowerCase().indexOf(q) >= 0 ||
               (CATS[p.cat]||"").toLowerCase().indexOf(q) >= 0 ||
               marqueDe(p).toLowerCase().indexOf(q) >= 0; });
    var total = list.length;
    list = list.slice(0, 8);
    var el = $("#soRes");
    if (!list.length){ el.innerHTML = '<p class="none-msg" style="margin:0">Aucun résultat.</p>'; return; }
    el.innerHTML = list.map(function(p){
      return '<li><button type="button" data-openp="' + esc(p.id) + '">' +
        '<img class="s-thumb" ' + lazyAttrs(p.img) + ' onerror="AURA_IMG(this)" alt="" />' +
        '<span><span class="s-name" style="display:block">' + esc(p.name) + '</span><span class="s-cat">' + esc([marqueDe(p), CATS[p.cat]||p.cat].filter(Boolean).join(' · ')) + '</span></span>' +
        '<span class="s-price">' + fmt(p.price) + '</span>' +
      '</button></li>';
    }).join("") +
    (q ? '<li><button type="button" data-searchall style="justify-content:center;font-weight:700">Voir les ' + total + ' résultat' + (total > 1 ? "s" : "") + ' dans le catalogue</button></li>' : "");
  }
  /* Applique la recherche à la grille principale et referme la modale. */
  function applySearchToGrid(){
    curQuery = $("#soInput").value.trim();
    curFilter = "tous";
    $$(".tab").forEach(function(x){ x.classList.toggle("active", x.getAttribute("data-filter") === "tous"); });
    renderGrid();
    closeModal("soOverlay");
    var prod = $("#produits");
    window.scrollTo({ top: prod.getBoundingClientRect().top + window.pageYOffset - 70, behavior: "smooth" });
  }

  function legacyCopy(t, done){
    var ta = document.createElement("textarea");
    ta.value = t; ta.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch(e){}
    document.body.removeChild(ta);
    if (ok && done) done();
  }
  function copyWA(){
    var t = $("#waMsg").value;
    var done = function(){ toast("Texte de la commande copié"); };
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(done, function(){ legacyCopy(t, done); });
    } else legacyCopy(t, done);
  }

  /* ---------------- Événements ---------------- */
  document.addEventListener("click", function(e){
    var t = e.target;

    var open = t.closest("[data-openp]");
    if (open){
      var id = open.getAttribute("data-openp");
      if (open.closest("#soOverlay")) closeModal("soOverlay");
      openPV(id);
      return;
    }
    var close = t.closest("[data-close]");
    if (close){ closeModal(close.getAttribute("data-close")); return; }

    if (t.closest("#overlay")){ closeCart(); return; }
    if (t.closest("#cartClose") || t.closest("#cartContinue") || t.closest("#waClose")){ closeCart(); closeModal("coOverlay"); return; }
    if (t.closest("[data-empty-cta]")){ closeCart(); return; }

    if (t.closest("#navCart") || t.closest("[data-od-id='nav-cart']")){ openCart(); return; }
    if (t.closest("[data-od-id='cart-close']")){ closeCart(); return; }

    if (t.closest("#navSearch") || t.closest("[data-od-id='nav-search']")){ openSearch(); return; }

    var thumb = t.closest("#pvThumbs [data-thumb]");
    if (thumb){
      var idx = parseInt(thumb.getAttribute("data-thumb"), 10);
      if (pvImgs[idx]){
        var main = document.querySelector("#pvMedia .pv-main");
        if (main) main.src = mediaUrl(pvImgs[idx]);
        $$("#pvThumbs [data-thumb]").forEach(function(b, i){ b.classList.toggle("active", i === idx); });
      }
      return;
    }

    var sz = t.closest("#pvAxes [data-val]");
    if (sz){
      var axeChoisi = parseInt(sz.getAttribute("data-axe"), 10);
      var valeurChoisie = sz.getAttribute("data-val");
      pvSel[axeChoisi] = valeurChoisie;
      var axeMeta = prodAxes(pvProduct)[axeChoisi];
      if (axeMeta && pvProduct.valueImages && pvProduct.valueImages[axeMeta.name + "::" + valeurChoisie]) pvPhotoChoice = true;
      renderAxes();
      majPhotoPrincipale();
      updateStockLine();
      return;
    }
    if (t.closest("#pvMinus")){ updateQty(-1); return; }
    if (t.closest("#pvPlus")){ updateQty(1); return; }
    if (t.closest("#pvAdd")){
      if (addToCart(pvProduct, pvKey(), pvQty)){
        closeModal("pvOverlay");
        openCart();
      }
      return;
    }
    if (t.closest("#pvBuyNow")){
      if (addToCart(pvProduct, pvKey(), pvQty)){
        closeModal("pvOverlay");
        openCheckout();
      }
      return;
    }

    var qtyBtn = t.closest("[data-qty]");
    if (qtyBtn){
      var itemEl = qtyBtn.closest("[data-key]");
      var key = itemEl.getAttribute("data-key");
      var it = null;
      for (var i=0;i<cart.length;i++) if (cart[i].id + "|" + cart[i].variant === key){ it = cart[i]; break; }
      if (it){
        if (qtyBtn.getAttribute("data-qty") === "inc"){
          var p = findProduct(it.id);
          var a = p ? availFor(p, it.variant) : 0;
          if (it.qty < a){ it.qty += 1; } else toast("Stock disponible limité");
        } else {
          it.qty -= 1;
          if (it.qty <= 0) cart = cart.filter(function(c){ return !(c.id + "|" + c.variant === key); });
        }
        persistCart(); renderCount(); renderCart();
      }
      return;
    }
    if (t.closest("[data-remove]")){
      var itemEl2 = t.closest("[data-key]");
      cart = cart.filter(function(c){ return !(c.id + "|" + c.variant === itemEl2.getAttribute("data-key")); });
      persistCart(); renderCount(); renderCart();
      return;
    }

    if (t.closest("[data-od-id='cart-checkout']") || t.closest("#checkoutBtn")){ openCheckout(); return; }
    if (t.closest("#waCopy")){ copyWA(); return; }
    if (t.closest("#wlSubmit")){ submitWaitlist(); return; }

    var wishBtn = t.closest("[data-wish]");
    if (wishBtn){
      var added = toggleWish(wishBtn.getAttribute("data-wish"));
      wishBtn.setAttribute("data-on", added ? "true" : "false");
      wishBtn.setAttribute("aria-pressed", added ? "true" : "false");
      wishBtn.setAttribute("aria-label", added ? "Retirer des favoris" : "Ajouter aux favoris");
      toast(added ? "Ajouté aux favoris" : "Retiré des favoris");
      return;
    }

    if (t.closest("#buybarAdd")){
      var bAdd = $("#pvAdd");
      if (bAdd && !bAdd.disabled) bAdd.click();
      return;
    }
    var chip = t.closest("[data-taille]");
    if (chip){ setTaille(chip.getAttribute("data-taille")); return; }

    /* Panneau de tri du catalogue. Un critère déjà actif se désactive au
       second clic : sans ça, le client ne trouve plus comment revenir en
       arrière et quitte la page. */
    if (t.closest("#catFiltrer")){ ouvrirPanneau(!panneauOuvert()); return; }
    if (t.closest("[data-fclose]")){ ouvrirPanneau(false); return; }
    var fp = t.closest("[data-fpointure]");
    if (fp){
      var vp = fp.getAttribute("data-fpointure");
      curTaille = (curTaille === vp) ? "" : vp;
      renderGrid(); syncUrl(curFilter); refermerSiPetitEcran(); return;
    }
    var fm = t.closest("[data-fmarque]");
    if (fm){ toggleDansListe(curMarques, fm.getAttribute("data-fmarque")); renderGrid(); syncUrl(curFilter); refermerSiPetitEcran(); return; }
    var fpr = t.closest("[data-fprix]");
    if (fpr){
      var vpr = fpr.getAttribute("data-fprix");
      curPrix = (curPrix === vpr) ? "" : vpr;
      renderGrid(); syncUrl(curFilter); refermerSiPetitEcran(); return;
    }
    if (t.closest("[data-fdispo]")){ curDispo = !curDispo; renderGrid(); syncUrl(curFilter); refermerSiPetitEcran(); return; }
    var ftag = t.closest("[data-ftag]");
    if (ftag){
      var k = ftag.getAttribute("data-ftag"), v = ftag.getAttribute("data-fval");
      if (k === "pointure") curTaille = "";
      else if (k === "marque") toggleDansListe(curMarques, v);
      else if (k === "prix") curPrix = "";
      else if (k === "dispo") curDispo = false;
      renderGrid(); syncUrl(curFilter); return;
    }
    if (t.closest("[data-fclear]")){ effacerFiltres(); return; }
    if (t.closest("[data-searchall]")){ applySearchToGrid(); return; }
    if (t.closest("[data-reset-filters]")){ setFilter("tous"); return; }

    /* Les liens de catégorie mènent au catalogue. Si la grille est déjà sur
       la page, on filtre sur place — plus rapide et la position de lecture
       est conservée. Sinon on laisse le navigateur suivre le lien : c'est ce
       qui rend le bouton « retour » et l'ouverture en nouvel onglet fiables. */
    var goto = t.closest("[data-goto]");
    if (goto && $("#produits")){
      e.preventDefault();
      /* « Tout voir » quitte aussi la marque ouverte. */
      if (curColl && goto.getAttribute("data-goto") === "tous") setCollection("");
      goTo(goto.getAttribute("data-goto"));
      return;
    }
  });

  document.addEventListener("input", function(e){
    if (e.target === $("#soInput")) curSearch();
  });
  document.addEventListener("change", function(e){
    var tri = e.target.closest ? e.target.closest("#catTri") : null;
    if (!tri) return;
    curTri = tri.value || "defaut";
    renderGrid();
    syncUrl(curFilter);
  });
  $("#soInput").addEventListener("keydown", function(e){
    if (e.key === "Enter"){ e.preventDefault(); if (this.value.trim()) applySearchToGrid(); }
  });

  /* Delegation : les onglets sont reconstruits a chaque changement de
     categories, un ecouteur pose sur chaque bouton serait perdu. */
  var tabsHost = $("#filterTabs");
  if (tabsHost) tabsHost.addEventListener("click", function(e){
    var tb = e.target.closest(".tab");
    if (!tb) return;
    setFilter(tb.getAttribute("data-filter"));
    var prod = $("#produits");
    window.scrollTo({ top: prod.getBoundingClientRect().top + window.pageYOffset - 70, behavior: "smooth" });
  });

  var coForm = $("#coForm");
  coForm.addEventListener("submit", function(e){
    e.preventDefault();
    submitOrder();
  });

  var burger = $("#navBurger");
  if (burger) burger.addEventListener("click", function(){
    var m = $("#mobileMenu");
    var open = m.getAttribute("data-open") !== "true";
    m.setAttribute("data-open", open ? "true" : "false");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });
  var mobileMenu = $("#mobileMenu");
  if (mobileMenu) mobileMenu.addEventListener("click", function(e){
    if (!e.target.closest("a")) return;
    mobileMenu.setAttribute("data-open","false");
    if (burger){ burger.setAttribute("aria-expanded","false"); burger.setAttribute("aria-label","Ouvrir le menu"); }
  });

  /* ---------------- Newsletter ----------------
     L'adresse est réellement enregistrée : en base quand Supabase est
     configuré, dans le navigateur sinon (l'admin peut alors l'exporter). */
  var NKEY = "aura_news_v1";
  var newsForm = $("#newsForm");
  /* Le bloc peut être masqué par le commerçant : sans ce garde-fou, tout le
     script s'arrête ici et la page devient inerte. */
  if (newsForm) newsForm.addEventListener("submit", function(e){
    e.preventDefault();
    var input = $("#newsEmail");
    var email = input.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){ toast("Adresse e-mail invalide"); input.focus(); return; }

    function done(){
      newsForm.setAttribute("data-hidden","true");
      $("[data-od-id='newsletter-success']").setAttribute("data-visible","true");
    }
    function keepLocally(){
      try {
        var list = JSON.parse(localStorage.getItem(NKEY) || "[]");
        if (list.indexOf(email) < 0) list.push(email);
        localStorage.setItem(NKEY, JSON.stringify(list));
      } catch(err){}
    }

    var btn = newsForm.querySelector("button[type='submit']");
    if (typeof window.AURA_DB !== "undefined" && window.AURA_DB.ready()){
      btn.disabled = true;
      window.AURA_DB.subscribe(email, function(er){
        btn.disabled = false;
        if (er){
          keepLocally();
          toast("Inscription enregistrée hors ligne");
        }
        done();
      });
    } else {
      keepLocally();
      done();
    }
  });

  /* Apparition progressive des sections. Un observateur plutôt qu'un
     écouteur de défilement : le navigateur fait le calcul lui-même, sans
     réveiller le script à chaque pixel — ce qui compte sur les téléphones
     modestes visés ici. Les navigateurs sans `IntersectionObserver`
     n'animent rien et voient le site tel quel : aucune dégradation. */
  function animerApparitions(){
    /* Les cartes, marques et bandeaux sont fabriqués par le script : au
       premier passage ils n'existent pas encore. Cette fonction est donc
       rappelée après chaque rendu, et ne reprend que les éléments qu'elle
       n'a pas déjà traités. */
    var cibles = $$(".pcard, .cat-card, .mband, .brand-directory-card, .catalogue-gateway, .trust-item, .pillar")
      .filter(function(el){ return !el.hasAttribute("data-reveal"); });
    if (!cibles.length) return;

    function montrer(el){
      el.setAttribute("data-seen", "true");
      el.style.opacity = "";
      el.style.transform = "";
    }
    function masquer(el){
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
    }

    /* Filet de sécurité : quoi qu'il arrive — observateur absent, section
       plus haute que prévu, navigateur exotique — tout devient visible au
       bout de deux secondes. Une animation ratée doit coûter un effet, pas
       le contenu de la page. */
    function toutMontrer(){ cibles.forEach(montrer); }
    setTimeout(toutMontrer, 2000);

    if (!("IntersectionObserver" in window)){ toutMontrer(); return; }

    var obs = new IntersectionObserver(function(entrees){
      entrees.forEach(function(e){
        if (!e.isIntersecting) return;
        montrer(e.target);
        obs.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px" });

    cibles.forEach(function(el, i){
      el.setAttribute("data-reveal", "");
      /* Ce qui est déjà à l'écran ne s'anime pas : la page paraîtrait vide
         une fraction de seconde au chargement. */
      if (el.getBoundingClientRect().top < window.innerHeight){ montrer(el); return; }
      masquer(el);
      /* Décalage court entre voisins : la grille se pose au lieu de
         surgir d'un bloc. Plafonné, sinon la dernière carte d'une longue
         rangée attendrait une demi-seconde. */
      el.style.transitionDelay = Math.min(i % 4, 3) * 45 + "ms";
      obs.observe(el);
    });
  }

  /* Pulsation du compteur quand le panier change : sans elle, un ajout
     depuis une carte ne se voit nulle part sur la page. */
  var dernierCompte = -1;
  function pulserPanier(){
    var el = $("#cartCount");
    if (!el) return;
    var n = count();
    if (dernierCompte >= 0 && n > dernierCompte){
      el.setAttribute("data-bump", "true");
      setTimeout(function(){ el.removeAttribute("data-bump"); }, 360);
    }
    dernierCompte = n;
  }

  renderGrid();
  observeLazy(document);
  animerApparitions();
  reconcileCart();
  renderCount();
  renderCart();
  hydrate();
})();
