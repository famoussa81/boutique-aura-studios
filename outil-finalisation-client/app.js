(function () {
  "use strict";

  const DB_NAME = "dossier-boutique-local";
  const DB_VERSION = 1;
  const tokenFromQuery = new URLSearchParams(location.search).get("d") || "";
  const tokenFromUrl = ((location.hash || "").slice(1).trim() || tokenFromQuery.trim());
  const rememberedToken = (() => { try { return sessionStorage.getItem("aura_intake_token") || ""; } catch (_) { return ""; } })();
  const INTAKE_TOKEN = tokenFromUrl || rememberedToken;
  if (tokenFromUrl) { try { sessionStorage.setItem("aura_intake_token", tokenFromUrl); } catch (_) {} }
  const STATE_KEY = "client-dossier-" + (INTAKE_TOKEN || "invalide");
  const VSEP = "::";
  const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const STEPS = [
    { key: "identity", label: "Identité" },
    { key: "contact", label: "Coordonnées" },
    { key: "hours", label: "Horaires" },
    { key: "delivery", label: "Livraison" },
    { key: "payments", label: "Paiements" },
    { key: "catalogue", label: "Catalogue" },
    { key: "stocks", label: "Stocks" },
    { key: "visuals", label: "Visuels" },
    { key: "legal", label: "Informations légales" },
    { key: "validation", label: "Validation" }
  ];

  let db;
  let state;
  let saveTimer;
  let savePromise = Promise.resolve();
  let toastTimer;
  let remoteInfo = null;
  let submitted = false;

  const formRegion = document.getElementById("formRegion");
  const stepNav = document.getElementById("stepNav");
  const progressRail = document.getElementById("progressRail");
  const saveIndicator = document.getElementById("saveIndicator");
  const toast = document.getElementById("toast");
  const helpDialog = document.getElementById("helpDialog");
  const importInput = document.getElementById("importInput");
  window.addEventListener("hashchange", () => location.reload());

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function slug(value) {
    return String(value || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "element";
  }

  function money(value) {
    return new Intl.NumberFormat("fr-FR").format(Number(value || 0)) + " FCFA";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  async function api(action, data, file, category) {
    const config = window.AURA_SUPA || {};
    if (!config.enabled || !config.url || !config.anonKey) throw new Error("Service indisponible");
    const headers = { apikey: config.anonKey, Authorization: "Bearer " + config.anonKey, "x-intake-token": INTAKE_TOKEN };
    let body;
    if (file) { body = new FormData(); body.append("file", file); body.append("category", category || "autre"); }
    else { headers["Content-Type"] = "application/json"; body = JSON.stringify({ action, ...(data || {}) }); }
    const response = await fetch(config.url.replace(/\/+$/, "") + "/functions/v1/client-intake", { method: "POST", headers, body });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "La demande a échoué");
    return result;
  }

  function getSeedCatalogue() {
    try {
      if (!window.AURA_CATALOG) return { products: [], brands: [], categories: [], brandSources: [] };
      const seeded = window.AURA_CATALOG.seed();
      const settings = window.AURA_CATALOG.settings();
      const brandMap = {};
      (settings.collections || []).forEach((item) => { brandMap[item.key] = item.label; });
      const categoryMap = {};
      (window.AURA_CATALOG.CATEGORIES || []).forEach((item) => { categoryMap[item.key] = item.label; });
      const products = (seeded.products || []).map((product) => {
        const axes = Array.isArray(product.axes) ? clone(product.axes) : [];
        const sourceVariants = product.variants || product.sizes || { "": { s: 0, r: 0 } };
        const variants = Object.keys(sourceVariants).map((variantKey) => {
          const parts = variantKey ? variantKey.split(VSEP) : [];
          return {
            key: variantKey,
            label: parts.length ? parts.join(" · ") : "Stock général",
            stock: 0
          };
        });
        return {
          id: product.id || slug(product.name),
          name: product.name || "",
          brand: brandMap[product.collection] || product.collection || "",
          category: categoryMap[product.cat] || product.cat || "",
          price: Number(product.price || 0),
          oldPrice: Number(product.oldPrice || 0),
          description: product.desc || "",
          image: product.img || "",
          images: clone(product.imgs || []),
          valueImages: clone(product.valueImages || {}),
          active: product.active !== false,
          axes,
          variants: variants.length ? variants : [{ key: "", label: "Stock général", stock: 0 }]
        };
      });
      const brandSources = (settings.collections || []).map((item) => ({
        key: item.key,
        label: item.label,
        logo: item.logo || "",
        home: item.homeCover || item.cover || "",
        page: item.pageCover || item.cover || "",
        homeMobile: item.homeCoverMobile || "",
        pageMobile: item.pageCoverMobile || ""
      }));
      return {
        products,
        brands: Array.from(new Set(products.map((p) => p.brand).filter(Boolean))),
        categories: Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
        brandSources
      };
    } catch (error) {
      console.warn("Catalogue source indisponible", error);
      return { products: [], brands: [], categories: [], brandSources: [] };
    }
  }

  function defaultHours() {
    return DAYS.map((day, index) => ({
      day,
      open: index < 6,
      openHour: index === 5 ? "10" : "09",
      openMinute: "00",
      closeHour: index === 5 ? "18" : "19",
      closeMinute: "00"
    }));
  }

  function createDefaultState() {
    const seed = getSeedCatalogue();
    return {
      version: 1,
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStep: 0,
        selectedStockProduct: seed.products[0] ? seed.products[0].id : ""
      },
      identity: {
        storeName: "",
        slogan: "",
        shortDescription: "",
        about: "",
        announcement: "",
        targetCustomers: "",
        yearsActive: "",
        storeType: "independent-multibrand",
        authenticityClaim: "",
        domainWanted: "",
        seoDescription: ""
      },
      contact: {
        ownerName: "",
        contactRole: "Propriétaire",
        whatsapp: "",
        phone: "",
        email: "",
        adminEmail: "",
        address: "",
        district: "",
        city: "Bamako",
        mapLink: "",
        instagram: "",
        facebook: "",
        tiktok: "",
        snapchat: ""
      },
      hours: { days: defaultHours(), exceptions: [], notes: "", confirmed: false },
      delivery: {
        homeDelivery: true,
        pickup: false,
        otherCities: false,
        freeThreshold: "",
        zones: [{ name: "Bamako", fee: "", delay: "24 à 48 heures" }],
        pickupAddress: "",
        orderCutoff: "",
        instructions: "",
        returnsDelay: "",
        exchangeConditions: "",
        confirmed: false
      },
      payments: {
        methods: { cashDelivery: true, cashPickup: false, orangeMoney: false, moovMoney: false, bankTransfer: false },
        orangeNumber: "",
        moovNumber: "",
        accountName: "",
        depositRequired: false,
        depositAmount: "",
        cancellationPolicy: "",
        refundPolicy: "",
        confirmed: false
      },
      catalogue: {
        currency: "FCFA",
        brands: seed.brands,
        categories: seed.categories,
        products: seed.products,
        pricesConfirmed: false,
        productsConfirmed: false,
        notes: ""
      },
      stocks: {
        confirmed: false,
        trackingMethod: "par-variante",
        lowStockThreshold: 2,
        notes: ""
      },
      visuals: {
        logoStatus: "",
        brandUsageConfirmed: false,
        photoUsageConfirmed: false,
        notes: "",
        files: {},
        activeTab: "brands",
        selectedBrand: seed.brands[0] || "",
        selectedProduct: seed.products[0] ? seed.products[0].id : "",
        selectedColor: "",
        brandSources: seed.brandSources,
        brandMedia: {},
        productMedia: {}
      },
      legal: {
        legalName: "",
        legalForm: "",
        representative: "",
        legalAddress: "",
        rccm: "",
        nif: "",
        legalEmail: "",
        warranty: "",
        privacyContact: "",
        informationConfirmed: false
      },
      validation: {
        catalogueApproved: false,
        policiesApproved: false,
        publicationApproved: false,
        ownerAccessEmail: "",
        finalNotes: ""
      }
    };
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains("records")) database.createObjectStore("records");
        if (!database.objectStoreNames.contains("files")) database.createObjectStore("files", { keyPath: "key" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function dbGet(store, key) {
    return new Promise((resolve, reject) => {
      const request = db.transaction(store, "readonly").objectStore(store).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function dbPut(store, value, key) {
    return new Promise((resolve, reject) => {
      const target = db.transaction(store, "readwrite").objectStore(store);
      const request = key === undefined ? target.put(value) : target.put(value, key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function dbDelete(store, key) {
    return new Promise((resolve, reject) => {
      const request = db.transaction(store, "readwrite").objectStore(store).delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  function dbAll(store) {
    return new Promise((resolve, reject) => {
      const request = db.transaction(store, "readonly").objectStore(store).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  function mergeDefaults(defaults, saved) {
    if (!saved || typeof saved !== "object") return defaults;
    if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
    const result = { ...defaults };
    Object.keys(saved).forEach((key) => {
      if (saved[key] && typeof saved[key] === "object" && !Array.isArray(saved[key]) && defaults[key] && typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
        result[key] = mergeDefaults(defaults[key], saved[key]);
      } else {
        result[key] = saved[key];
      }
    });
    return result;
  }

  function setSaving(saving) {
    saveIndicator.classList.toggle("is-saving", saving);
    saveIndicator.querySelector("span:last-child").textContent = saving ? "Enregistrement…" : "Sauvegardé en ligne";
    saveIndicator.querySelector("span:first-child").textContent = saving ? "•" : "✓";
  }

  function scheduleSave() {
    setSaving(true);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 650);
  }

  function saveNow() {
    savePromise = savePromise.catch(() => {}).then(persistNow);
    return savePromise;
  }

  async function persistNow() {
    state.meta.updatedAt = new Date().toISOString();
    try {
      await dbPut("records", state, STATE_KEY);
      if (!submitted) await api("save", { data: state, currentStep: state.meta.currentStep });
      setSaving(false);
      renderNav();
      renderProgress();
    } catch (error) {
      console.error(error);
      setSaving(false);
      saveIndicator.querySelector("span:last-child").textContent = "Hors connexion — gardé sur ce téléphone";
      notify("Internet est indisponible. Vos réponses restent gardées sur ce téléphone et seront renvoyées au prochain changement.");
    }
  }

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
  }

  function getPath(path) {
    return path.split(".").reduce((value, part) => value == null ? undefined : value[part], state);
  }

  function setPath(path, value) {
    const parts = path.split(".");
    const last = parts.pop();
    let target = state;
    parts.forEach((part) => {
      if (!target[part] || typeof target[part] !== "object") target[part] = {};
      target = target[part];
    });
    target[last] = value;
  }

  function isFilled(value) {
    return String(value == null ? "" : value).trim().length > 0;
  }

  function stepComplete(index) {
    switch (index) {
      case 0: return isFilled(state.identity.storeName) && isFilled(state.identity.shortDescription);
      case 1: return isFilled(state.contact.ownerName) && isFilled(state.contact.whatsapp) && isFilled(state.contact.address);
      case 2: return state.hours.confirmed;
      case 3: return state.delivery.confirmed && ((state.delivery.homeDelivery && state.delivery.zones.some((zone) => isFilled(zone.name) && isFilled(zone.fee))) || (state.delivery.pickup && isFilled(state.delivery.pickupAddress)));
      case 4: return state.payments.confirmed && Object.values(state.payments.methods).some(Boolean);
      case 5: return state.catalogue.products.length > 0 && state.catalogue.productsConfirmed && state.catalogue.pricesConfirmed;
      case 6: return state.stocks.confirmed;
      case 7: return isFilled(state.visuals.logoStatus) && state.visuals.photoUsageConfirmed;
      case 8: return isFilled(state.legal.legalName) && isFilled(state.legal.legalAddress) && state.legal.informationConfirmed;
      case 9: return state.validation.catalogueApproved && state.validation.policiesApproved && state.validation.publicationApproved;
      default: return false;
    }
  }

  function completionCount() {
    return STEPS.reduce((sum, _step, index) => sum + (stepComplete(index) ? 1 : 0), 0);
  }

  function renderNav() {
    stepNav.innerHTML = STEPS.map((step, index) => {
      const current = state.meta.currentStep === index;
      const complete = stepComplete(index);
      return `<button type="button" class="step-link${complete ? " is-complete" : ""}" data-action="step" data-index="${index}" ${current ? 'aria-current="step"' : ""}>
        <span class="step-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="step-label">${esc(step.label)}</span>
        <span class="step-state" aria-label="${complete ? "Étape complétée" : current ? "Étape en cours" : "Étape à remplir"}">${complete ? "✓" : current ? "›" : ""}</span>
      </button>`;
    }).join("");
  }

  function renderProgress() {
    const complete = completionCount();
    progressRail.innerHTML = `
      <div class="progress-kicker">Progression</div>
      <div class="progress-number"><strong>${complete}</strong> sur 10</div>
      <div class="progress-track"><div class="progress-fill" style="width:${complete * 10}%"></div></div>
      <div class="summary-title">Récapitulatif</div>
      <div class="summary-steps">
        ${STEPS.map((step, index) => {
          const current = state.meta.currentStep === index;
          const done = stepComplete(index);
          return `<div class="summary-step${done ? " complete" : ""}${current ? " current" : ""}">
            <span class="summary-dot">${done ? "✓" : current ? String(index + 1).padStart(2, "0") : ""}</span>
            <span class="num">${String(index + 1).padStart(2, "0")}</span>
            <span><strong>${esc(step.label)}</strong><small>${done ? "Complété" : current ? "En cours" : "À remplir"}</small></span>
          </div>`;
        }).join("")}
      </div>`;
  }

  function field(path, label, options) {
    const opts = options || {};
    const value = getPath(path);
    const full = opts.full ? " full" : "";
    const required = opts.required ? " required" : "";
    const hint = opts.hint ? `<span class="hint">${esc(opts.hint)}</span>` : "";
    if (opts.type === "textarea") {
      return `<div class="field${full}"><label class="${required}" for="${slug(path)}">${esc(label)}</label><textarea class="textarea" id="${slug(path)}" data-bind="${esc(path)}" placeholder="${esc(opts.placeholder || "")}" maxlength="${opts.maxlength || 600}">${esc(value)}</textarea>${hint}</div>`;
    }
    if (opts.type === "select") {
      return `<div class="field${full}"><label class="${required}" for="${slug(path)}">${esc(label)}</label><select class="select" id="${slug(path)}" data-bind="${esc(path)}">${(opts.choices || []).map((choice) => `<option value="${esc(choice.value)}" ${String(value) === String(choice.value) ? "selected" : ""}>${esc(choice.label)}</option>`).join("")}</select>${hint}</div>`;
    }
    return `<div class="field${full}"><label class="${required}" for="${slug(path)}">${esc(label)}</label><input class="input" id="${slug(path)}" data-bind="${esc(path)}" type="${esc(opts.type || "text")}" value="${esc(value)}" placeholder="${esc(opts.placeholder || "")}" ${opts.inputmode ? `inputmode="${esc(opts.inputmode)}"` : ""} ${opts.min != null ? `min="${esc(opts.min)}"` : ""} ${opts.max != null ? `max="${esc(opts.max)}"` : ""} maxlength="${opts.maxlength || 180}">${hint}</div>`;
  }

  function checkbox(path, title, note) {
    const checked = !!getPath(path);
    return `<label class="choice"><input type="checkbox" data-bind="${esc(path)}" ${checked ? "checked" : ""}><span><strong>${esc(title)}</strong>${note ? `<small>${esc(note)}</small>` : ""}</span></label>`;
  }

  function sectionHead(title, text) {
    return `<div class="section-head"><h2>${esc(title)}</h2><p>${esc(text)}</p></div>`;
  }

  function renderIdentity() {
    return `${sectionHead("Identité de la boutique", "Définissons exactement ce que le client verra : le bon nom, les bons mots et les promesses que le commerçant peut réellement tenir.")}
      <div class="form-section">
        <h3>Nom et présentation</h3><p>Ces textes apparaîtront dans l’en-tête, les pages et les résultats de recherche.</p>
        <div class="form-grid">
          ${field("identity.storeName", "Nom exact de la boutique", { required: true, placeholder: "Ex. T&K SHOES" })}
          ${field("identity.slogan", "Slogan", { placeholder: "Ex. Les modèles qui comptent" })}
          ${field("identity.shortDescription", "Description courte", { required: true, full: true, type: "textarea", maxlength: 220, placeholder: "En deux phrases : que vend la boutique et pourquoi acheter ici ?" })}
          ${field("identity.about", "Histoire de la boutique", { full: true, type: "textarea", placeholder: "Depuis quand existe-t-elle ? Comment choisit-elle ses produits ?" })}
        </div>
      </div>
      <div class="form-section">
        <h3>Positionnement et messages</h3><p>On ne publiera aucune promesse non confirmée.</p>
        <div class="form-grid">
          ${field("identity.storeType", "Type de boutique", { type: "select", choices: [
            { value: "independent-multibrand", label: "Revendeur multimarques indépendant" },
            { value: "single-brand", label: "Boutique d’une seule marque" },
            { value: "other", label: "Autre" }
          ] })}
          ${field("identity.yearsActive", "Année de création", { type: "number", min: 1950, max: 2100, placeholder: "2020" })}
          ${field("identity.targetCustomers", "Clientèle principale", { placeholder: "Hommes, femmes, jeunes actifs…" })}
          ${field("identity.authenticityClaim", "Que peut-on affirmer sur l’authenticité ?", { placeholder: "Uniquement ce que le commerçant peut prouver" })}
          ${field("identity.announcement", "Message du bandeau supérieur", { full: true, placeholder: "Ex. Livraison à Bamako en 24 à 48 h" })}
          ${field("identity.domainWanted", "Nom de domaine souhaité", { placeholder: "exemple.com" })}
          ${field("identity.seoDescription", "Description Google", { full: true, type: "textarea", maxlength: 160, placeholder: "Une phrase de moins de 160 caractères" })}
        </div>
      </div>`;
  }

  function renderContact() {
    return `${sectionHead("Coordonnées et propriété", "Rassemblons les contacts visibles sur le site et les adresses qui permettront au commerçant de devenir réellement propriétaire de ses outils.")}
      <div class="form-section">
        <h3>Contact principal</h3><p>Le numéro WhatsApp sera utilisé pour recevoir les commandes.</p>
        <div class="form-grid">
          ${field("contact.ownerName", "Nom et prénom du responsable", { required: true, placeholder: "Nom complet" })}
          ${field("contact.contactRole", "Fonction", { placeholder: "Propriétaire, gérant…" })}
          ${field("contact.whatsapp", "Numéro WhatsApp commandes", { required: true, type: "tel", inputmode: "tel", placeholder: "+223 00 00 00 00" })}
          ${field("contact.phone", "Autre numéro d’appel", { type: "tel", inputmode: "tel", placeholder: "+223 00 00 00 00" })}
          ${field("contact.email", "E-mail public", { type: "email", placeholder: "contact@boutique.com" })}
          ${field("contact.adminEmail", "E-mail propriétaire des comptes", { type: "email", hint: "Servira pour Vercel, Supabase, GitHub et l’administration. Ne demandez jamais son mot de passe." })}
        </div>
      </div>
      <div class="form-section">
        <h3>Adresse et réseaux</h3><p>Indiquez l’adresse comme un client de Bamako la comprend réellement.</p>
        <div class="form-grid">
          ${field("contact.address", "Adresse ou point de repère", { required: true, full: true, placeholder: "Quartier, rue, près de…" })}
          ${field("contact.district", "Quartier", { placeholder: "Ex. ACI 2000" })}
          ${field("contact.city", "Ville", { placeholder: "Bamako" })}
          ${field("contact.mapLink", "Lien Google Maps", { type: "url", placeholder: "https://maps.google.com/…" })}
          ${field("contact.instagram", "Instagram", { placeholder: "@compte" })}
          ${field("contact.facebook", "Facebook", { placeholder: "Nom ou lien de la page" })}
          ${field("contact.tiktok", "TikTok", { placeholder: "@compte" })}
          ${field("contact.snapchat", "Snapchat", { placeholder: "Nom du compte" })}
        </div>
      </div>`;
  }

  function hourOptions(selected) {
    return Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0")).map((hour) => `<option value="${hour}" ${hour === selected ? "selected" : ""}>${hour}</option>`).join("");
  }

  function minuteOptions(selected) {
    return ["00", "15", "30", "45"].map((minute) => `<option value="${minute}" ${minute === selected ? "selected" : ""}>${minute}</option>`).join("");
  }

  function renderHours() {
    return `${sectionHead("Horaires d’ouverture", "Sélectionnez les heures et les minutes. Aucun horaire n’a besoin d’être tapé à la main.")}
      <div class="form-section">
        <div class="hours-table">
          <div class="hours-head"><span>Jour</span><span>Statut</span><span>Ouverture</span><span>Fermeture</span></div>
          ${state.hours.days.map((item, index) => `<div class="hours-row${item.open ? "" : " is-closed"}">
            <span class="day-name">${esc(item.day)}</span>
            <span class="open-status"><label class="switch"><input type="checkbox" data-hour-index="${index}" data-hour-field="open" ${item.open ? "checked" : ""}><span class="switch-track"></span></label><span>${item.open ? "Ouvert" : "Fermé"}</span></span>
            <span class="time-fields" data-label="Ouvre"><select class="select" aria-label="Heure d’ouverture ${esc(item.day)}" data-hour-index="${index}" data-hour-field="openHour">${hourOptions(item.openHour)}</select><span>:</span><select class="select" aria-label="Minutes d’ouverture ${esc(item.day)}" data-hour-index="${index}" data-hour-field="openMinute">${minuteOptions(item.openMinute)}</select></span>
            <span class="time-fields" data-label="Ferme"><select class="select" aria-label="Heure de fermeture ${esc(item.day)}" data-hour-index="${index}" data-hour-field="closeHour">${hourOptions(item.closeHour)}</select><span>:</span><select class="select" aria-label="Minutes de fermeture ${esc(item.day)}" data-hour-index="${index}" data-hour-field="closeMinute">${minuteOptions(item.closeMinute)}</select></span>
          </div>`).join("")}
        </div>
      </div>
      <div class="form-section">
        <h3>Exceptions</h3><p>Jours fériés, fermetures particulières ou horaires différents.</p>
        <div class="repeat-list">
          ${state.hours.exceptions.length ? state.hours.exceptions.map((item, index) => `<div class="repeat-row">
            <div class="field"><label>Date</label><input class="input" type="date" data-array="hours.exceptions" data-index="${index}" data-field="date" value="${esc(item.date || "")}"></div>
            <div class="field"><label>Statut</label><select class="select" data-array="hours.exceptions" data-index="${index}" data-field="status"><option value="closed" ${item.status === "closed" ? "selected" : ""}>Fermé</option><option value="special" ${item.status === "special" ? "selected" : ""}>Horaire spécial</option></select></div>
            <div class="field"><label>Précision</label><input class="input" data-array="hours.exceptions" data-index="${index}" data-field="note" value="${esc(item.note || "")}" placeholder="Ex. Ouvert de 10 h à 16 h"></div>
            <button class="icon-button" type="button" data-action="remove-exception" data-index="${index}" aria-label="Supprimer">×</button>
          </div>`).join("") : `<div class="empty-state">Aucune exception ajoutée.</div>`}
        </div>
        <button class="button button-quiet button-small add-row" type="button" data-action="add-exception">+ Ajouter une exception</button>
        <div class="form-grid" style="margin-top:22px">${field("hours.notes", "Précisions sur les horaires", { full: true, type: "textarea", placeholder: "Pause, horaires Ramadan, rendez-vous…" })}<label class="choice full"><input type="checkbox" data-bind="hours.confirmed" ${state.hours.confirmed ? "checked" : ""}><span><strong>Horaires confirmés avec le commerçant</strong><small>Les heures affichées ci-dessus sont réelles</small></span></label></div>
      </div>`;
  }

  function renderDelivery() {
    return `${sectionHead("Livraison, retrait et échanges", "Décrivons ce qui se passe réellement après une commande : où, combien, quand et selon quelles conditions.")}
      <div class="form-section">
        <h3>Modes de remise</h3><p>Cochez uniquement ce que la boutique peut assurer.</p>
        <div class="choice-grid">
          ${checkbox("delivery.homeDelivery", "Livraison à domicile", "Le client reçoit sa commande à l’adresse indiquée")}
          ${checkbox("delivery.pickup", "Retrait en boutique", "Le client vient chercher sa commande")}
          ${checkbox("delivery.otherCities", "Livraison hors de Bamako", "Expédition vers d’autres villes")}
        </div>
      </div>
      <div class="form-section">
        <h3>Zones et tarifs</h3><p>Ajoutez une ligne par zone. Écrivez « 0 » si la livraison est gratuite.</p>
        <div class="repeat-list">
          ${state.delivery.zones.map((zone, index) => `<div class="repeat-row">
            <div class="field"><label>Zone</label><input class="input" data-array="delivery.zones" data-index="${index}" data-field="name" value="${esc(zone.name)}" placeholder="Ex. Bamako centre"></div>
            <div class="field"><label>Frais en FCFA</label><input class="input" type="number" min="0" inputmode="numeric" data-array="delivery.zones" data-index="${index}" data-field="fee" value="${esc(zone.fee)}" placeholder="2000"></div>
            <div class="field"><label>Délai réaliste</label><input class="input" data-array="delivery.zones" data-index="${index}" data-field="delay" value="${esc(zone.delay)}" placeholder="24 à 48 heures"></div>
            <button class="icon-button" type="button" data-action="remove-zone" data-index="${index}" aria-label="Supprimer">×</button>
          </div>`).join("")}
        </div>
        <button class="button button-quiet button-small add-row" type="button" data-action="add-zone">+ Ajouter une zone</button>
      </div>
      <div class="form-section">
        <h3>Règles pratiques</h3><p>Ces réponses serviront aux messages du site et aux conditions de vente.</p>
        <div class="form-grid">
          ${field("delivery.freeThreshold", "Livraison gratuite à partir de", { type: "number", min: 0, inputmode: "numeric", placeholder: "40000" })}
          ${field("delivery.orderCutoff", "Heure limite pour livrer le jour même", { type: "time" })}
          ${field("delivery.pickupAddress", "Adresse de retrait", { full: true, placeholder: "Si le retrait en boutique est possible" })}
          ${field("delivery.returnsDelay", "Délai pour demander un échange", { placeholder: "Ex. 48 heures après réception" })}
          ${field("delivery.exchangeConditions", "Conditions d’échange", { full: true, type: "textarea", placeholder: "Produit non porté, emballage conservé…" })}
          ${field("delivery.instructions", "Instructions de livraison", { full: true, type: "textarea", placeholder: "Appel avant déplacement, zones non desservies…" })}
          <label class="choice full"><input type="checkbox" data-bind="delivery.confirmed" ${state.delivery.confirmed ? "checked" : ""}><span><strong>Tarifs et délais confirmés</strong><small>Les zones, frais et délais sont ceux réellement pratiqués</small></span></label>
        </div>
      </div>`;
  }

  function renderPayments() {
    return `${sectionHead("Paiements et annulations", "Sélectionnez les méthodes réellement acceptées et indiquez les règles sans ambiguïté.")}
      <div class="form-section">
        <h3>Moyens de paiement</h3><p>Plusieurs choix sont possibles.</p>
        <div class="choice-grid">
          ${checkbox("payments.methods.cashDelivery", "Espèces à la livraison", "Paiement au livreur après réception")}
          ${checkbox("payments.methods.cashPickup", "Espèces en boutique", "Paiement au moment du retrait")}
          ${checkbox("payments.methods.orangeMoney", "Orange Money", "Paiement ou acompte par téléphone")}
          ${checkbox("payments.methods.moovMoney", "Moov Money", "Paiement ou acompte par téléphone")}
          ${checkbox("payments.methods.bankTransfer", "Virement bancaire", "Sur coordonnées transmises au client")}
        </div>
      </div>
      <div class="form-section">
        <h3>Coordonnées et règles</h3><p>Ces numéros ne seront affichés que si la méthode correspondante est retenue.</p>
        <div class="form-grid">
          ${field("payments.orangeNumber", "Numéro Orange Money", { type: "tel", inputmode: "tel", placeholder: "+223…" })}
          ${field("payments.moovNumber", "Numéro Moov Money", { type: "tel", inputmode: "tel", placeholder: "+223…" })}
          ${field("payments.accountName", "Nom du titulaire", { placeholder: "Nom affiché au moment du paiement" })}
          <div class="field"><span class="field-label">Acompte obligatoire ?</span><label class="choice"><input type="checkbox" data-bind="payments.depositRequired" ${state.payments.depositRequired ? "checked" : ""}><span><strong>${state.payments.depositRequired ? "Oui" : "Non"}</strong><small>Avant préparation ou livraison</small></span></label></div>
          ${field("payments.depositAmount", "Montant ou pourcentage de l’acompte", { placeholder: "Ex. 5 000 FCFA ou 30 %" })}
          ${field("payments.cancellationPolicy", "Règle d’annulation", { full: true, type: "textarea", placeholder: "Jusqu’à quel moment le client peut-il annuler ?" })}
          ${field("payments.refundPolicy", "Règle de remboursement", { full: true, type: "textarea", placeholder: "Dans quels cas et sous quel délai ?" })}
          <label class="choice full"><input type="checkbox" data-bind="payments.confirmed" ${state.payments.confirmed ? "checked" : ""}><span><strong>Moyens de paiement confirmés</strong><small>Les numéros et les règles ont été vérifiés avec le commerçant</small></span></label>
        </div>
      </div>`;
  }

  function renderTagEditor(kind, title, values) {
    return `<div class="field full"><label>${esc(title)}</label><div class="repeat-list">${values.map((value, index) => `<div class="repeat-row variant-row"><input class="input" data-tag-kind="${kind}" data-index="${index}" value="${esc(value)}"><span></span><button class="icon-button" type="button" data-action="remove-tag" data-kind="${kind}" data-index="${index}" aria-label="Supprimer">×</button></div>`).join("") || `<div class="empty-state">Aucun élément.</div>`}</div><button class="button button-quiet button-small" type="button" data-action="add-tag" data-kind="${kind}">+ Ajouter</button>`;
  }

  function renderCatalogue() {
    return `${sectionHead("Catalogue réel", "Les produits ont été repris depuis le site actuel. Vérifiez maintenant les noms, marques, catégories et prix avec le commerçant.")}
      <div class="notice">Les stocks affichés sur le site n’ont pas été repris : ils sont volontairement à zéro dans l’étape suivante.</div>
      <div class="form-section">
        <h3>Marques et catégories</h3><p>Ne gardez que ce que le commerçant vend réellement.</p>
        <div class="form-grid">
          ${renderTagEditor("brands", "Marques proposées", state.catalogue.brands)}
          ${renderTagEditor("categories", "Catégories proposées", state.catalogue.categories)}
        </div>
      </div>
      <div class="form-section">
        <h3>Produits et prix</h3><p>Chaque prix doit être confirmé. Un ancien prix ne doit être renseigné que s’il est réel.</p>
        <div class="product-toolbar">
          <div class="field"><label for="productSearch">Rechercher un produit</label><input class="input" id="productSearch" placeholder="Nom ou marque"></div>
          <span class="product-count">${state.catalogue.products.length} produit${state.catalogue.products.length > 1 ? "s" : ""}</span>
          <button class="button button-quiet button-small" type="button" data-action="add-product">+ Ajouter un produit</button>
        </div>
        <div class="product-list" id="productList">
          ${state.catalogue.products.map((product, index) => `<div class="product-item" data-search="${esc((product.name + " " + product.brand).toLowerCase())}">
            <div><div class="product-index">PRODUIT ${String(index + 1).padStart(2, "0")}</div><input class="input" aria-label="Nom du produit" data-product-index="${index}" data-product-field="name" value="${esc(product.name)}"></div>
            <input class="input product-brand" aria-label="Marque" data-product-index="${index}" data-product-field="brand" value="${esc(product.brand)}">
            <input class="input product-category" aria-label="Catégorie" data-product-index="${index}" data-product-field="category" value="${esc(product.category)}">
            <input class="input" type="number" min="0" inputmode="numeric" aria-label="Prix en FCFA" data-product-index="${index}" data-product-field="price" value="${esc(product.price)}">
            <label class="switch product-active" title="Produit visible"><input type="checkbox" data-product-index="${index}" data-product-field="active" ${product.active ? "checked" : ""}><span class="switch-track"></span></label>
          </div>`).join("")}
        </div>
        <div class="inline-actions">
          <label class="choice"><input type="checkbox" data-bind="catalogue.productsConfirmed" ${state.catalogue.productsConfirmed ? "checked" : ""}><span><strong>Les produits sont confirmés</strong><small>Noms, marques, catégories et coloris vérifiés avec le client</small></span></label>
          <label class="choice"><input type="checkbox" data-bind="catalogue.pricesConfirmed" ${state.catalogue.pricesConfirmed ? "checked" : ""}><span><strong>Les prix sont confirmés</strong><small>Prix de vente réels validés par le client</small></span></label>
        </div>
        <div class="form-grid" style="margin-top:22px">${field("catalogue.notes", "Corrections ou produits à ajouter plus tard", { full: true, type: "textarea" })}</div>
      </div>`;
  }

  function selectedStockProduct() {
    return state.catalogue.products.find((product) => product.id === state.meta.selectedStockProduct) || state.catalogue.products[0];
  }

  function renderStocks() {
    const product = selectedStockProduct();
    if (product && state.meta.selectedStockProduct !== product.id) state.meta.selectedStockProduct = product.id;
    const total = product ? product.variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0) : 0;
    const filled = product ? product.variants.filter((variant) => Number(variant.stock || 0) > 0).length : 0;
    return `${sectionHead("Stocks réels", "Saisissez la quantité disponible pour chaque pointure et chaque coloris. Zéro signifie réellement indisponible.")}
      <div class="notice danger">Tous les stocks importés ont été remis à zéro. Ne cochez la confirmation finale qu’après avoir compté les paires avec le commerçant.</div>
      <div class="form-section">
        ${state.catalogue.products.length ? `<div class="field stock-product-select"><label for="stockProduct">Produit à renseigner</label><select class="select" id="stockProduct" data-action="select-stock-product">${state.catalogue.products.map((item) => `<option value="${esc(item.id)}" ${product && item.id === product.id ? "selected" : ""}>${esc(item.brand)} — ${esc(item.name)}</option>`).join("")}</select></div>
          <div class="stock-summary"><div><strong>${total}</strong><span>paires au total</span></div><div><strong>${filled}/${product.variants.length}</strong><span>variantes disponibles</span></div></div>
          <div class="stock-grid">${product.variants.map((variant, index) => `<label class="stock-cell"><span><strong>${esc(variant.label)}</strong><small>Quantité réelle</small></span><input class="input" type="number" min="0" inputmode="numeric" data-stock-index="${index}" value="${esc(variant.stock)}"></label>`).join("")}</div>` : `<div class="empty-state">Ajoutez d’abord les produits à l’étape Catalogue.</div>`}
      </div>
      <div class="form-section">
        <h3>Gestion quotidienne</h3><p>Comment le commerçant souhaite-t-il suivre ses quantités après le lancement ?</p>
        <div class="form-grid">
          ${field("stocks.trackingMethod", "Méthode de suivi", { type: "select", choices: [
            { value: "par-variante", label: "Par pointure et par coloris" },
            { value: "global", label: "Quantité globale par modèle" },
            { value: "availability-only", label: "Disponible / indisponible seulement" }
          ] })}
          ${field("stocks.lowStockThreshold", "Alerte stock faible à", { type: "number", min: 0, inputmode: "numeric" })}
          ${field("stocks.notes", "Remarques sur les stocks", { full: true, type: "textarea" })}
          <label class="choice full"><input type="checkbox" data-bind="stocks.confirmed" ${state.stocks.confirmed ? "checked" : ""}><span><strong>Stocks comptés et confirmés</strong><small>Chaque zéro est volontaire et toutes les quantités ont été vérifiées</small></span></label>
        </div>
      </div>`;
  }

  const UPLOADS = [
    { key: "logo", title: "Logo principal", text: "PNG transparent, SVG ou fichier original" },
    { key: "favicon", title: "Icône du site", text: "Si disponible ; sinon elle sera préparée depuis le logo" },
    { key: "hero", title: "Photo principale", text: "Image large, propre, avec une zone calme pour le texte" },
    { key: "store", title: "Photo de la boutique", text: "Façade ou intérieur, sans informations sensibles" },
    { key: "products", title: "Photos produits complémentaires", text: "Une vraie paire par photo et par coloris" },
    { key: "legal", title: "Documents légaux", text: "RCCM ou document utile, uniquement si le client accepte" }
  ];

  const BRAND_MEDIA_SLOTS = [
    { key: "logo", title: "Logo officiel", format: "PNG haute qualité", use: "Toutes les grilles de marques" },
    { key: "home", title: "Bannière d’accueil", format: "Image large 16/5", use: "Accueil uniquement" },
    { key: "page", title: "En-tête de la page marque", format: "Image large 16/9", use: "Page de cette marque uniquement" },
    { key: "homeMobile", title: "Accueil sur téléphone", format: "Facultatif · image verticale", use: "Sinon la bannière d’accueil sera réutilisée" },
    { key: "pageMobile", title: "Page marque sur téléphone", format: "Facultatif · image verticale", use: "Sinon l’en-tête principal sera réutilisé" }
  ];

  function localMediaUrl(source) {
    if (!source) return "";
    if (/^(data:|blob:|https?:)/.test(source)) return source;
    return source.startsWith("assets/") ? "../" + source : source;
  }

  function selectedBrandSource() {
    const label = state.catalogue.brands.includes(state.visuals.selectedBrand) ? state.visuals.selectedBrand : state.catalogue.brands[0] || "";
    return (state.visuals.brandSources || []).find((item) => item.label === label) || { label };
  }

  function selectedMediaProduct() {
    return state.catalogue.products.find((item) => item.id === state.visuals.selectedProduct) || state.catalogue.products[0] || null;
  }

  function productColors(product) {
    if (!product) return [];
    const colorIndex = (product.axes || []).findIndex((axis) => /couleur|coloris/i.test(axis.name || axis.label || ""));
    if (colorIndex < 0) return ["Photo principale"];
    const axis = product.axes[colorIndex] || {};
    const colors = (axis.values || []).map((value) => typeof value === "string" ? value : value.v || value.value || value.label || "").filter(Boolean);
    return colors.length ? colors : ["Photo principale"];
  }

  function currentProductImage(product, color) {
    if (!product) return "";
    const valueImages = product.valueImages || {};
    if (color !== "Photo principale") {
      const axis = (product.axes || []).find((item) => /couleur|coloris/i.test(item.name || item.label || ""));
      const prefix = axis ? (axis.name || axis.label || "Coloris") + VSEP : "Coloris" + VSEP;
      return valueImages[prefix + color] || valueImages[color] || product.image || "";
    }
    return product.image || (product.images || [])[0] || "";
  }

  function mediaFileCount() {
    const general = Object.values(state.visuals.files || {}).reduce((sum, list) => sum + list.length, 0);
    const brands = Object.values(state.visuals.brandMedia || {}).reduce((sum, slots) => sum + Object.values(slots || {}).filter(Boolean).length, 0);
    const products = Object.values(state.visuals.productMedia || {}).reduce((sum, colors) => sum + Object.values(colors || {}).reduce((inner, list) => inner + (list || []).length, 0), 0);
    return general + brands + products;
  }

  function brandMediaManager() {
    const brand = state.catalogue.brands.includes(state.visuals.selectedBrand) ? state.visuals.selectedBrand : state.catalogue.brands[0] || "";
    const source = selectedBrandSource();
    const replacements = state.visuals.brandMedia[brand] || {};
    return `<div class="media-toolbar"><label><span>Marque</span><select data-action="select-media-brand">${state.catalogue.brands.map((item) => `<option value="${esc(item)}" ${item === brand ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label><p>Chaque image a un emplacement précis. Une photo remplacée ici ne change pas les autres pages.</p></div>
      <div class="media-list">${BRAND_MEDIA_SLOTS.map((slot) => {
        const replacement = replacements[slot.key];
        const current = source[slot.key] || (slot.key === "homeMobile" ? source.home : slot.key === "pageMobile" ? source.page : "");
        return `<div class="media-row"><div class="media-thumb ${slot.key === "logo" ? "is-logo" : ""}">${current ? `<img src="${esc(localMediaUrl(current))}" alt="">` : `<span>Aucune image actuelle</span>`}</div><div class="media-copy"><strong>${esc(slot.title)}</strong><small>${esc(slot.format)} · ${esc(slot.use)}</small><span class="media-status ${replacement ? "is-ready" : ""}">${replacement ? "✓ Nouveau fichier : " + esc(replacement.name) : current ? "Image actuelle conservée" : "À fournir"}</span></div><div class="media-actions"><input class="file-input" id="brand-${esc(slug(brand))}-${slot.key}" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" data-media-kind="brand" data-media-entity="${esc(brand)}" data-media-slot="${slot.key}"><label class="button button-secondary button-small" for="brand-${esc(slug(brand))}-${slot.key}">${replacement ? "Changer" : "Remplacer"}</label>${replacement ? `<button class="text-button" type="button" data-action="remove-media" data-media-kind="brand" data-media-entity="${esc(brand)}" data-media-slot="${slot.key}">Annuler ce remplacement</button>` : ""}</div></div>`;
      }).join("")}</div>`;
  }

  function productMediaManager() {
    const product = selectedMediaProduct();
    if (!product) return `<div class="notice">Ajoutez d’abord les produits dans l’étape Catalogue.</div>`;
    const colors = productColors(product);
    const selectedColor = colors.includes(state.visuals.selectedColor) ? state.visuals.selectedColor : colors[0] || "Photo principale";
    const files = ((state.visuals.productMedia[product.id] || {})[selectedColor]) || [];
    const current = currentProductImage(product, selectedColor);
    return `<div class="media-toolbar media-toolbar-two"><label><span>Produit</span><select data-action="select-media-product">${state.catalogue.products.map((item) => `<option value="${esc(item.id)}" ${item.id === product.id ? "selected" : ""}>${esc(item.brand + " · " + item.name)}</option>`).join("")}</select></label><label><span>Coloris</span><select data-action="select-media-color">${colors.map((item) => `<option value="${esc(item)}" ${item === selectedColor ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label></div>
      <div class="product-media-card"><div class="product-media-current">${current ? `<img src="${esc(localMediaUrl(current))}" alt="">` : `<span>Pas de photo actuelle</span>`}<small>Photo actuellement utilisée</small></div><div><h4>${esc(selectedColor)}</h4><p>Ajoutez uniquement des photos montrant une paire complète de ce coloris. La première sera la photo principale ; les suivantes formeront la galerie.</p>${files.length ? `<ol class="media-files">${files.map((file, index) => `<li><span>${index === 0 ? "Principale" : "Galerie " + index}</span><b>${esc(file.name)}</b><button type="button" data-action="remove-product-media" data-product="${esc(product.id)}" data-color="${esc(selectedColor)}" data-key="${esc(file.key)}">Retirer</button></li>`).join("")}</ol>` : `<div class="media-empty">Aucune nouvelle photo ajoutée : la photo actuelle sera conservée.</div>`}<input class="file-input" id="product-media-upload" type="file" accept="image/*" multiple data-media-kind="product" data-media-entity="${esc(product.id)}" data-media-slot="${esc(selectedColor)}"><label class="button button-primary button-small" for="product-media-upload">Ajouter les photos de ce coloris</label></div></div>`;
  }

  function renderVisuals() {
    return `${sectionHead("Logo, photos et autorisations", "Ajoutez vos vrais fichiers. Ils seront envoyés dans votre dossier privé et transmis au responsable du site.")}
      <div class="form-section">
        <h3>État des éléments visuels</h3><p>Cette réponse nous indique ce qu’il faudra encore préparer.</p>
        <div class="form-grid">
          ${field("visuals.logoStatus", "Logo disponible ?", { required: true, type: "select", choices: [
            { value: "", label: "Sélectionner…" },
            { value: "ready", label: "Oui, fichier propre disponible" },
            { value: "photo-only", label: "Seulement une photo ou capture" },
            { value: "none", label: "Aucun logo pour le moment" }
          ] })}
          ${field("visuals.notes", "Consignes pour les visuels", { type: "textarea", placeholder: "Images à remplacer, préférences du commerçant…" })}
        </div>
      </div>
      <div class="form-section">
        <h3>Images du site</h3><p>Choisissez d’abord une marque ou un produit. L’outil indique clairement où chaque fichier sera utilisé.</p>
        <div class="media-tabs"><button type="button" class="${state.visuals.activeTab === "brands" ? "is-active" : ""}" data-action="media-tab" data-tab="brands">Marques</button><button type="button" class="${state.visuals.activeTab === "products" ? "is-active" : ""}" data-action="media-tab" data-tab="products">Produits et coloris</button></div>
        ${state.visuals.activeTab === "products" ? productMediaManager() : brandMediaManager()}
      </div>
      <div class="form-section">
        <h3>Autres fichiers utiles</h3><p>Documents et photos générales qui ne correspondent pas à un emplacement précis. Maximum conseillé : 15 Mo par fichier.</p>
        <div class="upload-grid">
          ${UPLOADS.filter((upload) => !["logo", "products"].includes(upload.key)).map((upload) => {
            const files = state.visuals.files[upload.key] || [];
            return `<div class="upload-box${files.length ? " has-file" : ""}"><div><h4>${esc(upload.title)}</h4><p>${esc(upload.text)}</p></div>${files.length ? `<div class="upload-file-name">${files.map((file) => esc(file.name)).join(" · ")}</div>` : ""}<div><input class="file-input" id="file-${upload.key}" type="file" multiple data-file-key="${upload.key}"><label class="button button-secondary button-small file-label" for="file-${upload.key}">${files.length ? "Ajouter d’autres fichiers" : "Choisir les fichiers"}</label></div></div>`;
          }).join("")}
        </div>
      </div>
      <div class="form-section">
        <h3>Confirmations d’usage</h3><p>Les logos de marques tierces et les photos doivent être utilisés en connaissance de cause.</p>
        <div class="choice-grid">
          ${checkbox("visuals.brandUsageConfirmed", "Usage des logos de marques confirmé", "Le commerçant assume l’usage des fichiers officiels fournis")}
          ${checkbox("visuals.photoUsageConfirmed", "Droit d’utiliser les photos confirmé", "Le commerçant possède les photos ou a l’autorisation de les utiliser")}
        </div>
      </div>`;
  }

  function renderLegal() {
    return `${sectionHead("Informations légales", "Ces informations complètent les conditions de vente et identifient clairement la personne responsable de la boutique.")}
      <div class="notice">Si une information n’est pas disponible demain, laissez le champ vide : elle apparaîtra clairement dans la liste des éléments manquants.</div>
      <div class="form-section">
        <h3>Entreprise</h3><p>Recopiez les informations depuis les documents officiels.</p>
        <div class="form-grid">
          ${field("legal.legalName", "Nom légal ou nom du propriétaire", { required: true, placeholder: "Nom figurant sur les documents" })}
          ${field("legal.legalForm", "Forme juridique", { type: "select", choices: [
            { value: "", label: "Sélectionner…" },
            { value: "Entreprise individuelle", label: "Entreprise individuelle" },
            { value: "SARL", label: "SARL" },
            { value: "SUARL", label: "SUARL" },
            { value: "SA", label: "SA" },
            { value: "Autre", label: "Autre" }
          ] })}
          ${field("legal.representative", "Représentant légal", { placeholder: "Nom complet" })}
          ${field("legal.legalEmail", "E-mail légal", { type: "email", placeholder: "contact@…" })}
          ${field("legal.legalAddress", "Adresse officielle", { required: true, full: true, placeholder: "Adresse figurant sur les documents" })}
          ${field("legal.rccm", "Numéro RCCM", { placeholder: "RCCM…" })}
          ${field("legal.nif", "Numéro NIF", { placeholder: "NIF…" })}
          ${field("legal.privacyContact", "Contact pour les données personnelles", { type: "email", placeholder: "E-mail ou numéro" })}
          ${field("legal.warranty", "Garantie commerciale éventuelle", { full: true, type: "textarea", placeholder: "Ne rien promettre si aucune garantie particulière n’est proposée" })}
          <label class="choice full"><input type="checkbox" data-bind="legal.informationConfirmed" ${state.legal.informationConfirmed ? "checked" : ""}><span><strong>Informations recopiées et confirmées</strong><small>Le commerçant confirme que ces données sont exactes</small></span></label>
        </div>
      </div>`;
  }

  function missingItems() {
    const items = [];
    if (!isFilled(state.identity.storeName)) items.push("Nom exact de la boutique");
    if (!isFilled(state.identity.shortDescription)) items.push("Description courte de la boutique");
    if (!isFilled(state.contact.ownerName)) items.push("Nom du responsable");
    if (!isFilled(state.contact.whatsapp)) items.push("Numéro WhatsApp de commande");
    if (!isFilled(state.contact.address)) items.push("Adresse de la boutique");
    if (!state.catalogue.productsConfirmed) items.push("Confirmation des produits");
    if (!state.catalogue.pricesConfirmed) items.push("Confirmation des prix");
    if (!state.stocks.confirmed) items.push("Confirmation des stocks réels");
    if (!isFilled(state.visuals.logoStatus)) items.push("État du logo");
    if (!state.visuals.photoUsageConfirmed) items.push("Autorisation d’utiliser les photos");
    if (!isFilled(state.legal.legalName)) items.push("Nom légal");
    if (!isFilled(state.legal.legalAddress)) items.push("Adresse légale");
    if (!state.legal.informationConfirmed) items.push("Confirmation des informations légales");
    return items;
  }

  function renderValidation() {
    const missing = missingItems();
    const activeProducts = state.catalogue.products.filter((product) => product.active);
    const totalStock = activeProducts.reduce((sum, product) => sum + product.variants.reduce((variantSum, variant) => variantSum + Number(variant.stock || 0), 0), 0);
    return `${sectionHead("Validation et envoi", "Relisez les points essentiels, notez ce qui manque puis envoyez le dossier complet au responsable du site.")}
      ${missing.length ? `<div class="notice danger"><strong>${missing.length} élément${missing.length > 1 ? "s" : ""} à compléter :</strong><ul class="missing-list">${missing.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>` : `<div class="notice success"><strong>Les informations essentielles sont complètes.</strong> Vous pouvez faire la validation finale et envoyer le dossier.</div>`}
      <div class="form-section">
        <h3>Résumé</h3><p>Une vue rapide avant de quitter le rendez-vous.</p>
        <div class="review-grid">
          <div class="review-block"><h3>Boutique</h3><dl><div><dt>Nom</dt><dd>${esc(state.identity.storeName || "À compléter")}</dd></div><div><dt>Responsable</dt><dd>${esc(state.contact.ownerName || "À compléter")}</dd></div><div><dt>WhatsApp</dt><dd>${esc(state.contact.whatsapp || "À compléter")}</dd></div><div><dt>Ville</dt><dd>${esc(state.contact.city || "À compléter")}</dd></div></dl></div>
          <div class="review-block"><h3>Catalogue</h3><dl><div><dt>Produits actifs</dt><dd>${activeProducts.length}</dd></div><div><dt>Marques</dt><dd>${state.catalogue.brands.length}</dd></div><div><dt>Stock total</dt><dd>${totalStock} paire${totalStock > 1 ? "s" : ""}</dd></div><div><dt>Prix</dt><dd>${state.catalogue.pricesConfirmed ? "Confirmés" : "À confirmer"}</dd></div></dl></div>
          <div class="review-block"><h3>Livraison</h3><dl><div><dt>À domicile</dt><dd>${state.delivery.homeDelivery ? "Oui" : "Non"}</dd></div><div><dt>Retrait</dt><dd>${state.delivery.pickup ? "Oui" : "Non"}</dd></div><div><dt>Zones</dt><dd>${state.delivery.zones.length}</dd></div><div><dt>Échanges</dt><dd>${esc(state.delivery.returnsDelay || "À préciser")}</dd></div></dl></div>
          <div class="review-block"><h3>Dossier</h3><dl><div><dt>Logo</dt><dd>${esc(state.visuals.logoStatus || "À préciser")}</dd></div><div><dt>Fichiers</dt><dd>${mediaFileCount()}</dd></div><div><dt>RCCM</dt><dd>${esc(state.legal.rccm || "À compléter")}</dd></div><div><dt>NIF</dt><dd>${esc(state.legal.nif || "À compléter")}</dd></div></dl></div>
        </div>
      </div>
      <div class="form-section">
        <h3>Accord final du commerçant</h3><p>Cochez chaque ligne seulement après une dernière relecture ensemble.</p>
        <div class="choice-grid">
          ${checkbox("validation.catalogueApproved", "Catalogue approuvé", "Produits, coloris, pointures, prix et stocks")}
          ${checkbox("validation.policiesApproved", "Conditions approuvées", "Livraison, paiement, échange et annulation")}
          ${checkbox("validation.publicationApproved", "Mise en ligne autorisée", "Le commerçant autorise l’utilisation des éléments fournis")}
        </div>
        <div class="form-grid" style="margin-top:22px">
          ${field("validation.ownerAccessEmail", "E-mail à inviter sur les comptes", { type: "email", placeholder: "E-mail personnel du propriétaire", hint: "Aucun mot de passe ne doit être écrit ici." })}
          ${field("validation.finalNotes", "Dernières notes", { type: "textarea", placeholder: "Travail restant, délai convenu, prochaine validation…" })}
        </div>
      </div>
      <div class="form-section final-send">
        <h3>Envoyer vos réponses</h3><p>Après l’envoi, le responsable du site recevra immédiatement ce dossier et tous vos fichiers. Relisez bien avant de confirmer.</p>
        <button class="button button-primary" type="button" data-action="submit-dossier" ${missing.length ? "disabled" : ""}>Envoyer mon dossier complet</button>
        ${missing.length ? `<p class="hint">Complétez d’abord les éléments essentiels indiqués ci-dessus.</p>` : `<p class="hint">Cette action ferme le dossier pour éviter une modification accidentelle.</p>`}
      </div>`;
  }

  const RENDERERS = [renderIdentity, renderContact, renderHours, renderDelivery, renderPayments, renderCatalogue, renderStocks, renderVisuals, renderLegal, renderValidation];

  function renderCurrentStep() {
    if (submitted) {
      formRegion.innerHTML = `<div class="submitted-screen"><span class="submitted-check">✓</span><h2>Dossier envoyé</h2><p>Merci. Toutes vos réponses et tous vos fichiers ont bien été transmis au responsable du site.</p><small>Vous pouvez maintenant fermer cette page.</small></div>`;
      document.querySelector(".bottom-bar").hidden = true;
      stepNav.innerHTML = "";
      return;
    }
    formRegion.innerHTML = RENDERERS[state.meta.currentStep]();
    document.documentElement.style.setProperty("--mobile-progress", ((state.meta.currentStep + 1) * 10) + "%");
    renderNav();
    renderProgress();
    document.querySelectorAll('[data-action="prev"]').forEach((button) => { button.disabled = state.meta.currentStep === 0; });
    document.querySelectorAll('[data-action="next"]').forEach((button) => {
      button.disabled = state.meta.currentStep === STEPS.length - 1;
      const textNode = Array.from(button.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (textNode) textNode.textContent = state.meta.currentStep === STEPS.length - 2 ? " Validation " : " Continuer ";
    });
    formRegion.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(index) {
    state.meta.currentStep = Math.max(0, Math.min(STEPS.length - 1, Number(index)));
    document.body.classList.remove("nav-open");
    scheduleSave();
    renderCurrentStep();
  }

  function addProduct() {
    const number = state.catalogue.products.length + 1;
    const product = {
      id: "nouveau-produit-" + Date.now(),
      name: "Nouveau produit " + number,
      brand: state.catalogue.brands[0] || "",
      category: state.catalogue.categories[0] || "",
      price: 0,
      oldPrice: 0,
      description: "",
      active: true,
      axes: [],
      variants: [{ key: "", label: "Stock général", stock: 0 }]
    };
    state.catalogue.products.push(product);
    scheduleSave();
    renderCurrentStep();
    notify("Produit ajouté. Vous pouvez modifier son nom et son prix.");
  }

  async function storeFiles(input) {
    const kind = input.dataset.fileKey;
    const selected = Array.from(input.files || []);
    if (!selected.length) return;
    const current = state.visuals.files[kind] || [];
    setSaving(true);
    for (const file of selected) {
      const result = await api("upload", null, file, "general:" + kind);
      current.push({ key: result.file.id, name: result.file.original_name, type: result.file.mime_type, size: result.file.size_bytes });
    }
    state.visuals.files[kind] = current;
    await saveNow();
    renderCurrentStep();
    notify(selected.length + " fichier" + (selected.length > 1 ? "s ajoutés" : " ajouté"));
  }

  async function storeMappedMedia(input) {
    const kind = input.dataset.mediaKind;
    const entity = input.dataset.mediaEntity;
    const slot = input.dataset.mediaSlot;
    const selected = Array.from(input.files || []);
    if (!selected.length) return;
    const stored = [];
    setSaving(true);
    for (const file of selected) {
      const result = await api("upload", null, file, "media:" + kind + ":" + entity + ":" + slot);
      stored.push({ key: result.file.id, name: result.file.original_name, type: result.file.mime_type, size: result.file.size_bytes });
    }
    if (kind === "brand") {
      state.visuals.brandMedia[entity] = state.visuals.brandMedia[entity] || {};
      const previous = state.visuals.brandMedia[entity][slot];
      if (previous && previous.key) await api("delete-file", { fileId: previous.key });
      state.visuals.brandMedia[entity][slot] = stored[0];
    } else {
      state.visuals.productMedia[entity] = state.visuals.productMedia[entity] || {};
      const current = state.visuals.productMedia[entity][slot] || [];
      state.visuals.productMedia[entity][slot] = current.concat(stored);
    }
    await saveNow();
    renderCurrentStep();
    notify(selected.length + " photo" + (selected.length > 1 ? "s ajoutées" : " ajoutée") + " au bon emplacement.");
  }

  async function removeMappedMedia(target) {
    const kind = target.dataset.mediaKind;
    const entity = target.dataset.mediaEntity;
    const slot = target.dataset.mediaSlot;
    const media = kind === "brand" && state.visuals.brandMedia[entity] ? state.visuals.brandMedia[entity][slot] : null;
    if (media && media.key) await api("delete-file", { fileId: media.key });
    if (kind === "brand" && state.visuals.brandMedia[entity]) delete state.visuals.brandMedia[entity][slot];
    await saveNow();
    renderCurrentStep();
    notify("Le remplacement est annulé. L’image actuelle sera conservée.");
  }

  async function removeProductMedia(target) {
    const product = target.dataset.product;
    const color = target.dataset.color;
    const key = target.dataset.key;
    const list = ((state.visuals.productMedia[product] || {})[color]) || [];
    state.visuals.productMedia[product][color] = list.filter((file) => file.key !== key);
    await api("delete-file", { fileId: key });
    await saveNow();
    renderCurrentStep();
    notify("Photo retirée.");
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(",");
    const mime = (parts[0].match(/data:([^;]+)/) || [])[1] || "application/octet-stream";
    const binary = atob(parts[1] || "");
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: mime });
  }

  async function exportBackup() {
    setSaving(true);
    await saveNow();
    notify("Préparation du dossier complet…");
    try {
      const storedFiles = await dbAll("files");
      const attachments = [];
      for (const file of storedFiles) {
        attachments.push({
          key: file.key,
          kind: file.kind,
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          data: await blobToDataUrl(file.blob)
        });
      }
      const payload = {
        format: "dossier-boutique-complet",
        exportedAt: new Date().toISOString(),
        state,
        attachments
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const store = slug(state.identity.storeName || "boutique");
      const date = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `dossier-client-${store}-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      notify("Dossier exporté dans vos téléchargements.");
    } catch (error) {
      console.error(error);
      notify("Impossible de créer l’export. Les réponses restent sauvegardées localement.");
    }
  }

  async function importBackup(file) {
    try {
      const payload = JSON.parse(await file.text());
      if (!payload || payload.format !== "dossier-boutique-complet" || !payload.state) throw new Error("Format inconnu");
      state = mergeDefaults(createDefaultState(), payload.state);
      for (const attachment of payload.attachments || []) {
        await dbPut("files", {
          key: attachment.key,
          kind: attachment.kind,
          name: attachment.name,
          type: attachment.type,
          size: attachment.size,
          lastModified: attachment.lastModified,
          blob: dataUrlToBlob(attachment.data)
        });
      }
      await saveNow();
      renderCurrentStep();
      notify("Sauvegarde importée avec succès.");
    } catch (error) {
      console.error(error);
      notify("Ce fichier n’est pas une sauvegarde valide de l’outil.");
    } finally {
      importInput.value = "";
    }
  }

  async function resetDossier() {
    if (!window.confirm("Effacer toutes les réponses et tous les fichiers de ce dossier sur cet ordinateur ? Exportez d’abord si vous souhaitez les conserver.")) return;
    const transaction = db.transaction(["records", "files"], "readwrite");
    transaction.objectStore("records").clear();
    transaction.objectStore("files").clear();
    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    state = createDefaultState();
    await saveNow();
    renderCurrentStep();
    notify("Nouveau dossier prêt.");
  }

  async function submitDossier(button) {
    if (missingItems().length) { notify("Complétez les informations essentielles avant l’envoi."); return; }
    if (!window.confirm("Envoyer définitivement ce dossier au responsable du site ?")) return;
    button.disabled = true; button.textContent = "Envoi en cours…";
    try {
      await saveNow();
      await api("submit");
      submitted = true;
      renderCurrentStep();
    } catch (error) {
      button.disabled = false; button.textContent = "Envoyer mon dossier complet";
      notify(error.message || "L’envoi a échoué. Réessayez.");
    }
  }

  document.addEventListener("click", async (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) {
      if (document.body.classList.contains("nav-open") && !event.target.closest(".step-sidebar") && !event.target.closest(".mobile-menu")) document.body.classList.remove("nav-open");
      return;
    }
    const action = actionTarget.dataset.action;
    if (action === "step") goToStep(actionTarget.dataset.index);
    if (action === "next") goToStep(state.meta.currentStep + 1);
    if (action === "prev") goToStep(state.meta.currentStep - 1);
    if (action === "toggle-nav") document.body.classList.toggle("nav-open");
    if (action === "show-help") helpDialog.showModal();
    if (action === "close-help") helpDialog.close();
    if (action === "add-exception") { state.hours.exceptions.push({ date: "", status: "closed", note: "" }); scheduleSave(); renderCurrentStep(); }
    if (action === "remove-exception") { state.hours.exceptions.splice(Number(actionTarget.dataset.index), 1); scheduleSave(); renderCurrentStep(); }
    if (action === "add-zone") { state.delivery.zones.push({ name: "", fee: "", delay: "" }); scheduleSave(); renderCurrentStep(); }
    if (action === "remove-zone") { state.delivery.zones.splice(Number(actionTarget.dataset.index), 1); scheduleSave(); renderCurrentStep(); }
    if (action === "add-product") addProduct();
    if (action === "media-tab") { state.visuals.activeTab = actionTarget.dataset.tab; scheduleSave(); renderCurrentStep(); }
    if (action === "remove-media") await removeMappedMedia(actionTarget);
    if (action === "remove-product-media") await removeProductMedia(actionTarget);
    if (action === "add-tag") { state.catalogue[actionTarget.dataset.kind].push(""); scheduleSave(); renderCurrentStep(); }
    if (action === "remove-tag") { state.catalogue[actionTarget.dataset.kind].splice(Number(actionTarget.dataset.index), 1); scheduleSave(); renderCurrentStep(); }
    if (action === "export") exportBackup();
    if (action === "import") importInput.click();
    if (action === "print") window.print();
    if (action === "reset") resetDossier();
    if (action === "submit-dossier") submitDossier(actionTarget);
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target.dataset.bind) {
      setPath(target.dataset.bind, target.type === "checkbox" ? target.checked : target.type === "number" ? (target.value === "" ? "" : Number(target.value)) : target.value);
      scheduleSave();
    }
    if (target.dataset.array) {
      const item = getPath(target.dataset.array)[Number(target.dataset.index)];
      if (item) item[target.dataset.field] = target.type === "number" ? (target.value === "" ? "" : Number(target.value)) : target.value;
      scheduleSave();
    }
    if (target.dataset.productIndex != null) {
      const product = state.catalogue.products[Number(target.dataset.productIndex)];
      if (product) product[target.dataset.productField] = target.type === "checkbox" ? target.checked : target.type === "number" ? Number(target.value || 0) : target.value;
      scheduleSave();
    }
    if (target.dataset.tagKind) {
      state.catalogue[target.dataset.tagKind][Number(target.dataset.index)] = target.value;
      scheduleSave();
    }
    if (target.dataset.stockIndex != null) {
      const product = selectedStockProduct();
      if (product && product.variants[Number(target.dataset.stockIndex)]) product.variants[Number(target.dataset.stockIndex)].stock = Math.max(0, Number(target.value || 0));
      scheduleSave();
      const totalNode = formRegion.querySelector(".stock-summary strong");
      if (totalNode) totalNode.textContent = product.variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0);
    }
    if (target.id === "productSearch") {
      const query = target.value.trim().toLowerCase();
      formRegion.querySelectorAll(".product-item").forEach((item) => { item.hidden = !item.dataset.search.includes(query); });
    }
  });

  document.addEventListener("change", async (event) => {
    const target = event.target;
    if (target.dataset.hourIndex != null) {
      const item = state.hours.days[Number(target.dataset.hourIndex)];
      item[target.dataset.hourField] = target.type === "checkbox" ? target.checked : target.value;
      scheduleSave();
      renderCurrentStep();
    }
    if (target.dataset.fileKey) { try { await storeFiles(target); } catch (error) { setSaving(false); notify(error.message || "Envoi du fichier impossible."); } }
    if (target.dataset.mediaKind) { try { await storeMappedMedia(target); } catch (error) { setSaving(false); notify(error.message || "Envoi de la photo impossible."); } }
    if (target.dataset.action === "select-media-brand") {
      state.visuals.selectedBrand = target.value;
      scheduleSave();
      renderCurrentStep();
    }
    if (target.dataset.action === "select-media-product") {
      state.visuals.selectedProduct = target.value;
      state.visuals.selectedColor = "";
      scheduleSave();
      renderCurrentStep();
    }
    if (target.dataset.action === "select-media-color") {
      state.visuals.selectedColor = target.value;
      scheduleSave();
      renderCurrentStep();
    }
    if (target.dataset.action === "select-stock-product") {
      state.meta.selectedStockProduct = target.value;
      scheduleSave();
      renderCurrentStep();
    }
    if (target.dataset.bind && target.type === "checkbox") renderCurrentStep();
  });

  importInput.addEventListener("change", () => {
    if (importInput.files && importInput.files[0]) importBackup(importInput.files[0]);
  });

  helpDialog.addEventListener("click", (event) => {
    if (event.target === helpDialog) helpDialog.close();
  });

  window.addEventListener("beforeunload", () => {
    if (state && db) dbPut("records", state, STATE_KEY).catch(() => {});
  });

  async function init() {
    try {
      if (!/^[A-Za-z0-9_-]{40,100}$/.test(INTAKE_TOKEN)) throw new Error("Ce lien privé est incomplet.");
      db = await openDb();
      const saved = await dbGet("records", STATE_KEY);
      const defaults = createDefaultState();
      const remote = await api("load");
      remoteInfo = remote.intake;
      submitted = remoteInfo.status === "submitted";
      const remoteState = remoteInfo.data && Object.keys(remoteInfo.data).length ? remoteInfo.data : null;
      const localIsNewer = saved && saved.meta && Date.parse(saved.meta.updatedAt || 0) > Date.parse(remoteInfo.updated_at || 0);
      state = mergeDefaults(defaults, localIsNewer ? saved : (remoteState || saved));
      if (!remoteState && !saved) state.identity.storeName = remoteInfo.client_name || "";
      if (!localIsNewer) state.meta.currentStep = Number(remoteInfo.current_step) || 0;
      const sourceProducts = {};
      defaults.catalogue.products.forEach((product) => { sourceProducts[product.id] = product; });
      state.catalogue.products.forEach((product) => {
        const source = sourceProducts[product.id] || {};
        if (!product.image) product.image = source.image || "";
        if (!Array.isArray(product.images)) product.images = clone(source.images || []);
        if (!product.valueImages) product.valueImages = clone(source.valueImages || {});
      });
      renderCurrentStep();
      setSaving(false);
      if (localIsNewer && !submitted) scheduleSave();
    } catch (error) {
      console.error(error);
      document.body.innerHTML = `<main class="link-error"><span>!</span><h1>Lien indisponible</h1><p>${esc(error.message || "Ce lien est invalide ou a expiré.")}</p><small>Demandez un nouveau lien au responsable du site.</small></main>`;
    }
  }

  init();
})();
