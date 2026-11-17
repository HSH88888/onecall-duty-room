// Supabase 무료 프로젝트 자동 일시중지(7일 무활동) 방지용 keep-alive
// GitHub Actions(.github/workflows/keep-supabase-alive.yml)가 주기적으로 호출합니다.
// 데이터는 읽기만 시도하고 아무것도 돌려주지 않습니다.
export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(503).json({ ok: false, error: "not_configured" });
  try {
    const r = await fetch(`${url}/rest/v1/onecall_events?select=id&limit=1`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, status: r.status, at: new Date().toISOString() });
  } catch (e) {
    res.status(502).json({ ok: false, error: "fetch_failed" });
  }
}
