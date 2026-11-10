// Anthropic API 프록시 — API 키는 Vercel 환경변수 ANTHROPIC_API_KEY 에만 보관
export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === "GET") return res.status(200).json({ configured: !!key });
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!key) return res.status(503).json({ error: "not_configured" });
  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const ALLOWED = ["claude-haiku-4-5"];
  const payload = {
    model: ALLOWED.includes(body.model) ? body.model : ALLOWED[0],
    max_tokens: Math.min(Number(body.max_tokens) || 1000, 2000),
    messages: body.messages,
  };
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    res.status(r.status).setHeader("content-type", "application/json").send(text);
  } catch (e) {
    res.status(502).json({ error: "upstream_failed" });
  }
}
