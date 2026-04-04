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
      return res.status(200).json({ ok: true, version: "jn-finance-v1" });
    }

    if (action === "probe") {
      const results = {};
      try {
        const inv = await jnGet("/invoices?limit=3");
        results.invoices = inv;
      } catch (e) { results.invoices = { error: e.message }; }
      try {
        const pay = await jnGet("/payments?limit=3");
        results.payments = pay;
      } catch (e) { results.payments = { error: e.message }; }
      return res.status(200).json({ ok: true, probe: results });
    }

    return res.status(400).json({ error: "Unknown action: " + action });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
