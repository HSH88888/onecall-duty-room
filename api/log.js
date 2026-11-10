// 당직일지 · 상황보고서를 Supabase 에 저장 (키는 서버 환경변수에만)
// 환경변수: SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_URL
//          SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (onecall_events 에 '추가'만 허용된 키)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
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
