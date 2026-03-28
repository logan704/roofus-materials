var https = require("https");

function jnPost(path, bodyObj) {
  return new Promise(function(resolve, reject) {
    var data = JSON.stringify(bodyObj);
    var opts = {
      hostname: "app.jobnimbus.com",
      path: "/api1" + path,
      method: "POST",
      headers: {
        "Authorization": "Bearer mn9nk0ezvo8k986n",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
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
    r.write(data);
    r.end();
  });
}

function jnGet(path) {
  return new Promise(function(resolve, reject) {
    var opts = {
      hostname: "app.jobnimbus.com",
      path: "/api1" + path,
      method: "GET",
      headers: {
        "Authorization": "Bearer mn9nk0ezvo8k986n",
        "Content-Type": "application/json"
      }
    };
    var r = https.request(opts, function(resp) {
      var buf = [];
      resp.on("data", function(c) { buf.push(c); });
      resp.on("end", function() {
        var txt = Buffer.concat(buf).toString();
        try { resolve(JSON.parse(txt)); } catch(e) { resolve(txt); }
      });
    });
    r.on("error", reject);
    r.end();
  });
}

function jnDel(path) {
  return new Promise(function(resolve, reject) {
    var opts = {
      hostname: "app.jobnimbus.com",
      path: "/api1" + path,
      method: "DELETE",
      headers: {
        "Authorization": "Bearer mn9nk0ezvo8k986n",
        "Content-Type": "application/json"
      }
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
      if (!body || !body.relatedId || !body.htmlContent || !body.fileName) {
        return res.status(400).json({ error: "Missing fields" });
      }
      var plain = String(body.htmlContent).replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
      if (plain.length > 2000) plain = plain.substring(0, 2000);
      var rid = String(body.relatedId);
      var fname = String(body.fileName).replace(".html", "");

      // Try activity with primary as the related job
      var r3 = await jnPost("/activities", {
        record_type_name: "Note",
        note: fname + "\n\n" + plain,
        primary: rid
      });

      if (r3.code >= 200 && r3.code < 300) {
        var d3 = {};
        try { d3 = JSON.parse(r3.body); } catch(e) {}
        return res.status(200).json({ success: true, fileId: d3.jnid || "ok" });
      }

      // If that failed, try without primary (unlinked note)
      var r4 = await jnPost("/activities", {
        record_type_name: "Note",
        note: "Job: " + rid + "\n" + fname + "\n\n" + plain
      });

      if (r4.code >= 200 && r4.code < 300) {
        var d4 = {};
        try { d4 = JSON.parse(r4.body); } catch(e) {}
        return res.status(200).json({ success: true, fileId: d4.jnid || "ok", linked: false });
      }

      return res.status(400).json({ error: "Failed", attempt1: r3.body, attempt2: r4.body, id: rid });
    }

    if (action === "delete" && req.method === "DELETE") {
      var did = req.query.id;
      if (!did || did === "ok") return res.status(200).json({ success: true });
      await jnDel("/activities/" + did);
      return res.status(200).json({ success: true });
    }

    // Debug: test creating a simple note
    if (action === "test") {
      var r5 = await jnPost("/activities", {
        record_type_name: "Note",
        note: "Test from Roofus Portal at " + new Date().toISOString()
      });
      return res.status(200).json({ code: r5.code, response: r5.body });
    }

    if (action === "ping") {
      return res.status(200).json({ ok: true, v: 6 });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
