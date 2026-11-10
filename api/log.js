// 당직일지 · 상황보고서를 Supabase 에 저장 (service role 키는 서버에만)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: "not_configured" });
  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const kind = body.kind === "report" ? "report" : "timeline";
  const row = { kind, payload: body.payload ?? {}, client_at: body.at || null };
  if (JSON.stringify(row).length > 200000) return res.status(413).json({ error: "too_large" });
  const r = await fetch(`${url}/rest/v1/onecall_events`, {
    method: "POST",
    headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  res.status(r.ok ? 201 : 500).json({ ok: r.ok });
}
