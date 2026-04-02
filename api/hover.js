module.exports = function(req, res) {
  res.status(200).json({ ok: true, action: req.query.action || "none" });
};
