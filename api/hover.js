var https = require("https");
var SB_HOST = "bygvyzknybizrvvhdmdt.supabase.co";
var SB_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";
var REDIR = "https://roofus-materials-logan-9759s-projects.vercel.app/api/hover-callback";

function hr(opts, pd) {
  return new Promise(function(ok, no) {
    var r = https.request(opts, function(s) {
      var c = [];
      s.on("data", function(d) { c.push(d); });
      s.on("end", function() { ok({ status: s.statusCode, body: Buffer.concat(c).toString() }); });
    });
    r.on("error", no);
    if (pd) r.write(pd);
    r.end();
  });
}

function sbg(t, q) {
  return hr({ hostname: SB_HOST, path: "/rest/v1/" + t + "?" + q, method: "GET",
    headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY } }).then(function(r) {
    try { return JSON.parse(r.body); } catch(e) { return []; }
  });
}

function sbu(t, d) {
  var b = JSON.stringify(d);
  return hr({ hostname: SB_HOST, path: "/rest/v1/" + t, method: "POST",
    headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation", "Content-Length": Buffer.byteLength(b) } }, b);
}

function getTok() {
  return sbg("app_settings", "key=eq.hover_tokens&select=*").then(function(rows) {
    if (rows && rows.length > 0) { try { return JSON.parse(rows[0].value); } catch(e) {} }
    return null;
  });
}

function saveTok(t) {
  return sbu("app_settings", { key: "hover_tokens", value: JSON.stringify(t), updated_at: new Date().toISOString() });
}

function texch(b) {
  var s = JSON.stringify(b);
  return hr({ hostname: "hover.to", path: "/oauth/token", method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(s) } }, s).then(function(r) {
    try { return JSON.parse(r.body); } catch(e) { return null; }
  });
}

function validTok() {
  return getTok().then(function(t) {
    if (!t) return null;
    if (t.expires_at && new Date(t.expires_at) > new Date()) return t.access_token;
    if (!t.refresh_token) return null;
    return texch({ grant_type: "refresh_token", refresh_token: t.refresh_token,
      client_id: process.env.HOVER_CLIENT_ID, client_secret: process.env.HOVER_CLIENT_SECRET }).then(function(n) {
      if (n && n.access_token) {
        var sv = { access_token: n.access_token, refresh_token: n.refresh_token || t.refresh_token,
          expires_at: new Date(Date.now() + 7200000).toISOString() };
        return saveTok(sv).then(function() { return n.access_token; });
      }
      return null;
    });
  });
}

function hget(p, tok) {
  return hr({ hostname: "api.hover.to", path: "/api/v2" + p, method: "GET",
    headers: { Authorization: "Bearer " + tok, Accept: "application/json" } }).then(function(r) {
    try { return JSON.parse(r.body); } catch(e) { return {}; }
  });
}

module.exports = function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  var a = (req.query || {}).action || "";

  if (a === "ping") { res.status(200).json({ ok: true, v: 4 }); return; }

  if (a === "status") {
    validTok().then(function(t) {
      res.status(200).json({ connected: t ? true : false });
    }).catch(function() {
      res.status(200).json({ connected: false });
    });
    return;
  }

  if (a === "auth_url") {
    var cid = process.env.HOVER_CLIENT_ID || "";
    if (!cid) { res.status(500).json({ error: "No client ID" }); return; }
    res.status(200).json({ url: "https://hover.to/oauth/authorize?response_type=code&client_id=" + cid + "&redirect_uri=" + encodeURIComponent(REDIR) });
    return;
  }

  if (a === "callback") {
    var code = (req.query || {}).code || "";
    if (!code) { res.status(400).send("Missing code"); return; }
    texch({ grant_type: "authorization_code", code: code,
      client_id: process.env.HOVER_CLIENT_ID, client_secret: process.env.HOVER_CLIENT_SECRET,
      redirect_uri: REDIR }).then(function(d) {
      if (!d || !d.access_token) { res.status(400).send("Failed: " + JSON.stringify(d)); return; }
      saveTok({ access_token: d.access_token, refresh_token: d.refresh_token,
        expires_at: new Date(Date.now() + 7200000).toISOString() }).then(function() {
        res.writeHead(302, { Location: "/?hover=connected" });
        res.end();
      });
    }).catch(function(e) { res.status(500).send("Error: " + e.message); });
    return;
  }

  if (a === "jobs") {
    validTok().then(function(t) {
      if (!t) { res.status(401).json({ error: "Not connected" }); return; }
      var q = (req.query || {}).search || "";
      var p = "/jobs?per_page=20&state=complete" + (q ? "&search=" + encodeURIComponent(q) : "");
      hget(p, t).then(function(d) { res.status(200).json(d); });
    }).catch(function(e) { res.status(500).json({ error: e.message }); });
    return;
  }

  if (a === "photos") {
    validTok().then(function(t) {
      if (!t) { res.status(401).json({ error: "Not connected" }); return; }
      var id = (req.query || {}).id || "";
      if (!id) { res.status(400).json({ error: "Missing id" }); return; }
      hget("/jobs/" + id + "/photos", t).then(function(d) { res.status(200).json(d); });
    }).catch(function(e) { res.status(500).json({ error: e.message }); });
    return;
  }

  if (a === "instant_designs") {
    validTok().then(function(t) {
      if (!t) { res.status(401).json({ error: "Not connected" }); return; }
      var id = (req.query || {}).id || "";
      if (!id) { res.status(400).json({ error: "Missing id" }); return; }
      hget("/jobs/" + id + "/instant_design_images", t).then(function(d) { res.status(200).json(d); });
    }).catch(function(e) { res.status(500).json({ error: e.message }); });
    return;
  }

  res.status(400).json({ error: "Unknown action: " + a });
};
