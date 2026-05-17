// ═══════════════════════════════════════════════════════════
//  CLink Menu · Daftra API Proxy — api/daftra.js
//  يمرر طلبات الـ API لدفترة مع إخفاء الـ API Key عن المتصفح
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // ── CORS Headers ────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET")    return res.status(405).json({ success:false, error:"Method not allowed" });

  const { subdomain, apikey, endpoint } = req.query;

  // ── Validate required params ─────────────────────────────
  if (!subdomain || !apikey || !endpoint) {
    return res.status(400).json({
      success: false,
      error: "missing_params",
      message: "subdomain, apikey, and endpoint are required",
    });
  }

  // ── Build Daftra URL ─────────────────────────────────────
  const daftraURL = `https://${subdomain}.daftra.com/api2/${endpoint}`;

  try {
    const response = await fetch(daftraURL, {
      method: "GET",
      headers: {
        "apikey": apikey,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch (e) {
      return res.status(502).json({
        success: false,
        error: "invalid_json",
        message: "Daftra returned non-JSON response",
        raw: text.slice(0, 200),
      });
    }

    // ── Pass Daftra's response through ───────────────────────
    if (!response.ok) {
      return res.status(500).json({
        success: false,
        error: "daftra_error",
        message: `HTTP ${response.status}`,
        data,
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "network_error",
      message: err.message || "Failed to reach Daftra",
    });
  }
}
