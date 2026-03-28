var https = require("https");

var KEY = "mn9nk0ezvo8k986n";

function jnGet(path) {
  return new Promise(function(resolve, reject) {
    var opts = {
      hostname: "app.jobnimbus.com",
      path: "/api1" + path,
      method: "GET",
      headers: { "Authorization": "Bearer " + KEY, "Content-Type": "application/json" }
    };
    var r = https.request(opts, function(resp) {
      var buf = [];
      resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() {
        var txt = Buffer.concat(buf).toString();
        try { resolve(JSON.parse(txt)); } catch(e) { resolve({ raw: txt }); }
      });
    });
    r.on("error", reject);
    r.end();
  });
}

function jnUploadFile(fileBuffer, fileName, contentType, relatedId, description) {
  return new Promise(function(resolve, reject) {
    var boundary = "----RoofusUpload" + Date.now();
    var parts = [];

    // File part
    parts.push("--" + boundary);
    parts.push("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileName + "\"");
    parts.push("Content-Type: " + contentType);
    parts.push("");

    var headerBuf = Buffer.from(parts.join("\r\n") + "\r\n");
    var footerStr = "\r\n--" + boundary;

    // type part
    footerStr += "\r\nContent-Disposition: form-data; name=\"type\"\r\n\r\njob";
    // related part  
    footerStr += "\r\n--" + boundary;
    footerStr += "\r\nContent-Disposition: form-data; name=\"related\"\r\n\r\n" + relatedId;
    // description part
    if (description) {
      footerStr += "\r\n--" + boundary;
      footerStr += "\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\n" + description;
    }
    footerStr += "\r\n--" + boundary + "--\r\n";

    var footerBuf = Buffer.from(footerStr);
    var body = Buffer.concat([headerBuf, fileBuffer, footerBuf]);

    var opts = {
      hostname: "app.jobnimbus.com",
      path: "/api1/files",
      method: "POST",
      headers: {
        "Authorization": "Bearer " + KEY,
        "Content-Type": "multipart/form-data; boundary=" + boundary,
        "Content-Length": body.length
      }
    };

    var r = https.request(opts, function(resp) {
      var buf = [];
      resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() {
        var txt = Buffer.concat(buf).toString();
        resolve({ code: resp.statusCode, body: txt });
      });
    });
    r.on("error", reject);
    r.write(body);
    r.end();
  });
}

function jnDelete(path) {
  return new Promise(function(resolve, reject) {
    var opts = {
      hostname: "app.jobnimbus.com",
      path: "/api1" + path,
      method: "DELETE",
      headers: { "Authorization": "Bearer " + KEY, "Content-Type": "application/json" }
    };
    var r = https.request(opts, function(resp) {
      var buf = [];
      resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() { resolve({ code: resp.statusCode }); });
    });
    r.on("error", reject);
    r.end();
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

    if (action === "upload" && req.method === "POST") {
      var body = req.body;
      if (typeof body === "string") try { body = JSON.parse(body); } catch(e) { body = {}; }
      body = JSON.parse(JSON.stringify(body || {}));
      
      if (!body.htmlContent || !body.fileName || !body.relatedId) {
        return res.status(400).json({ error: "Missing fields", keys: Object.keys(body) });
      }

      var htmlBuffer = Buffer.from(body.htmlContent, "utf-8");
      var fname = String(body.fileName);
      var rid = String(body.relatedId);
      var desc = "Material Order - " + fname.replace(".html", "");

      var r3 = await jnUploadFile(htmlBuffer, fname, "text/html", rid, desc);

      if (r3.code >= 200 && r3.code < 300) {
        var d3 = {};
        try { d3 = JSON.parse(r3.body); } catch(e) {}
        return res.status(200).json({ success: true, fileId: d3.jnid || d3.id || "ok" });
      }

      return res.status(400).json({ error: "Upload failed", code: r3.code, details: r3.body });
    }

    if (action === "delete" && req.method === "DELETE") {
      var did = req.query.id;
      if (!did || did === "ok") return res.status(200).json({ success: true });
      await jnDelete("/files/" + did);
      return res.status(200).json({ success: true });
    }

    if (action === "ping") {
      return res.status(200).json({ ok: true, v: 9 });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
