# 원콜 당직상황실

- `index.html` — 앱 (정적)
- `api/claude.js` — Anthropic API 프록시 (`ANTHROPIC_API_KEY`)
- `api/log.js` — Supabase 저장 (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- `supabase/schema.sql` — 테이블 생성 SQL

Vercel 환경변수 3개를 넣고 배포하면 됩니다. 키가 없어도 앱은 내장 규칙 엔진으로 동작합니다.
배포: Vercel (GitHub main 브랜치에 커밋하면 자동 배포)
