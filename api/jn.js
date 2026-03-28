// Vercel Serverless Function — JobNimbus API Proxy
const JN_KEY = "mn9nk0ezvo8k986n";
const BASE = "https://app.jobnimbus.com/api1";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { action, id, jobId } = req.query;
  const headers = { "Authorization": `Bearer ${JN_KEY}`, "Content-Type": "application/json" };

  try {
    // ─── FETCH JOBS ───
    if (action === "jobs") {
      const r = await fetch(`${BASE}/jobs?select=display_name,number,first_name,last_name,name,address_line1,address_line2,city,state_text,zip,status_name,record_type_name&limit=1000&sort_field=date_updated&sort_direction=desc`, { headers });
      if (!r.ok) return res.status(r.status).json({ error: "JobNimbus API error", status: r.status });
      const data = await r.json();
      const jobs = (data.results || []).map((j) => {
        const ownerName = [j.first_name, j.last_name].filter(Boolean).join(" ").trim();
        return {
          id: j.jnid,
          name: ownerName || j.name || j.display_name || "Untitled",
          jobName: j.display_name || j.number || "",
          number: j.number || "",
          address: [j.address_line1, j.city, j.state_text, j.zip].filter(Boolean).join(", "),
          status: j.status_name || "",
          type: j.record_type_name || "",
        };
      });
      return res.status(200).json({ jobs });
    }

    // ─── FETCH CONTACTS ───
    if (action === "contacts") {
      const r = await fetch(`${BASE}/contacts?select=display_name,first_name,last_name,address_line1,city,state_text,zip,status_name&limit=1000&sort_field=date_updated&sort_direction=desc`, { headers });
      if (!r.ok) return res.status(r.status).json({ error: "JobNimbus API error", status: r.status });
      const data = await r.json();
      const contacts = (data.results || []).map((c) => ({
        id: c.jnid,
        name: c.display_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Untitled",
        address: [c.address_line1, c.city, c.state_text, c.zip].filter(Boolean).join(", "),
        status: c.status_name || "",
      }));
      return res.status(200).json({ contacts });
    }

    // ─── UPLOAD DOCUMENT TO JOB ───
    if (action === "upload" && req.method === "POST") {
      const body = req.body || {};
      const { fileName, htmlContent, relatedId } = body;
      if (!fileName || !htmlContent || !relatedId) {
        return res.status(400).json({ error: "fileName, htmlContent, and relatedId required", got: { fileName: !!fileName, htmlContent: !!htmlContent, relatedId: !!relatedId } });
      }
      const plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 5000);
      const r = await fetch(`${BASE}/activities`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          record_type_name: "Note",
          note: plainText,
          primary: relatedId,
          is_active: true,
        }),
      });
      if (!r.ok) {
        const errText = await r.text();
        return res.status(r.status).json({ error: "Upload failed", details: errText });
      }
      const result = await r.json();
      return res.status(200).json({ success: true, fileId: result.jnid || result.id || "ok" });
    }

    // ─── DELETE DOCUMENT ───
    if (action === "delete" && req.method === "DELETE") {
      if (!id) return res.status(400).json({ error: "id required" });
      const r = await fetch(`${BASE}/activities/${id}`, { method: "DELETE", headers });
      if (!r.ok) {
        const errText = await r.text();
        return res.status(r.status).json({ error: "Delete failed", details: errText });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Unknown action. Use: jobs, contacts, upload, delete" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
