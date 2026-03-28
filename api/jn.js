var https = require("https");
var KEY = "mn9nk0ezvo8k986n";
function jnGet(path) {
  return new Promise(function(resolve, reject) {
    var opts = { hostname: "app.jobnimbus.com", path: "/api1" + path, method: "GET",
      headers: { "Authorization": "Bearer " + KEY, "Content-Type": "application/json" } };
    var r = https.request(opts, function(resp) {
      var buf = []; resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() { try { resolve(JSON.parse(Buffer.concat(buf).toString())); } catch(e) { resolve({}); } });
    }); r.on("error", reject); r.end();
  });
}
function jnPost(path, data) {
  return new Promise(function(resolve, reject) {
    var payload = JSON.stringify(data);
    var opts = { hostname: "app.jobnimbus.com", path: "/api1" + path, method: "POST",
      headers: { "Authorization": "Bearer " + KEY, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) } };
    var r = https.request(opts, function(resp) {
      var buf = []; resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() { resolve({ code: resp.statusCode, body: Buffer.concat(buf).toString() }); });
    }); r.on("error", reject); r.write(payload); r.end();
  });
}
function jnDel(path) {
  return new Promise(function(resolve, reject) {
    var opts = { hostname: "app.jobnimbus.com", path: "/api1" + path, method: "DELETE",
      headers: { "Authorization": "Bearer " + KEY } };
    var r = https.request(opts, function(resp) { resp.on("data", function(){}); resp.on("end", function() { resolve({ code: resp.statusCode }); }); });
    r.on("error", reject); r.end();
  });
}
module.exports = async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  var action = req.query.action;
  try {
    if (action === "jobs") {
      var d1 = await jnGet("/jobs?select=display_name,number,first_name,last_name,name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc");
      return res.status(200).json({ jobs: (d1.results || []).map(function(j) {
        var own = [j.first_name, j.last_name].filter(Boolean).join(" ").trim();
        return { id: j.jnid, name: own || j.name || j.display_name || "Untitled", jobName: j.display_name || j.number || "", number: j.number || "", address: [j.address_line1, j.city, j.state_text, j.zip].filter(Boolean).join(", "), status: j.status_name || "" };
      })});
    }
    if (action === "contacts") {
      var d2 = await jnGet("/contacts?select=display_name,first_name,last_name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc");
      return res.status(200).json({ contacts: (d2.results || []).map(function(c) {
        return { id: c.jnid, name: c.display_name || ((c.first_name || "") + " " + (c.last_name || "")).trim() || "Untitled", address: [c.address_line1, c.city, c.state_text, c.zip].filter(Boolean).join(", "), status: c.status_name || "" };
      })});
    }
    if (action === "testupload") {
      var testHtml = "<html><body><h1>Roofus Test v24</h1><p>" + new Date().toISOString() + "</p></body></html>";
      var testB64 = Buffer.from(testHtml).toString("base64");
      var jobId = "d6d7b2c344ac43b5bd81b60d19e0e1f5";
      var r1 = await jnPost("/files", {
        data: testB64,
        filename: "test-v24-linked.html",
        type: 10,
        description: "Test with typed related and primary",
        primary: { id: jobId, type: "job" },
        related: [{ id: jobId, type: "job" }]
      });
      return res.status(200).json({ code: r1.code, body: r1.body });
    }
    if (action === "upload" && req.method === "POST") {
      var body = JSON.parse(JSON.stringify(req.body || {}));
      if (!body.htmlContent || !body.fileName || !body.relatedId) return res.status(400).json({ error: "Missing fields" });
      var b64 = Buffer.from(String(body.htmlContent)).toString("base64");
      var r3 = await jnPost("/files", {
        data: b64,
        filename: String(body.fileName),
        type: 10,
        description: body.description || "Material Order - Roofus Construction",
        primary: { id: String(body.relatedId), type: "job" },
        related: [{ id: String(body.relatedId), type: "job" }]
      });
      if (r3.code >= 200 && r3.code < 300) {
        var d3 = {}; try { d3 = JSON.parse(r3.body); } catch(e) {}
        return res.status(200).json({ success: true, fileId: d3.jnid || d3.id || "ok" });
      }
      return res.status(400).json({ error: "Upload failed", code: r3.code, details: r3.body });
    }
    if (action === "delete" && req.method === "DELETE") {
      var did = req.query.id; if (!did || did === "ok") return res.status(200).json({ success: true });
      await jnDel("/files/" + did); return res.status(200).json({ success: true });
    }
    if (action === "ping") return res.status(200).json({ ok: true, v: 24 });
    return res.status(400).json({ error: "Unknown action" });
  } catch (err) { return res.status(500).json({ error: err.message }); }
};
