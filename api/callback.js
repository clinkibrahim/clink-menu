// ═══════════════════════════════════════════════════════════
//  CLink · Daftra OAuth Callback
//  Vercel Serverless Function — api/callback.js
//  يستقبل code من دفترة ويحوّله لـ Access Token
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {

  const { code, error } = req.query;

  // ── خطأ من دفترة ────────────────────────────────────────
  if (error) {
    return res.redirect(`/?auth=error&reason=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect("/?auth=error&reason=no_code");
  }

  // ── بيانات التطبيق من Environment Variables ──────────────
  const CLIENT_ID     = process.env.DAFTRA_CLIENT_ID     || "555";
  const CLIENT_SECRET = process.env.DAFTRA_CLIENT_SECRET;
  const REDIRECT_URI  = process.env.DAFTRA_REDIRECT_URI  || "https://clink-menu.vercel.app/callback";

  if (!CLIENT_SECRET) {
    return res.redirect("/?auth=error&reason=missing_secret");
  }

  try {
    // ── تحويل code إلى Access Token ──────────────────────
    const tokenRes = await fetch("https://app.daftra.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type:    "authorization_code",
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri:  REDIRECT_URI,
        code:          code,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Token error:", err);
      return res.redirect("/?auth=error&reason=token_failed");
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token, expires_in, subdomain } = tokenData;

    if (!access_token) {
      return res.redirect("/?auth=error&reason=no_token");
    }

    // ── إعادة توجيه للتطبيق مع Token ─────────────────────
    // Token يُمرَّر عبر URL fragment (#) — لا يُرسَل للسيرفر
    const params = new URLSearchParams({
      auth:          "success",
      token:         access_token,
      subdomain:     subdomain || "",
      expires_in:    expires_in || "3600",
    });

    if (refresh_token) {
      params.append("refresh_token", refresh_token);
    }

    return res.redirect(`/?${params.toString()}`);

  } catch (err) {
    console.error("Callback error:", err);
    return res.redirect(`/?auth=error&reason=${encodeURIComponent(err.message)}`);
  }
}
