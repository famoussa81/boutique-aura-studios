import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(toolsDir);
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "catalog.js"), "utf8"), context);

const seed = context.window.AURA_CATALOG.seed();
const sqlJson = (value) => JSON.stringify(value).replaceAll("'", "''");
const lines = [
  "-- ============================================================",
  "-- T&K SHOES — Catalogue et réglages de départ",
  "-- Généré depuis catalog.js par tools/build-seed.mjs.",
  "-- Rejouable : chaque ligne est mise à jour si elle existe déjà.",
  "-- ============================================================",
  "",
  "insert into public.settings (id, data, updated_at)",
  `values (1, '${sqlJson(seed.settings)}'::jsonb, now())`,
  "on conflict (id) do update set data = excluded.data, updated_at = now();",
  ""
];

for (const product of seed.products) {
  lines.push(
    "insert into public.products (id, data, updated_at)",
    `values ('${product.id.replaceAll("'", "''")}', '${sqlJson(product)}'::jsonb, now())`,
    "on conflict (id) do update set data = excluded.data, updated_at = now();",
    ""
  );
}

fs.writeFileSync(path.join(root, "supabase", "seed-catalogue.sql"), lines.join("\n"), "utf8");
console.log(`Seed généré : ${seed.products.length} produits, ${seed.settings.collections.length} marques.`);
