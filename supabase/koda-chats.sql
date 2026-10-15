-- Koda chat history, saved per user so it follows them to any device or browser.
-- Each user can only read and change their own chats (row level security).

create table if not exists public.koda_chats (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id text not null,
  title text not null default '',
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.koda_chats enable row level security;

drop policy if exists "Own chats only" on public.koda_chats;
create policy "Own chats only" on public.koda_chats
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists koda_chats_recent on public.koda_chats (user_id, updated_at desc);
