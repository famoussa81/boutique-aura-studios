#!/usr/bin/env node
/**
 * Configuration avant mise en ligne.
 *
 * Remplace en une commande le domaine de démonstration et les mentions
 * légales laissées en attente, dans tous les fichiers concernés.
 *
 *   node configurer.mjs --domaine https://ma-boutique.com
 *   node configurer.mjs --enseigne "T&K SHOES" --image assets/hero.webp
 *   node configurer.mjs --domaine https://ma-boutique.com \
 *                       --enseigne "NOM SARL" --forme "SARL" \
 *                       --adresse "Rue 224, Porte 15, ACI 2000" \
 *                       --rccm "MA.BKO.2026.B.1234" --nif "081234567X" \
 *                       --email "contact@ma-boutique.com"
 *
 * Sans argument, affiche l'état courant sans rien modifier.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DOMAINE_DEMO = 'https://boutique-aura-studios.vercel.app';

const FICHIERS_DOMAINE = [
  'index.html', 'marques.html', 'catalogue.html', 'collection.html', 'produit.html', '404.html',
  'cgv.html', 'confidentialite.html',
  'guide-des-tailles.html', 'durabilite.html',
  'robots.txt', 'sitemap.xml',
];

/* Nom et image de partage. Ils vivent dans les balises `<meta>`, que le
   commerçant ne peut pas modifier depuis l'administration : ce sont elles qui
   composent l'aperçu affiché quand il envoie le lien de sa boutique sur
   WhatsApp. Sans ce passage, il enverrait le nom du modèle de départ. */
const ENSEIGNE_DEMO = 'T&K SHOES';
const IMAGE_DEMO = '/assets/hero.webp';

const FICHIERS_ENSEIGNE = [
  'index.html', 'marques.html', 'catalogue.html', 'collection.html', 'produit.html', '404.html',
  'cgv.html', 'confidentialite.html', 'guide-des-tailles.html', 'durabilite.html',
];

function args() {
  const out = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith('--')) out[a[i].slice(2)] = a[i + 1] ?? '';
  }
  return out;
}

function lire(f) {
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
}

const o = args();
const modifs = [];

