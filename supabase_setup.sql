-- Run in Supabase SQL Editor. MC sign-up must be managed by the owner; disable public signups.
create table if not exists public.host_users (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.show_state (id integer primary key check(id=1), scene text not null default 'welcome' check(scene in ('welcome','questions','results')), subtitle text not null default 'Discover Your Financial Guardian', updated_at timestamptz not null default now());
insert into public.show_state(id) values(1) on conflict(id) do nothing;
alter table public.host_users enable row level security;
alter table public.show_state enable row level security;
revoke all on public.host_users from anon,authenticated;
grant select on public.host_users to authenticated;
grant select on public.show_state to anon,authenticated;
grant update(scene,subtitle) on public.show_state to authenticated;
drop policy if exists host_self_read on public.host_users;
create policy host_self_read on public.host_users for select to authenticated using (user_id=auth.uid());
drop policy if exists public_show_read on public.show_state;
create policy public_show_read on public.show_state for select to anon,authenticated using (true);
drop policy if exists host_show_update on public.show_state;
create policy host_show_update on public.show_state for update to authenticated using (exists(select 1 from public.host_users where user_id=auth.uid())) with check (exists(select 1 from public.host_users where user_id=auth.uid()));
create or replace function public.show_set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
drop trigger if exists show_update_timestamp on public.show_state;
create trigger show_update_timestamp before update on public.show_state for each row execute function public.show_set_updated_at();
-- After creating an MC user in Supabase Authentication > Users, run:
-- insert into public.host_users(user_id) values ('MC_USER_UUID');
