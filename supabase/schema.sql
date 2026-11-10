create table if not exists public.onecall_events (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('timeline','report')),
  payload jsonb not null default '{}'::jsonb,
  client_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists onecall_events_created_idx on public.onecall_events (created_at desc);
alter table public.onecall_events enable row level security;
-- 정책 없음: anon 접근 차단, 서버(service role)만 읽기/쓰기
