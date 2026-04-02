// /api/hover.js — Hover API integration for OAuth + Instant Design
// Env vars needed: HOVER_CLIENT_ID, HOVER_CLIENT_SECRET

const HOVER_API = "https://api.hover.to/api/v2";
const HOVER_AUTH = "https://hover.to/oauth/authorize";
const HOVER_TOKEN = "https://hover.to/oauth/token";
const REDIRECT_URI = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/hover?action=callback`
  : "https://roofus-materials-logan-9759s-projects.vercel.app/api/hover?action=callback";

// Supabase for token storage
const SB_URL = process.env.VITE_SUPABASE_URL || "https://bygvyzknybizrvvhdmdt.supabase.co";
const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";

async function sbGet(table, query) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" }
  });
  return r.ok ? await r.json() : [];
}
async function sbUpsert(table, data) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(data)
  });
  return r.ok ? await r.json() : null;
}

// Get stored tokens from Supabase
async function getTokens() {
  const rows = await sbGet("app_settings", "key=eq.hover_tokens&select=*");
  if (rows && rows.length > 0) {
    try { return JSON.parse(rows[0].value); } catch { return null; }
  }
  return null;
}

// Save tokens to Supabase
async function saveTokens(tokens) {
  await sbUpsert("app_settings", { key: "hover_tokens", value: JSON.stringify(tokens), updated_at: new Date().toISOString() });
}

// Refresh access token
async function refreshAccessToken(refreshToken) {
  const r = await fetch(HOVER_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.HOVER_CLIENT_ID,
      client_secret: process.env.HOVER_CLIENT_SECRET,
    })
  });
  if (!r.ok) return null;
  const data = await r.json();
  return data;
}

// Get a valid access token (refresh if needed)
async function getValidToken() {
  const tokens = await getTokens();
  if (!tokens) return null;

  // Check if access token is still valid (stored with expiry)
  if (tokens.expires_at && new Date(tokens.expires_at) > new Date()) {
    return tokens.access_token;
  }

  // Refresh the token
  if (tokens.refresh_token) {
    const newTokens = await refreshAccessToken(tokens.refresh_token);
    if (newTokens && newTokens.access_token) {
      const toSave = {
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token || tokens.refresh_token,
        expires_at: new Date(Date.now() + (newTokens.expires_in || 7200) * 1000).toISOString(),
      };
      await saveTokens(toSave);
      return newTokens.access_token;
    }
  }

  return null;
}

// Make authenticated Hover API call
async function hoverFetch(path, token) {
  const r = await fetch(`${HOVER_API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Hover API ${r.status}: ${err}`);
  }
  return await r.json();
}

module.exports = async function(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const action = req.query.action;

  try {
    // ─── AUTH URL ───
    if (action === "auth_url") {
      const clientId = process.env.HOVER_CLIENT_ID;
      if (!clientId) return res.status(500).json({ error: "HOVER_CLIENT_ID not set" });
      const url = `${HOVER_AUTH}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
      return res.json({ url, redirect_uri: REDIRECT_URI });
    }

    // ─── OAUTH CALLBACK ───
    if (action === "callback") {
      const code = req.query.code;
      if (!code) return res.status(400).send("Missing authorization code. <a href='/'>Go back</a>");

      const tokenRes = await fetch(HOVER_TOKEN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          client_id: process.env.HOVER_CLIENT_ID,
          client_secret: process.env.HOVER_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
        })
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        return res.status(400).send(`Token exchange failed: ${err}. <a href='/'>Go back</a>`);
      }

      const tokenData = await tokenRes.json();
      const toSave = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in || 7200) * 1000).toISOString(),
      };
      await saveTokens(toSave);

      // Redirect back to the app
      return res.redirect("/?hover=connected");
    }

    // ─── TOKEN STATUS ───
    if (action === "status") {
      const token = await getValidToken();
      return res.json({ connected: !!token });
    }

    // ─── LIST JOBS ───
    if (action === "jobs") {
      const token = await getValidToken();
      if (!token) return res.status(401).json({ error: "Not connected to Hover. Please authorize first." });
      const search = req.query.search || "";
      const page = req.query.page || 1;
      let path = `/jobs?per_page=20&page=${page}&state=complete`;
      if (search) path += `&search=${encodeURIComponent(search)}`;
      const data = await hoverFetch(path, token);
      return res.json(data);
    }

    // ─── JOB DETAILS ───
    if (action === "job") {
      const token = await getValidToken();
      if (!token) return res.status(401).json({ error: "Not connected" });
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: "Missing job id" });
      const data = await hoverFetch(`/jobs/${id}`, token);
      return res.json(data);
    }

    // ─── JOB PHOTOS ───
    if (action === "photos") {
      const token = await getValidToken();
      if (!token) return res.status(401).json({ error: "Not connected" });
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: "Missing job id" });
      const data = await hoverFetch(`/jobs/${id}/photos`, token);
      return res.json(data);
    }

    // ─── INSTANT DESIGN IMAGES ───
    if (action === "instant_designs") {
      const token = await getValidToken();
      if (!token) return res.status(401).json({ error: "Not connected" });
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: "Missing job id" });
      const data = await hoverFetch(`/jobs/${id}/instant_design_images`, token);
      return res.json(data);
    }

    // ─── PING ───
    if (action === "ping") {
      return res.json({ ok: true, version: "hover-v1", redirect_uri: REDIRECT_URI });
    }

    return res.status(400).json({ error: "Unknown action. Use: auth_url, callback, status, jobs, photos, instant_designs, ping" });

  } catch (err) {
    console.error("Hover API error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
