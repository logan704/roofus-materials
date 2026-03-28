const https = require("https");

function jnRequest(method, path, body) {
  return new Promise(function(resolve, reject) {
    var postData = body ? JSON.stringify(body) : null;
    var options = {
      hostname: "app.jobnimbus.com",
      path: "/api1" + path,
      method: method,
      headers: {
        "Authorization": "Bearer mn9nk0ezvo8k986n",
        "Content-Type": "application/json",
      },
    };
    if (postData) {
      options.headers["Content-Length"] = Buffer.byteLength(postData);
    }
    var req = https.request(options, function(resp) {
      var chunks = [];
      resp.on("data", function(c) { chunks.push(c); });
      resp.on("end", function() {
        var raw = Buffer.concat(chunks).toString();
        try { resolve({ status: resp.statusCode, data: JSON.parse(raw) }); }
        catch(e) { resolve({ status: resp.statusCode, data: raw }); }
      });
    });
    req.on("error", function(e) { reject(e); });
    if (postData) req.write(postData);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  var action = req.query.action;

  try {
    if (action === "jobs") {
      var r1 = await jnRequest("GET", "/jobs?select=display_name,number,first_name,last_name,name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc");
      var jobs = (r1.data.results || []).map(function(j) {
        var own = [j.first_name, j.last_name].filter(Boolean).join(" ").trim();
        return { id: j.jnid, name: own || j.name || j.display_name || "Untitled", jobName: j.display_name || j.number || "", number: j.number || "", address: [j.address_line1, j.city, j.state_text, j.zip].filter(Boolean).join(", "), status: j.status_name || "" };
      });
      return res.status(200).json({ jobs: jobs });
    }

    if (action === "contacts") {
      var r2 = await jnRequest("GET", "/contacts?select=display_name,first_name,last_name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc");
      var contacts = (r2.data.results || []).map(function(c) {
        return { id: c.jnid, name: c.display_name || ((c.first_name || "") + " " + (c.last_name || "")).trim() || "Untitled", address: [c.address_line1, c.city, c.state_text, c.zip].filter(Boolean).join(", "), status: c.status_name || "" };
      });
      return res.status(200).json({ contacts: contacts });
    }

    if (action === "upload" && req.method === "POST") {
      var body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch(e) { body = {}; } }
      if (!body || !body.relatedId || !body.htmlContent || !body.fileName) {
        return res.status(400).json({ error: "Missing fields" });
      }
      var plain = String(body.htmlContent).replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
      if (plain.length > 3000) plain = plain.substring(0, 3000);

      var r3 = await jnRequest("POST", "/activities", {
        record_type_name: "Note",
        note: plain,
        primary: String(body.relatedId)
      });

      if (r3.status >= 200 && r3.status < 300) {
        return res.status(200).json({ success: true, fileId: (r3.data && r3.data.jnid) || "ok" });
      }

      // Fallback: try tasks
      var r4 = await jnRequest("POST", "/tasks", {
        record_type_name: "Task",
        description: plain,
        title: String(body.fileName).replace(".html", ""),
        primary: String(body.relatedId),
        is_completed: true
      });

      if (r4.status >= 200 && r4.status < 300) {
        return res.status(200).json({ success: true, fileId: (r4.data && r4.data.jnid) || "ok" });
      }

      return res.status(400).json({ error: "Both failed", activities: r3.data, tasks: r4.data, id: String(body.relatedId) });
    }

    if (action === "delete" && req.method === "DELETE") {
      var did = req.query.id;
      if (!did || did === "ok") return res.status(200).json({ success: true });
      try { await jnRequest("DELETE", "/activities/" + did); } catch(ex){}
      try { await jnRequest("DELETE", "/tasks/" + did); } catch(ex){}
      return res.status(200).json({ success: true });
    }

    if (action === "ping") {
      return res.status(200).json({ ok: true, v: 5, time: new Date().toISOString() });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
