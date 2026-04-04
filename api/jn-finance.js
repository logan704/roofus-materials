const https = require("https");

var KEY = "mn9nk0ezvo8k986n";
const JN_BASE = "app.jobnimbus.com";

function jnGet(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: JN_BASE,
      path: "/api1" + path,
      method: "GET",
      headers: {
        Authorization: "Bearer " + KEY,
        "Content-Type": "application/json",
      },
    };
    const req = https.request(opts, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = new URL(req.url, "https://" + req.headers.host);
  const action = url.searchParams.get("action");

  try {
    if (action === "ping") {
      return res.status(200).json({ ok: true, version: "jn-finance-v3" });
    }

    if (action === "probe_notes") {
      const r = await jnGet("/activities?limit=5");
      return res.status(200).json({ ok: true, activities: r });
    }

    if (action === "invoices") {
      const all = [];
      let page = 0;
      let hasMore = true;
      while (hasMore && page < 10) {
        const offset = page * 500;
        const r = await jnGet("/invoices?select=jnid,number,status_name,total,total_paid,date_created,date_due,date_paid_in_full,related,is_active,is_archived&limit=500&offset=" + offset);
        const results = (r.data && r.data.results) || [];
        all.push(...results);
        hasMore = results.length === 500;
        page++;
      }
      const byJob = {};
      for (const inv of all) {
        const rels = inv.related || [];
        for (const rel of rels) {
          const rid = typeof rel === "string" ? rel : rel.id;
          const rtype = typeof rel === "string" ? "unknown" : (rel.type || "");
          if (rtype === "job" || rtype === "unknown") {
            if (!byJob[rid]) byJob[rid] = [];
            byJob[rid].push({ id: inv.jnid, number: inv.number, status: inv.status_name, total: inv.total || 0, paid: inv.total_paid || 0, due: (inv.total || 0) - (inv.total_paid || 0), created: inv.date_created, dateDue: inv.date_due, paidInFull: inv.date_paid_in_full || 0, active: inv.is_active });
          }
        }
      }
      return res.status(200).json({ ok: true, byJob, totalInvoices: all.length });
    }

    return res.status(400).json({ error: "Unknown action: " + action });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
