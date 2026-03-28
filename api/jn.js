var https = require("https");
var KEY = "mn9nk0ezvo8k986n";

function jnGet(path) {
  return new Promise(function(resolve, reject) {
    var opts = {
      hostname: "app.jobnimbus.com", path: "/api1" + path, method: "GET",
      headers: { "Authorization": "Bearer " + KEY, "Content-Type": "application/json" }
    };
    var r = https.request(opts, function(resp) {
      var buf = [];
      resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() { try { resolve(JSON.parse(Buffer.concat(buf).toString())); } catch(e) { resolve({}); } });
    });
    r.on("error", reject);
    r.end();
  });
}

function jnPost(path, bodyObj) {
  return new Promise(function(resolve, reject) {
    var data = JSON.stringify(bodyObj);
    var opts = {
      hostname: "app.jobnimbus.com", path: "/api1" + path, method: "POST",
      headers: { "Authorization": "Bearer " + KEY, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) }
    };
    var r = https.request(opts, function(resp) {
      var buf = [];
      resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() { resolve({ code: resp.statusCode, body: Buffer.concat(buf).toString() }); });
    });
    r.on("error", reject);
    r.write(data);
    r.end();
  });
}

function jnDel(path) {
  return new Promise(function(resolve, reject) {
    var opts = {
      hostname: "app.jobnimbus.com", path: "/api1" + path, method: "DELETE",
      headers: { "Authorization": "Bearer " + KEY }
    };
    var r = https.request(opts, function(resp) {
      resp.on("data", function() {});
      resp.on("end", function() { resolve({ code: resp.statusCode }); });
    });
    r.on("error", reject);
    r.end();
  });
}

function uploadMultipart(fileContent, fileName, relatedId) {
  return new Promise(function(resolve, reject) {
    var boundary = "----Roofus" + Date.now();
    var crlf = "\r\n";
    var parts = [];

    // file field
    parts.push("--" + boundary + crlf);
    parts.push("Content-Disposition: form-data; name=\"file\"; filename=\"" + fileName + "\"" + crlf);
    parts.push("Content-Type: text/html" + crlf + crlf);
    parts.push(fileContent);
    parts.push(crlf);

    // related field
    parts.push("--" + boundary + crlf);
    parts.push("Content-Disposition: form-data; name=\"related\"" + crlf + crlf);
    parts.push(relatedId);
    parts.push(crlf);

    // description field
    parts.push("--" + boundary + crlf);
    parts.push("Content-Disposition: form-data; name=\"description\"" + crlf + crlf);
    parts.push("Material Order - " + fileName);
    parts.push(crlf);

    parts.push("--" + boundary + "--" + crlf);

    var bodyStr = parts.join("");
    var bodyBuf = Buffer.from(bodyStr, "utf-8");

    var opts = {
      hostname: "app.jobnimbus.com",
      path: "/api1/files",
      method: "POST",
      headers: {
        "Authorization": "Bearer " + KEY,
        "Content-Type": "multipart/form-data; boundary=" + boundary,
        "Content-Length": bodyBuf.length
      }
    };

    var r = https.request(opts, function(resp) {
      var buf = [];
      resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() { resolve({ code: resp.statusCode, body: Buffer.concat(buf).toString() }); });
    });
    r.on("error", reject);
    r.write(bodyBuf);
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
      var body = JSON.parse(JSON.stringify(req.body || {}));
      if (!body.htmlContent || !body.fileName || !body.relatedId) {
        return res.status(400).json({ error: "Missing fields" });
      }

      // Keep HTML short - strip to essentials
      var html = String(body.htmlContent);
      if (html.length > 50000) html = html.substring(0, 50000);
      var fname = String(body.fileName);
      var rid = String(body.relatedId);

      var r1 = await uploadMultipart(html, fname, rid);

      if (r1.code >= 200 && r1.code < 300) {
        var d1r = {}; try { d1r = JSON.parse(r1.body); } catch(e) {}
        return res.status(200).json({ success: true, fileId: d1r.jnid || d1r.id || "ok", method: "file_upload" });
      }

      // Fallback: unlinked activity note
      var plain = html.replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
      if (plain.length > 2000) plain = plain.substring(0, 2000);
      var r2 = await jnPost("/activities", {
        record_type_name: "Note",
        note: "MATERIAL ORDER: " + fname.replace(".html", "") + "\nJob ID: " + rid + "\n\n" + plain
      });
      if (r2.code >= 200 && r2.code < 300) {
        var d2r = {}; try { d2r = JSON.parse(r2.body); } catch(e) {}
        return res.status(200).json({ success: true, fileId: d2r.jnid || "ok", method: "note_fallback" });
      }

      return res.status(400).json({ error: "All failed", file_upload: { code: r1.code, body: r1.body }, note: { code: r2.code, body: r2.body } });
    }

    if (action === "delete" && req.method === "DELETE") {
      var did = req.query.id;
      if (!did || did === "ok") return res.status(200).json({ success: true });
      await jnDel("/files/" + did).catch(function(){});
      await jnDel("/activities/" + did).catch(function(){});
      return res.status(200).json({ success: true });
    }

    // Test file upload with tiny content
    if (action === "testfile") {
      var testId = req.query.jobid || "d6d7b2c344ac43b5bd81b60d19e0e1f5";
      var testHtml = "<html><body><h1>Test from Roofus Portal</h1><p>" + new Date().toISOString() + "</p></body></html>";
      var r = await uploadMultipart(testHtml, "test-order.html", testId);
      return res.status(200).json({ code: r.code, body: r.body });
    }

    if (action === "ping") {
      return res.status(200).json({ ok: true, v: 11 });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
