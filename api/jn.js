export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const KEY = "mn9nk0ezvo8k986n";
  const API = "https://app.jobnimbus.com/api1";
  const H = { "Authorization": "Bearer " + KEY, "Content-Type": "application/json" };
  const action = req.query.action;

  try {
    if (action === "jobs") {
      const resp = await fetch(API + "/jobs?select=display_name,number,first_name,last_name,name,address_line1,city,state_text,zip,status_name,record_type_name&limit=1000&sort_field=date_updated&sort_direction=desc", { headers: H });
      const data = await resp.json();
      const jobs = (data.results || []).map(function(j) {
        var ownerName = [j.first_name, j.last_name].filter(Boolean).join(" ").trim();
        return {
          id: j.jnid,
          name: ownerName || j.name || j.display_name || "Untitled",
          jobName: j.display_name || j.number || "",
          number: j.number || "",
          address: [j.address_line1, j.city, j.state_text, j.zip].filter(Boolean).join(", "),
          status: j.status_name || "",
        };
      });
      return res.status(200).json({ jobs: jobs });
    }

    if (action === "contacts") {
      const resp = await fetch(API + "/contacts?select=display_name,first_name,last_name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc", { headers: H });
      const data = await resp.json();
      const contacts = (data.results || []).map(function(c) {
        return {
          id: c.jnid,
          name: c.display_name || ((c.first_name || "") + " " + (c.last_name || "")).trim() || "Untitled",
          address: [c.address_line1, c.city, c.state_text, c.zip].filter(Boolean).join(", "),
          status: c.status_name || "",
        };
      });
      return res.status(200).json({ contacts: contacts });
    }

    if (action === "upload" && req.method === "POST") {
      var body = req.body;
      if (!body || !body.relatedId || !body.htmlContent || !body.fileName) {
        return res.status(400).json({ error: "Missing fields" });
      }
      var plain = body.htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      if (plain.length > 4000) plain = plain.substring(0, 4000);
      var payload = {
        record_type_name: "Note",
        note: plain,
        primary: body.relatedId
      };
      var resp2 = await fetch(API + "/activities", {
        method: "POST",
        headers: H,
        body: JSON.stringify(payload),
      });
      if (!resp2.ok) {
        var errBody = await resp2.text();
        return res.status(resp2.status).json({ error: "JN error", status: resp2.status, details: errBody });
      }
      var result = await resp2.json();
      return res.status(200).json({ success: true, fileId: result.jnid || "ok" });
    }

    if (action === "delete" && req.method === "DELETE") {
      var delId = req.query.id;
      if (!delId || delId === "ok") return res.status(200).json({ success: true });
      await fetch(API + "/activities/" + delId, { method: "DELETE", headers: H });
      return res.status(200).json({ success: true });
    }

    if (action === "ping") {
      return res.status(200).json({ ok: true, time: new Date().toISOString() });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
