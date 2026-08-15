/* ============================================================
   AURA STUDIOS — Client Supabase (REST, sans SDK lourd)
   Rôles :
   - Boutique (index.html) : lecture du catalogue + passage de
     commande via la fonction serveur `place_order` (validation,
     prix et stock gérés en base) et inscription newsletter.
   - Admin (admin.html) : connexion par email/mot de passe
     (Supabase Auth) puis écriture des produits/réglages et
     lecture des commandes.
   Chaque appel est gardé : si Supabase n'est pas configuré ou si
   `fetch` est indisponible, tout retombe en mode local (localStorage).
   ============================================================ */
(function(){
  var SKEY = "aura_admin_session";

  function cfg(){ try { return window.AURA_SUPA || null; } catch(e){ return null; } }
  var C = cfg();
  var rawUrl = (C && C.url) ? String(C.url).trim() : "";
  // Une URL laissée en gabarit ("VOTRE_URL_SUPABASE") ne doit jamais
  // déclencher de requête : sinon chaque page charge sur des erreurs réseau.
  var valid = /^https:\/\/[^\s/]+\.supabase\.(co|in)$/.test(rawUrl.replace(/\/+$/, ""));
  var enabled = !!(C && C.enabled && valid && C.anonKey);
  var base = enabled ? rawUrl.replace(/\/+$/, "") : null;
  var anon = (C && C.anonKey) || "";
  var session = null; // { token, refresh }

  try {
    var kept = sessionStorage.getItem(SKEY);
    if (kept) session = JSON.parse(kept);
  } catch(e){}

  function can(){ return typeof fetch === "function" && !!base; }
  function configured(){ return !!(C && C.enabled) && !valid; }

  function h(token){
    var t = token || anon;
    return { "apikey": anon, "Authorization": "Bearer " + t, "Content-Type": "application/json" };
  }
  function req(path, opt){
    opt = opt || {};
    var H = h(opt.token);
    if (opt.prefer) H["Prefer"] = opt.prefer;
    var p = { method: opt.method || "GET", headers: H };
    if (opt.body !== undefined) p.body = JSON.stringify(opt.body);
    return fetch(base + path, p).then(function(r){
      if (!r.ok){
        return r.text().then(function(t){
          var msg = t;
          // PostgREST renvoie {"message": "..."} : on remonte le texte lisible.
          try { var j = JSON.parse(t); msg = j.message || j.error_description || j.error || t; } catch(e){}
          var err = new Error(msg || ("HTTP " + r.status));
          err.status = r.status;
          throw err;
        });
      }
      var ct = (r.headers.get("content-type") || "");
      if (ct.indexOf("json") >= 0) return r.json();
      return null;
    });
  }

  // Les réglages sont lisibles publiquement : aucun secret ne doit y entrer.
  function publicSettings(s){
    var out = {}, blocked = { password: 1, adminPassword: 1, adminEmail: 1, anonKey: 1, serviceKey: 1 };
    for (var k in s) if (!blocked[k]) out[k] = s[k];
    return out;
  }

  window.AURA_DB = {
    ready: can,
    /* true si l'utilisateur a activé Supabase mais que l'URL est encore
       le gabarit — permet à l'admin d'afficher un avertissement clair. */
    misconfigured: configured,
    hasSession: function(){ return !!session; },
    get base(){ return base; },

    // ---------------- boutique / lecture publique ----------------
    loadProducts: function(cb){
      req("/rest/v1/products?select=*&order=id&limit=1000").then(function(rows){
        cb(null, (rows || []).map(function(x){ return x.data; }));
      }).catch(function(e){ cb(e, null); });
    },
    loadSettings: function(cb){
      req("/rest/v1/settings?select=*&id=eq.1").then(function(rows){
        cb(null, (rows && rows[0] && rows[0].data) || null);
      }).catch(function(e){ cb(e, null); });
    },
    /* Passage de commande : la fonction serveur valide les coordonnées,
       recalcule les montants, réserve le stock et attribue la référence.
       Elle renvoie la commande complète telle qu'enregistrée. */
    placeOrder: function(draft, cb){
      cb = cb || function(){};
      req("/rest/v1/rpc/place_order", { method: "POST", body: { payload: draft } })
        .then(function(order){ cb(null, order); })
        .catch(function(e){ cb(e, null); });
    },
    subscribe: function(email, cb){
      cb = cb || function(){};
      req("/rest/v1/subscribers", {
        method: "POST",
        prefer: "resolution=ignore-duplicates",
        body: { email: String(email || "").trim().toLowerCase() }
      }).then(function(){ cb(null); }).catch(function(e){ cb(e); });
    },

    /* Liste d'attente sur un produit en rupture. `ignore-duplicates` évite
       qu'un même numéro s'inscrive deux fois sur la même taille. */
    joinWaitlist: function(entry, cb){
      cb = cb || function(){};
      req("/rest/v1/waitlist", {
        method: "POST",
        prefer: "resolution=ignore-duplicates",
        body: {
          product_id: String(entry.id || ""),
          product_name: String(entry.name || ""),
          size: String(entry.size || ""),
          phone: String(entry.phone || "")
        }
      }).then(function(){ cb(null); }).catch(function(e){ cb(e); });
    },

    /* Envoi d'une image produit dans Supabase Storage. Le fichier est déjà
       compressé côté navigateur ; on ne fait que le déposer et renvoyer son
       adresse publique. Bucket `produits`, écriture réservée à une session. */
    uploadImage: function(blob, cb){
      cb = cb || function(){};
      if (!session) return cb(new Error("non connecté"), null);
      if (!can() || !base) return cb(new Error("Supabase non configuré"), null);
      var name = "p" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".webp";
      fetch(base + "/storage/v1/object/produits/" + name, {
        method: "POST",
        headers: {
          "apikey": anon,
          "Authorization": "Bearer " + session.token,
          "Content-Type": "image/webp",
          "x-upsert": "true"
        },
        body: blob
      }).then(function(r){
        if (!r.ok) return r.text().then(function(t){ throw new Error(t || ("HTTP " + r.status)); });
        cb(null, base + "/storage/v1/object/public/produits/" + name);
      }).catch(function(e){ cb(e, null); });
    },

    // ---------------- admin / écriture (session requise) ----------------
    signIn: function(email, password, cb){
      cb = cb || function(){};
      req("/auth/v1/token?grant_type=password", { method: "POST", body: { email: email, password: password } })
        .then(function(r){
          session = { token: r.access_token, refresh: r.refresh_token };
          try { sessionStorage.setItem(SKEY, JSON.stringify(session)); } catch(e){}
          cb(null, session);
        })
        .catch(function(e){ cb(e, null); });
    },
    signOut: function(){
      session = null;
      try { sessionStorage.removeItem(SKEY); } catch(e){}
    },
    /* Vérifie que la session restaurée est toujours valide côté serveur. */
    verifySession: function(cb){
      cb = cb || function(){};
      if (!session) return cb(new Error("aucune session"));
      req("/auth/v1/user", { token: session.token })
        .then(function(u){ cb(null, u); })
        .catch(function(e){ window.AURA_DB.signOut(); cb(e); });
    },
    saveProducts: function(products, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"));
      var rows = (products || []).map(function(p){ return { id: p.id, data: p }; });
      if (!rows.length) return cb(null);
      req("/rest/v1/products", { method: "POST", token: session.token, prefer: "resolution=merge-duplicates", body: rows })
        .then(function(){ cb(null); }).catch(function(e){ cb(e); });
    },
    deleteProduct: function(id, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"));
      req("/rest/v1/products?id=eq." + encodeURIComponent(id), { method: "DELETE", token: session.token })
        .then(function(){ cb(null); }).catch(function(e){ cb(e); });
    },
    saveSettings: function(settings, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"));
      req("/rest/v1/settings?on_conflict=id", { method: "POST", token: session.token, prefer: "resolution=merge-duplicates", body: { id: 1, data: publicSettings(settings) } })
        .then(function(){ cb(null); }).catch(function(e){ cb(e); });
    },
    loadOrders: function(cb){
      if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/orders?select=*&order=created_at.desc&limit=1000", { token: session.token })
        .then(function(rows){ cb(null, (rows || []).map(function(x){ return x.data; })); })
        .catch(function(e){ cb(e, null); });
    },
    loadSubscribers: function(cb){
      if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/subscribers?select=*&order=created_at.desc&limit=5000", { token: session.token })
        .then(function(rows){ cb(null, rows || []); })
        .catch(function(e){ cb(e, null); });
    },
    loadWaitlist: function(cb){
      if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/waitlist?select=*&order=created_at.desc&limit=5000", { token: session.token })
        .then(function(rows){ cb(null, rows || []); })
        .catch(function(e){ cb(e, null); });
    },
    deleteOrder: function(ref, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"));
      req("/rest/v1/orders?ref=eq." + encodeURIComponent(ref), { method: "DELETE", token: session.token })
        .then(function(){ cb(null); }).catch(function(e){ cb(e); });
    },

    /* Mise à jour d'une seule commande (changement de statut) : on n'envoie
       que la ligne concernée, jamais tout l'historique. */
    updateOrder: function(order, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"));
      req("/rest/v1/orders?ref=eq." + encodeURIComponent(order.ref), { method: "PATCH", token: session.token, body: { data: order } })
        .then(function(){ cb(null); }).catch(function(e){ cb(e); });
    }
  };
})();