// ---------------------------------------------------------------- domaine
if (o.domaine) {
  const domaine = o.domaine.replace(/\/+$/, '');
  if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(domaine)) {
    console.error('Domaine invalide. Attendu : https://exemple.com');
    process.exit(1);
  }
  for (const f of FICHIERS_DOMAINE) {
    const s = lire(f);
    if (s === null) { console.warn(`  ignoré (absent) : ${f}`); continue; }
    if (!s.includes(DOMAINE_DEMO)) continue;
    const n = (s.match(new RegExp(DOMAINE_DEMO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    writeFileSync(f, s.split(DOMAINE_DEMO).join(domaine), 'utf8');
    modifs.push(`${f} — ${n} occurrence${n > 1 ? 's' : ''} du domaine`);
  }
}

// ---------------------------------------------------------------- WhatsApp du repli
// Le numero vit dans les reglages, lus par le script. Le bloc <noscript> ne
// peut pas les lire : il porte donc une copie en dur, que cette commande
// realigne. Sans elle, changer de numero dans l'administration laisserait
// l'ancien sur le seul ecran que voient les navigateurs sans JavaScript.
if (o.whatsapp) {
  const num = o.whatsapp.replace(/\D/g, '');
  if (num.length < 8) {
    console.error('Numero WhatsApp invalide. Attendu : indicatif + numero, ex. 22376123456');
    process.exit(1);
  }
  for (const f of ['index.html', 'marques.html', 'catalogue.html', 'collection.html']) {
    const s2 = lire(f);
    if (s2 === null) continue;
    const maj = s2.replace(/https:\/\/wa\.me\/\d+/g, 'https://wa.me/' + num);
    if (maj === s2) continue;
    writeFileSync(f, maj, 'utf8');
    modifs.push(`${f} — numero WhatsApp du repli sans JavaScript`);
  }
}

// ---------------------------------------------------------------- enseigne et image de partage
if (o.enseigne) {
  for (const f of FICHIERS_ENSEIGNE) {
    const s = lire(f);
    if (s === null) { console.warn(`  ignoré (absent) : ${f}`); continue; }
    if (!s.includes(ENSEIGNE_DEMO)) continue;
    const n = (s.match(new RegExp(ENSEIGNE_DEMO, 'g')) || []).length;
    writeFileSync(f, s.split(ENSEIGNE_DEMO).join(o.enseigne), 'utf8');
    modifs.push(`${f} — ${n} occurrence${n > 1 ? 's' : ''} de l'enseigne`);
  }
}

if (o.image) {
  if (!existsSync(o.image)) {
    console.error(`Image de partage introuvable : ${o.image}`);
    process.exit(1);
  }
  /* Les balises Open Graph pointent désormais vers `/api/share-image`.
     L'option configure donc uniquement son image de repli ; elle ne doit
     jamais remplacer par accident le hero visible de la page d'accueil. */
  const imagePublique = '/' + o.image.replace(/^\.?[\\/]+/, '').replace(/\\/g, '/');
  for (const f of ['api/share-image.js']) {
    const s = lire(f);
    if (s === null || !s.includes(IMAGE_DEMO)) continue;
    const n = (s.match(new RegExp(IMAGE_DEMO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    writeFileSync(f, s.split(IMAGE_DEMO).join(imagePublique), 'utf8');
    modifs.push(`${f} — ${n} référence${n > 1 ? 's' : ''} à l'image de partage`);
  }
}

// ---------------------------------------------------------------- mentions légales
const LEGAL = [
  ['forme',    /Forme juridique : \[à compléter\]/,                    v => `Forme juridique : ${v}`],
  ['adresse',  /Siège social : \[adresse complète\], Bamako, Mali/,    v => `Siège social : ${v}, Bamako, Mali`],
  ['rccm',     /Registre du commerce \(RCCM\) : \[à compléter\]/,      v => `Registre du commerce (RCCM) : ${v}`],
  ['nif',      /Numéro d'identification fiscale \(NIF\) : \[à compléter\]/, v => `Numéro d'identification fiscale (NIF) : ${v}`],
  ['email',    /— \[adresse e-mail\]/,                                 v => `— ${v}`],
  ['enseigne', /Dénomination : T&K SHOES/,                             v => `Dénomination : ${v}`],
];

let cgv = lire('cgv.html');
if (cgv) {
  let touche = 0;
  for (const [cle, motif, remplace] of LEGAL) {
    if (!o[cle]) continue;
    if (!motif.test(cgv)) { console.warn(`  déjà renseigné : ${cle}`); continue; }
    cgv = cgv.replace(motif, remplace(o[cle]));
    touche++;
  }
  if (touche) { writeFileSync('cgv.html', cgv, 'utf8'); modifs.push(`cgv.html — ${touche} mention(s) légale(s)`); }
}

// ---------------------------------------------------------------- rapport
console.log('\nCONFIGURATION AVANT MISE EN LIGNE\n');

if (modifs.length) {
  console.log('Modifié :');
  modifs.forEach(m => console.log('  ' + m));
  console.log('');
}

const restant = [];
for (const f of FICHIERS_DOMAINE) {
  const s = lire(f);
  if (s && s.includes(DOMAINE_DEMO)) restant.push(f);
}
console.log(restant.length
  ? `Domaine de démonstration encore présent dans : ${restant.join(', ')}`
  : 'Domaine : configuré partout.');

const c = lire('cgv.html') || '';
const manquants = c.match(/\[à compléter\]|\[adresse complète\]|\[adresse e-mail\]/g) || [];
console.log(manquants.length
  ? `Mentions légales à renseigner : ${manquants.length} (cgv.html)`
  : 'Mentions légales : complètes.');

const cfg = lire('supabase.config.js') || '';
const urlOk = /url:\s*"https:\/\/[a-z0-9]+\.supabase\.co"/.test(cfg);
const cleOk = /anonKey:\s*"ey[\w.-]{20,}"/.test(cfg);
const actif = /enabled:\s*true/.test(cfg);
console.log(`Supabase : ${actif && urlOk && cleOk ? 'configuré et actif.'
  : `à configurer (enabled=${actif}, url=${urlOk ? 'ok' : 'vide'}, clé=${cleOk ? 'ok' : 'vide'})`}`);

if (!actif) {
  console.log('\n  Sans Supabase, l\'administration s\'ouvre sans mot de passe.');
  console.log('  Ne publiez pas le site tant que ce point n\'est pas réglé.');
}
console.log('');
