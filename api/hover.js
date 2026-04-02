var https = require("https");
var SB_HOST = "bygvyzknybizrvvhdmdt.supabase.co";
var SB_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";
var REDIRECT_URI = "https://roofus-materials-logan-9759s-projects.vercel.app/api/hover?action=callback";
function httpReq(opts, postData) {
  return new Promise(function(resolve, reject) {
    var req = https.request(opts, function(res) {
      var chunks = [];
      res.on("data", function(c) { chunks.push(c); });
      res.on("end", function() { resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }); });
    });
    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}
function sbGet(table, query) {
  return httpReq({ hostname: SB_HOST, path: "/rest/v1/" + table + "?" + query, method: "GET",
    headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Content-Type": "application/json" }
  }).then(function(r) { try { return JSON.parse(r.body); } catch(e) { return []; } });
}
function sbUpsert(table, data) {
  var body = JSON.stringify(data);
  return httpReq({ hostname: SB_HOST, path: "/rest/v1/" + table, method: "POST",
    headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation", "Content-Length": Buffer.byteLength(body) }
  }, body);
}
function getTokens() {
  return sbGet("app_settings", "key=eq.hover_tokens&select=*").then(function(rows) {
    if (rows && rows.length > 0) { try { return JSON.parse(rows[0].value); } catch(e) { return null; } }
    return null;
  });
}
function saveTokens(tokens) { return sbUpsert("app_settings", { key: "hover_tokens", value: JSON.stringify(tokens), updated_at: new Date().toISOString() }); }
function hoverTokenExchange(bodyObj) {
  var body = JSON.stringify(bodyObj);
  return httpReq({ hostname: "hover.to", path: "/oauth/token", method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
  }, body).then(function(r) { try { return JSON.parse(r.body); } catch(e) { return null; } });
}
function getValidToken() {
  return getTokens().then(function(tokens) {
    if (!tokens) return null;
    if (tokens.expires_at && new Date(tokens.expires_at) > new Date()) return tokens.access_token;
    if (!tokens.refresh_token) return null;
    return hoverTokenExchange({ grant_type: "refresh_token", refresh_token: tokens.refresh_token,
      client_id: process.env.HOVER_CLIENT_ID, client_secret: process.env.HOVER_CLIENT_SECRET
    }).then(function(d) {
      if (d && d.access_token) {
        var s = { access_token: d.access_token, refresh_token: d.refresh_token || tokens.refresh_token, expires_at: new Date(Date.now() + (d.expires_in || 7200) * 1000).toISOString() };
        return saveTokens(s).then(function() { return d.access_token; });
      }
      return null;
    });
  });
}
function hoverGet(path, token) {
  return httpReq({ hostname: "api.hover.to", path: "/api/v2" + path, method: "GET",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" }
  }).then(function(r) { try { return JSON.parse(r.body); } catch(e) { return { error: r.body }; } });
}
module.exports = function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  var action = req.query.action;
  if (action === "ping") return res.status(200).json({ ok: true, v: 3 });
  if (action === "auth_url") {
    var cid = process.env.HOVER_CLIENT_ID;
    if (!cid) return res.status(500).json({ error: "HOVER_CLIENT_ID not set" });
    return res.json({ url: "https://hover.to/oauth/authorize?response_type=code&client_id=" + cid + "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) });
  }
  if (action === "callback") {
    var code = req.query.code;
    if (!code) return res.status(400).send("Missing code");
    hoverTokenExchange({ grant_type: "authorization_code", code: code, client_id: process.env.HOVER_CLIENT_ID, client_secret: process.env.HOVER_CLIENT_SECRET, redirect_uri: REDIRECT_URI
    }).then(function(d) {
      if (!d || !d.access_token) return res.status(400).send("Token exchange failed: " + JSON.stringify(d));
      return saveTokens({ access_token: d.access_token, refresh_token: d.refresh_token, expires_at: new Date(Date.now() + (d.expires_in || 7200) * 1000).toISOString() }).then(function() {
        res.writeHead(302, { Location: "/?hover=connected" }); res.end();
      });
    }).catch(function(e) { res.status(500).json({ error: e.message }); });
    return;
  }
  if (action === "status") {
    getValidToken().then(function(t) { res.json({ connected: !!t }); }).catch(function() { res.json({ connected: false }); });
    return;
  }
  if (action === "jobs") {
    getValidToken().then(function(t) {
      if (!t) return res.status(401).json({ error: "Not connected" });
      var s = req.query.search || "";
      return hoverGet("/jobs?per_page=20&state=complete" + (s ? "&search=" + encodeURIComponent(s) : ""), t).then(function(d) { res.json(d); });
    }).catch(function(e) { res.status(500).json({ error: e.message }); });
    return;
  }
  if (action === "photos") {
    getValidToken().then(function(t) {
      if (!t) return res.status(401).json({ error: "Not connected" });
      if (!req.query.id) return res.status(400).json({ error: "Missing id" });
      return hoverGet("/jobs/" + req.query.id + "/photos", t).then(function(d) { res.json(d); });
    }).catch(function(e) { res.status(500).json({ error: e.message }); });
    return;
  }
  if (action === "instant_designs") {
    getValidToken().then(function(t) {
      if (!t) return res.status(401).json({ error: "Not connected" });
      if (!req.query.id) return res.status(400).json({ error: "Missing id" });
      return hoverGet("/jobs/" + req.query.id + "/instant_design_images", t).then(function(d) { res.json(d); });
    }).catch(function(e) { res.status(500).json({ error: e.message }); });
    return;
  }
  res.status(400).json({ error: "Unknown action" });
};
