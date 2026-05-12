// ═══════════════════════════════════════════════════════════
//  CLink · Daftra API Proxy
//  Vercel Serverless Function — api/daftra.js
//  يحل مشكلة CORS ويوفر اتصالاً آمناً مع دفترة
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {

  // ── CORS Headers ────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, apikey");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ── استخراج المعاملات ────────────────────────────────────
  const { subdomain, apikey, endpoint } = req.query;

  // ── التحقق من المدخلات ───────────────────────────────────
  if (!subdomain || !apikey || !endpoint) {
    return res.status(400).json({
      success: false,
      error: "missing_params",
      message: "subdomain و apikey و endpoint مطلوبة",
    });
  }

  // ── منع محاولات اختراق URL ───────────────────────────────
  if (
    subdomain.includes("/") ||
    subdomain.includes(".") && subdomain.split(".").length > 1 ||
    endpoint.includes("..") ||
    endpoint.includes("http")
  ) {
    return res.status(400).json({
      success: false,
      error: "invalid_params",
      message: "معاملات غير صالحة",
    });
  }

  // ── بناء URL دفترة ───────────────────────────────────────
  const daftraURL = `https://${subdomain}.daftra.com/api2/${endpoint}`;

  try {
    // ── الطلب لدفترة ─────────────────────────────────────
    const daftraRes = await fetch(daftraURL, {
      method: req.method === "POST" ? "POST" : "GET",
      headers: {
        apikey: apikey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    // ── معالجة الأخطاء من دفترة ──────────────────────────
    if (daftraRes.status === 401) {
      return res.status(401).json({
        success: false,
        error: "invalid_apikey",
        message: "مفتاح API غير صحيح — تحقق من إعدادات دفترة",
      });
    }

    if (daftraRes.status === 403) {
      return res.status(403).json({
        success: false,
        error: "insufficient_permissions",
        message: "صلاحيات غير كافية — راجع صلاحيات التطبيق في دفترة",
      });
    }

    if (daftraRes.status === 404) {
      return res.status(404).json({
        success: false,
        error: "not_found",
        message: "النطاق الفرعي غير موجود — تحقق من اسم شركتك",
      });
    }

    if (!daftraRes.ok) {
      return res.status(daftraRes.status).json({
        success: false,
        error: "daftra_error",
        message: `خطأ من دفترة: ${daftraRes.status}`,
      });
    }

    // ── إرجاع البيانات للتطبيق ───────────────────────────
    const data = await daftraRes.json();
    return res.status(200).json(data);

  } catch (err) {
    // ── خطأ في الشبكة ─────────────────────────────────────
    return res.status(500).json({
      success: false,
      error: "network_error",
      message: "تعذّر الاتصال بدفترة — تحقق من النطاق الفرعي",
    });
  }
}
