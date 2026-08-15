/* ============================================================
   AURA STUDIOS — Configuration Supabase (unique)
   ------------------------------------------------------------
   Comment activer la boutique en ligne :
   1. Crée un projet sur https://supabase.com
   2. Dans SQL Editor, colle le contenu de `supabase/schema.sql` et
      exécute-le (crée les tables + politiques RLS).
   3. Copie ici l'URL du projet et la clé publique (anon) :
      Settings → API → Project URL + anon public key.
   4. Passe `enabled` à true.
   5. Crée le compte administrateur :
      Authentication → Users → Add user (email + mot de passe).
      Ces identifiants se saisissent dans le formulaire de
      connexion de `admin.html` — ils ne sont JAMAIS écrits ici.
   6. Déploie les fichiers sur Vercel (pas de serveur nécessaire,
      le schéma RLS sécurise les accès).

   IMPORTANT — ce fichier est téléchargé par tous les visiteurs de
   la boutique. Il ne doit contenir que des valeurs publiques :
   l'URL du projet et la clé `anon`. Jamais de mot de passe, jamais
   la clé `service_role`.
   ============================================================ */
window.AURA_SUPA = {
  // false = boutique autonome (localStorage). true = base partagée.
  enabled: true,

  // Project URL — projet « boutique-aura-studios », région Paris.
  url: "https://vgzvavlmmqbxtuhanaqj.supabase.co",

  // Clé publique ANON (publiable, jamais la clé service_role).
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnenZhdmxtbXFieHR1aGFuYXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MjU1NzYsImV4cCI6MjEwMjQwMTU3Nn0.n-9SC-nVEve7M-w4yiozdWJBp2_PaoYB5qMeS2cOqwg",

  // Domaine technique de connexion. L'administrateur saisit « admin » dans
  // le formulaire ; Supabase Auth reçoit « admin@aura-studios.app ».
  // C'est ce même e-mail qu'il faut créer dans Authentication → Users.
  loginDomain: "aura-studios.app"
};
