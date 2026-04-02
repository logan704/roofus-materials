var https = require("https");

function repReq(path, method, body) {
  var bodyStr = body ? JSON.stringify(body) : null;
  return new Promise(function(ok, no) {
    var opts = {
      hostname: "api.replicate.com", path: path, method: method || "GET",
      headers: {
        "Authorization": "Bearer " + (process.env.REPLICATE_API_TOKEN || ""),
        "Content-Type": "application/json",
        "Prefer": "wait"
      }
    };
    if (bodyStr) opts.headers["Content-Length"] = Buffer.byteLength(bodyStr);
    var req = https.request(opts, function(res) {
      var chunks = [];
      res.on("data", function(c) { chunks.push(c); });
      res.on("end", function() {
        var b = Buffer.concat(chunks).toString();
        try { ok({ status: res.statusCode, data: JSON.parse(b) }); }
        catch(e) { ok({ status: res.statusCode, data: b }); }
      });
    });
    req.on("error", no);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

module.exports = async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  var action = (req.query || {}).action || "";

  if (action === "ping") {
    res.status(200).json({ ok: true, v: 1, hasToken: !!(process.env.REPLICATE_API_TOKEN) });
    return;
  }

  // Start a recoloring job
  if (action === "start" && req.method === "POST") {
    try {
      var body = JSON.parse(JSON.stringify(req.body));
      var image = body.image;       // base64 data URI of house photo
      var mask = body.mask;         // base64 data URI of mask (white = roof to recolor)
      var colorName = body.colorName || "brown";
      var colorDesc = body.colorDesc || "brown asphalt shingles";

      if (!image || !mask) {
        res.status(400).json({ error: "Missing image or mask" });
        return;
      }

      // Use stability-ai inpainting model
      var result = await repReq("/v1/predictions", "POST", {
        model: "stability-ai/stable-diffusion-inpainting",
        input: {
          image: image,
          mask: mask,
          prompt: "residential house roof with " + colorDesc + " roofing shingles, photorealistic, high quality, architectural photography, natural lighting, maintaining exact house structure and shadows, 4k detail",
          negative_prompt: "blurry, distorted, cartoon, painting, different house, changed architecture, extra buildings, text, watermark, low quality",
          num_inference_steps: 30,
          guidance_scale: 8.5,
          strength: 0.75,
          scheduler: "K_EULER_ANCESTRAL"
        }
      });

      if (result.status === 201 || result.status === 200) {
        res.status(200).json(result.data);
      } else {
        res.status(result.status || 500).json({ error: "Replicate error", detail: result.data });
      }
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // Check prediction status
  if (action === "check") {
    var id = (req.query || {}).id || "";
    if (!id) { res.status(400).json({ error: "Missing prediction id" }); return; }
    try {
      var result = await repReq("/v1/predictions/" + id, "GET");
      res.status(200).json(result.data);
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // Quick recolor using a faster model (flux-schnell for speed)
  if (action === "quick" && req.method === "POST") {
    try {
      var body = JSON.parse(JSON.stringify(req.body));
      var image = body.image;
      var mask = body.mask;
      var colorName = body.colorName || "brown";
      var colorDesc = body.colorDesc || "brown asphalt shingles";

      if (!image || !mask) {
        res.status(400).json({ error: "Missing image or mask" });
        return;
      }

      var result = await repReq("/v1/predictions", "POST", {
        model: "andreasjansson/stable-diffusion-inpainting",
        input: {
          image: image,
          mask: mask,
          prompt: "CertainTeed Landmark " + colorName + " architectural asphalt shingle roof, photorealistic, professional photography, natural lighting, high detail texture of individual shingles visible, maintaining shadows and depth",
          negative_prompt: "blurry, cartoon, painting, distorted architecture, different house shape, extra elements, text, low quality, flat color, no texture",
          num_outputs: 1,
          num_inference_steps: 25,
          guidance_scale: 8,
          strength: 0.72
        }
      });

      if (result.status === 201 || result.status === 200) {
        // If using Prefer: wait, the result might already be complete
        if (result.data.status === "succeeded" && result.data.output) {
          res.status(200).json({ status: "succeeded", output: result.data.output, id: result.data.id });
        } else {
          res.status(200).json({ status: result.data.status || "starting", id: result.data.id });
        }
      } else {
        res.status(result.status || 500).json({ error: "Replicate error", detail: result.data });
      }
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(400).json({ error: "Unknown action: " + action });
};
