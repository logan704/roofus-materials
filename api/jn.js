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
      var body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || !body.relatedId || !body.htmlContent || !body.fileName) {
        return res.status(400).json({ error: "Missing fields", body: Object.keys(body || {}) });
      }
      // Strip HTML to plain text
      var plain = String(body.htmlContent).replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
      if (plain.length > 3000) plain = plain.substring(0, 3000);

      // Try creating a task/note on the job
      var postBody = JSON.stringify({
        record_type_name: "Note",
        note: plain,
        primary: String(body.relatedId)
      });

      var resp2 = await fetch(API + "/activities", {
        method: "POST",
        headers: H,
        body: postBody,
      });

      // If activities fails, try tasks endpoint
      if (!resp2.ok) {
        var errText1 = await resp2.text();
        // Try as a task instead
        var postBody2 = JSON.stringify({
          record_type_name: "Task",
          description: plain,
          title: String(body.fileName).replace(".html", ""),
          primary: String(body.relatedId),
          is_completed: true
        });
        var resp3 = await fetch(API + "/tasks", {
          method: "POST",
          headers: H,
          body: postBody2,
        });
        if (!resp3.ok) {
          var errText2 = await resp3.text();
          return res.status(400).json({
            error: "Both endpoints failed",
            activities_error: errText1,
            tasks_error: errText2,
            sent_id: String(body.relatedId),
          });
        }
        var result2 = await resp3.json();
        return res.status(200).json({ success: true, fileId: result2.jnid || "ok", method: "task" });
      }

      var result = await resp2.json();
      return res.status(200).json({ success: true, fileId: result.jnid || "ok", method: "activity" });
    }

    if (action === "delete" && req.method === "DELETE") {
      var delId = req.query.id;
      if (!delId || delId === "ok") return res.status(200).json({ success: true });
      // Try both endpoints
      await fetch(API + "/activities/" + delId, { method: "DELETE", headers: H }).catch(function(){});
      await fetch(API + "/tasks/" + delId, { method: "DELETE", headers: H }).catch(function(){});
      return res.status(200).json({ success: true });
    }

    if (action === "ping") {
      return res.status(200).json({ ok: true, v: 3, time: new Date().toISOString() });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
