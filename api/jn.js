export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  var KEY = "mn9nk0ezvo8k986n";
  var API = "https://app.jobnimbus.com/api1";
  var action = req.query.action;

  function makeHeaders() {
    return { "Authorization": "Bearer " + KEY, "Content-Type": "application/json" };
  }

  try {
    if (action === "jobs") {
      var r1 = await fetch(API + "/jobs?select=display_name,number,first_name,last_name,name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc", { headers: makeHeaders() });
      var d1 = await r1.json();
      return res.status(200).json({ jobs: (d1.results || []).map(function(j) {
        var own = [j.first_name, j.last_name].filter(Boolean).join(" ").trim();
        return { id: j.jnid, name: own || j.name || j.display_name || "Untitled", jobName: j.display_name || j.number || "", number: j.number || "", address: [j.address_line1, j.city, j.state_text, j.zip].filter(Boolean).join(", "), status: j.status_name || "" };
      })});
    }

    if (action === "contacts") {
      var r2 = await fetch(API + "/contacts?select=display_name,first_name,last_name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc", { headers: makeHeaders() });
      var d2 = await r2.json();
      return res.status(200).json({ contacts: (d2.results || []).map(function(c) {
        return { id: c.jnid, name: c.display_name || ((c.first_name || "") + " " + (c.last_name || "")).trim() || "Untitled", address: [c.address_line1, c.city, c.state_text, c.zip].filter(Boolean).join(", "), status: c.status_name || "" };
      })});
    }

    if (action === "upload" && req.method === "POST") {
      var body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch(e) { body = {}; } }
      if (!body || !body.relatedId || !body.htmlContent || !body.fileName) {
        return res.status(400).json({ error: "Missing fields", keys: Object.keys(body || {}) });
      }
      var plain = String(body.htmlContent).replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
      if (plain.length > 3000) plain = plain.substring(0, 3000);
      var rid = String(body.relatedId);

      var r3 = await fetch(API + "/activities", {
        method: "POST",
        headers: makeHeaders(),
        body: JSON.stringify({ record_type_name: "Note", note: plain, primary: rid }),
      });
      if (r3.ok) {
        var d3 = await r3.json();
        return res.status(200).json({ success: true, fileId: d3.jnid || "ok" });
      }
      var e3 = await r3.text();

      // Fallback: try tasks
      var r4 = await fetch(API + "/tasks", {
        method: "POST",
        headers: makeHeaders(),
        body: JSON.stringify({ record_type_name: "Task", description: plain, title: String(body.fileName).replace(".html",""), primary: rid, is_completed: true }),
      });
      if (r4.ok) {
        var d4 = await r4.json();
        return res.status(200).json({ success: true, fileId: d4.jnid || "ok" });
      }
      var e4 = await r4.text();

      return res.status(400).json({ error: "Both failed", a: e3, t: e4, id: rid });
    }

    if (action === "delete" && req.method === "DELETE") {
      var did = req.query.id;
      if (!did || did === "ok") return res.status(200).json({ success: true });
      try { await fetch(API + "/activities/" + did, { method: "DELETE", headers: makeHeaders() }); } catch(ex){}
      try { await fetch(API + "/tasks/" + did, { method: "DELETE", headers: makeHeaders() }); } catch(ex){}
      return res.status(200).json({ success: true });
    }

    if (action === "ping") {
      return res.status(200).json({ ok: true, v: 4, time: new Date().toISOString() });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
