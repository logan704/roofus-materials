var https = require("https");

function jnRequest(method, path, bodyObj) {
  return new Promise(function(resolve, reject) {
    var data = bodyObj ? JSON.stringify(bodyObj) : null;
    var opts = {
      hostname: "app.jobnimbus.com",
      path: "/api1" + path,
      method: method,
      headers: {
        "Authorization": "Bearer mn9nk0ezvo8k986n",
        "Content-Type": "application/json"
      }
    };
    if (data) opts.headers["Content-Length"] = Buffer.byteLength(data);
    var r = https.request(opts, function(resp) {
      var buf = [];
      resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() {
        var txt = Buffer.concat(buf).toString();
        resolve({ code: resp.statusCode, body: txt });
      });
    });
    r.on("error", reject);
    if (data) r.write(data);
    r.end();
  });
}

function readBody(req) {
  return new Promise(function(resolve) {
    if (req.body && typeof req.body === "object" && req.body.fileName) {
      resolve(JSON.parse(JSON.stringify(req.body)));
      return;
    }
    if (req.body && typeof req.body === "string") {
      try { resolve(JSON.parse(req.body)); } catch(e) { resolve({}); }
      return;
    }
    var chunks = [];
    req.on("data", function(c) { chunks.push(c); });
    req.on("end", function() {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch(e) { resolve({}); }
    });
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
      var r1 = await jnRequest("GET", "/jobs?select=display_name,number,first_name,last_name,name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc");
      var d1 = JSON.parse(r1.body);
      return res.status(200).json({ jobs: (d1.results || []).map(function(j) {
        var own = [j.first_name, j.last_name].filter(Boolean).join(" ").trim();
        return { id: j.jnid, name: own || j.name || j.display_name || "Untitled", jobName: j.display_name || j.number || "", number: j.number || "", address: [j.address_line1, j.city, j.state_text, j.zip].filter(Boolean).join(", "), status: j.status_name || "" };
      })});
    }

    if (action === "contacts") {
      var r2 = await jnRequest("GET", "/contacts?select=display_name,first_name,last_name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc");
      var d2 = JSON.parse(r2.body);
      return res.status(200).json({ contacts: (d2.results || []).map(function(c) {
        return { id: c.jnid, name: c.display_name || ((c.first_name || "") + " " + (c.last_name || "")).trim() || "Untitled", address: [c.address_line1, c.city, c.state_text, c.zip].filter(Boolean).join(", "), status: c.status_name || "" };
      })});
    }

    if (action === "upload" && req.method === "POST") {
      var body = await readBody(req);
      if (!body.htmlContent || !body.fileName) {
        return res.status(400).json({ error: "Missing fields", keys: Object.keys(body) });
      }
      var plain = String(body.htmlContent).replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
      if (plain.length > 2000) plain = plain.substring(0, 2000);
      var fname = String(body.fileName).replace(".html", "");
      var rid = body.relatedId ? String(body.relatedId) : "";
      var jobName = body.jobName ? String(body.jobName) : "";
      var jobAddr = body.jobAddress ? String(body.jobAddress) : "";

      var noteObj = { record_type_name: "Note" };
      var noteText = "MATERIAL ORDER: " + fname + "\n";
      if (jobName) noteText += "Job: " + jobName + "\n";
      if (jobAddr) noteText += "Address: " + jobAddr + "\n";
      noteText += "\n" + plain;
      noteObj.note = noteText;
      if (rid) noteObj.primary = rid;

      var r3 = await jnRequest("POST", "/activities", noteObj);

      if (r3.code >= 200 && r3.code < 300) {
        var d3 = {};
        try { d3 = JSON.parse(r3.body); } catch(e) {}
        return res.status(200).json({ success: true, fileId: d3.jnid || "ok" });
      }

      // If primary caused failure, try without it
      if (rid) {
        delete noteObj.primary;
        var r4 = await jnRequest("POST", "/activities", noteObj);
        if (r4.code >= 200 && r4.code < 300) {
          var d4 = {};
          try { d4 = JSON.parse(r4.body); } catch(e) {}
          return res.status(200).json({ success: true, fileId: d4.jnid || "ok", linked: false });
        }
        return res.status(400).json({ error: "Failed both", e1: r3.body, e2: r4.body });
      }

      return res.status(400).json({ error: "Failed", detail: r3.body });
    }

    if (action === "delete" && req.method === "DELETE") {
      var did = req.query.id;
      if (!did || did === "ok") return res.status(200).json({ success: true });
      await jnRequest("DELETE", "/activities/" + did);
      return res.status(200).json({ success: true });
    }

    if (action === "ping") {
      return res.status(200).json({ ok: true, v: 8 });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
