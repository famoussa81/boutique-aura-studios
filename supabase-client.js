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
  function publicDraft(d){
    d = d || {};
    return {
      settings: publicSettings(d.settings || {}),
      products: Array.isArray(d.products) ? d.products : []
    };
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
      req("/rest/v1/rpc/subscribe_newsletter", {
        method: "POST",
        body: { raw_email: String(email || "").trim().toLowerCase() }
      }).then(function(){ cb(null); }).catch(function(e){ cb(e); });
    },

    /* Liste d'attente sur un produit en rupture. La fonction serveur évite
       les doublons et applique la limite de demandes. */
    joinWaitlist: function(entry, cb){
      cb = cb || function(){};
      req("/rest/v1/rpc/join_waitlist_request", {
        method: "POST",
        body: {
          raw_product_id: String(entry.id || ""),
          raw_product_name: String(entry.name || ""),
          raw_size: String(entry.size || ""),
          raw_phone: String(entry.phone || "")
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
          "cache-control": "31536000",
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
    isAdmin: function(cb){
      cb = cb || function(){};
      if (!session) return cb(new Error("non connecté"), false);
      req("/rest/v1/rpc/is_admin", { method: "POST", token: session.token, body: {} })
        .then(function(ok){ cb(null, ok === true); })
        .catch(function(e){ cb(e, false); });
    },
    loadDraft: function(cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/admin_drafts?select=*&order=updated_at.desc&limit=1", { token: session.token })
        .then(function(rows){ cb(null, rows && rows[0] || null); })
        .catch(function(e){ cb(e, null); });
    },
    saveDraft: function(draft, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/rpc/save_admin_draft", {
        method: "POST", token: session.token,
        body: {
          draft_id: draft.id || "00000000-0000-0000-0000-000000000001",
          expected_version: Number(draft.version) || 0,
          payload: publicDraft(draft.data),
          mark_dirty: draft.dirty !== false
        }
      }).then(function(row){ cb(null, row); }).catch(function(e){ cb(e, null); });
    },
    publishDraft: function(id, version, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/rpc/publish_store", {
        method: "POST", token: session.token,
        body: { draft_id: id, expected_version: Number(version) || 1 }
      }).then(function(result){ cb(null, result); }).catch(function(e){ cb(e, null); });
    },
    loadRevisions: function(cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/store_revisions?select=id,version,created_at,created_by&order=created_at.desc&limit=10", { token: session.token })
        .then(function(rows){ cb(null, rows || []); }).catch(function(e){ cb(e, null); });
    },
    restoreRevisionAsDraft: function(id, version, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/rpc/restore_revision_as_draft", {
        method: "POST", token: session.token, body: { revision_id: id, expected_version: Number(version) || 0 }
      }).then(function(result){ cb(null, result); }).catch(function(e){ cb(e, null); });
    },
    setInventory: function(id, variants, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/rpc/set_inventory", {
        method: "POST", token: session.token,
        body: { product_id: id, new_variants: variants || {} }
      }).then(function(result){ cb(null, result); }).catch(function(e){ cb(e, null); });
    },
    setProductVisibility: function(id, visible, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/rpc/set_product_visibility", {
        method: "POST", token: session.token,
        body: { product_id: id, visible: !!visible }
      }).then(function(result){ cb(null, result); }).catch(function(e){ cb(e, null); });
    },
    archiveProduct: function(id, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"), null);
      req("/rest/v1/rpc/archive_product", {
        method: "POST", token: session.token, body: { product_id: id }
      }).then(function(result){ cb(null, result); }).catch(function(e){ cb(e, null); });
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
      req("/rest/v1/rpc/admin_delete_order", {
        method: "POST", token: session.token, body: { order_ref: ref }
      }).then(function(result){ cb(null, result); }).catch(function(e){ cb(e); });
    },

    /* Mise à jour d'une seule commande (changement de statut) : on n'envoie
       que la ligne concernée, jamais tout l'historique. */
    updateOrder: function(order, cb){
      cb = cb || function(){}; if (!session) return cb(new Error("non connecté"));
      req("/rest/v1/rpc/admin_save_order", {
        method: "POST", token: session.token, body: { payload: order }
      }).then(function(result){ cb(null, result); }).catch(function(e){ cb(e); });
    }
  };
})();
