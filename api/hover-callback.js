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
module.exports = function(req, res) {
  var code = (req.query || {}).code || "";
  if (!code) { res.status(400).send("Missing code. <a href='/'>Go back</a>"); return; }
  var b = JSON.stringify({ grant_type: "authorization_code", code: code,
    client_id: process.env.HOVER_CLIENT_ID, client_secret: process.env.HOVER_CLIENT_SECRET,
    redirect_uri: REDIR });
  hr({ hostname: "hover.to", path: "/oauth/token", method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(b) } }, b).then(function(r) {
    var d = null;
    try { d = JSON.parse(r.body); } catch(e) {}
    if (!d || !d.access_token) { res.status(400).send("Token exchange failed: " + r.body + " <a href='/'>Go back</a>"); return; }
    var tok = JSON.stringify({ access_token: d.access_token, refresh_token: d.refresh_token,
      expires_at: new Date(Date.now() + 7200000).toISOString() });
    var sb = JSON.stringify({ key: "hover_tokens", value: tok, updated_at: new Date().toISOString() });
    hr({ hostname: SB_HOST, path: "/rest/v1/app_settings", method: "POST",
      headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation", "Content-Length": Buffer.byteLength(sb) } }, sb).then(function() {
      res.writeHead(302, { Location: "/?hover=connected" }); res.end();
    });
  }).catch(function(e) { res.status(500).send("Error: " + e.message); });
};
