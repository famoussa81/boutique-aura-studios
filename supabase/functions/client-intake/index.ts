import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const url = Deno.env.get("SUPABASE_URL") || "";
const anon = Deno.env.get("SUPABASE_ANON_KEY") || "";
const service = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "", { auth: { persistSession: false } });
const allowedOrigin = (origin: string) => origin === "https://boutique-aura-studios.vercel.app" || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
const cors = (req: Request) => ({
  "Access-Control-Allow-Origin": allowedOrigin(req.headers.get("origin") || "") ? req.headers.get("origin")! : "https://boutique-aura-studios.vercel.app",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-intake-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin",
});
const reply = (req: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...cors(req), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});
const text = (value: unknown, max: number) => String(value || "").trim().slice(0, max);

async function hash(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function admin(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || token === anon) return null;
  const client = createClient(url, anon, { auth: { persistSession: false }, global: { headers: { Authorization: auth } } });
  const { data: found } = await client.auth.getUser(token);
  if (!found.user) return null;
  const { data: permitted } = await client.rpc("is_admin");
  return permitted === true ? found.user : null;
}
async function intake(req: Request) {
  const token = req.headers.get("x-intake-token") || "";
  if (!/^[A-Za-z0-9_-]{40,100}$/.test(token)) return null;
  const { data } = await service.from("client_intakes").select("id,client_name,status,current_step,data,expires_at,submitted_at,updated_at").eq("token_hash", await hash(token)).maybeSingle();
  if (!data || data.status === "disabled" || Date.parse(data.expires_at) < Date.now()) return null;
  return data;
}
function filename(value: string) {
  const ext = (value.match(/\.([a-zA-Z0-9]{1,8})$/) || [])[0] || "";
  const base = value.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "fichier";
  return base + ext.toLowerCase();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return reply(req, { error: "Méthode refusée" }, 405);
  try {
    if ((req.headers.get("content-type") || "").includes("multipart/form-data")) {
      const row = await intake(req);
      if (!row || row.status === "submitted") return reply(req, { error: "Lien invalide ou dossier fermé" }, 403);
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return reply(req, { error: "Fichier manquant" }, 400);
      const types = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"];
      if (!types.includes(file.type)) return reply(req, { error: "Utilisez JPG, PNG, WEBP, HEIC ou PDF." }, 415);
      if (!file.size || file.size > 12 * 1024 * 1024) return reply(req, { error: "Le fichier doit faire moins de 12 Mo." }, 413);
      const { count } = await service.from("client_intake_files").select("id", { count: "exact", head: true }).eq("intake_id", row.id);
      if ((count || 0) >= 80) return reply(req, { error: "Maximum de fichiers atteint." }, 409);
      const path = `${row.id}/${crypto.randomUUID()}-${filename(file.name)}`;
      const { error: uploadError } = await service.storage.from("client-intakes").upload(path, new Uint8Array(await file.arrayBuffer()), { contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: saved, error } = await service.from("client_intake_files").insert({ intake_id: row.id, storage_path: path, original_name: text(file.name, 180), mime_type: file.type, size_bytes: file.size, category: text(form.get("category"), 80) || "autre" }).select("id,original_name,mime_type,size_bytes,category,created_at").single();
      if (error) { await service.storage.from("client-intakes").remove([path]); throw error; }
      await service.from("client_intakes").update({ updated_at: new Date().toISOString() }).eq("id", row.id);
      return reply(req, { file: saved });
    }

    const raw = await req.text();
    if (raw.length > 2_000_000) return reply(req, { error: "Dossier trop volumineux" }, 413);
    const body = raw ? JSON.parse(raw) : {};
    const action = text(body.action, 40);
    if (action.startsWith("admin-")) {
      const user = await admin(req);
      if (!user) return reply(req, { error: "Accès administrateur requis" }, 403);
      if (action === "admin-create") {
        const clientName = text(body.clientName, 100);
        if (!clientName) return reply(req, { error: "Indiquez le nom du client" }, 400);
        const days = Math.max(1, Math.min(60, Number(body.validDays) || 14));
        const random = crypto.getRandomValues(new Uint8Array(32));
        const token = btoa(String.fromCharCode(...random)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        const { data, error } = await service.from("client_intakes").insert({ token_hash: await hash(token), client_name: clientName, client_phone: text(body.clientPhone, 30), expires_at: new Date(Date.now() + days * 86400000).toISOString(), created_by: user.id }).select("id,client_name,client_phone,status,current_step,expires_at,submitted_at,created_at,updated_at").single();
        if (error) throw error;
        return reply(req, { intake: data, token });
      }
      if (action === "admin-list") {
        const { data, error } = await service.from("client_intakes").select("id,client_name,client_phone,status,current_step,expires_at,submitted_at,created_at,updated_at").order("created_at", { ascending: false }).limit(100);
        if (error) throw error;
        return reply(req, { intakes: data || [] });
      }
      const id = text(body.id, 40);
      if (!/^[0-9a-f-]{36}$/i.test(id)) return reply(req, { error: "Dossier invalide" }, 400);
      if (action === "admin-renew") {
        const random = crypto.getRandomValues(new Uint8Array(32));
        const token = btoa(String.fromCharCode(...random)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        const { error } = await service.from("client_intakes").update({ token_hash: await hash(token), status: "draft", submitted_at: null, expires_at: new Date(Date.now() + 14 * 86400000).toISOString() }).eq("id", id);
        if (error) throw error;
        return reply(req, { token });
      }
      if (action === "admin-get") {
        const { data: dossier, error } = await service.from("client_intakes").select("*").eq("id", id).single();
        if (error) throw error;
        const { data: files } = await service.from("client_intake_files").select("id,storage_path,original_name,mime_type,size_bytes,category,created_at").eq("intake_id", id).order("created_at");
        const signed = [];
        for (const file of files || []) {
          const { data } = await service.storage.from("client-intakes").createSignedUrl(file.storage_path, 3600, { download: file.original_name });
          signed.push({ id: file.id, original_name: file.original_name, mime_type: file.mime_type, size_bytes: file.size_bytes, category: file.category, created_at: file.created_at, url: data?.signedUrl || "" });
        }
        return reply(req, { intake: dossier, files: signed });
      }
      if (action === "admin-status") {
        const status = ["draft", "submitted", "disabled"].includes(body.status) ? body.status : "draft";
        const { data, error } = await service.from("client_intakes").update({ status, submitted_at: status === "submitted" ? new Date().toISOString() : null }).eq("id", id).select().single();
        if (error) throw error;
        return reply(req, { intake: data });
      }
      return reply(req, { error: "Action inconnue" }, 400);
    }

    const row = await intake(req);
    if (!row) return reply(req, { error: "Ce lien est invalide ou a expiré." }, 403);
    if (action === "load") {
      const { data: files } = await service.from("client_intake_files").select("id,original_name,mime_type,size_bytes,category,created_at").eq("intake_id", row.id).order("created_at");
      return reply(req, { intake: row, files: files || [] });
    }
    if (row.status === "submitted") return reply(req, { error: "Ce dossier a déjà été envoyé." }, 409);
    if (action === "delete-file") {
      const fileId = text(body.fileId, 40);
      const { data: file } = await service.from("client_intake_files").select("id,storage_path").eq("id", fileId).eq("intake_id", row.id).maybeSingle();
      if (!file) return reply(req, { error: "Fichier introuvable" }, 404);
      await service.storage.from("client-intakes").remove([file.storage_path]);
      const { error } = await service.from("client_intake_files").delete().eq("id", file.id).eq("intake_id", row.id);
      if (error) throw error;
      return reply(req, { deleted: true });
    }
    if (action === "save") {
      if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return reply(req, { error: "Réponses invalides" }, 400);
      const step = Math.max(0, Math.min(9, Number(body.currentStep) || 0));
      const { data, error } = await service.from("client_intakes").update({ data: body.data, current_step: step, updated_at: new Date().toISOString() }).eq("id", row.id).select("updated_at").single();
      if (error) throw error;
      return reply(req, { savedAt: data.updated_at });
    }
    if (action === "submit") {
      const { data, error } = await service.from("client_intakes").update({ status: "submitted", submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", row.id).select("submitted_at").single();
      if (error) throw error;
      return reply(req, { submittedAt: data.submitted_at });
    }
    return reply(req, { error: "Action inconnue" }, 400);
  } catch (error) {
    console.error(error);
    return reply(req, { error: "Une erreur est survenue. Réessayez." }, 500);
  }
});
