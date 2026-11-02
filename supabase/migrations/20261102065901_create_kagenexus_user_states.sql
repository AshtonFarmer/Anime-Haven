create table public.user_states (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  revision bigint not null default 1 check (revision > 0),
  device_id text not null check (char_length(device_id) between 1 and 128),
  updated_at timestamptz not null default now(),
  constraint user_states_state_is_object check (jsonb_typeof(state) = 'object'),
  constraint user_states_state_size check (octet_length(state::text) <= 5242880)
);

comment on table public.user_states is
  'One conflict-aware KageNexus state document per authenticated account.';

alter table public.user_states enable row level security;

revoke all on table public.user_states from anon;
revoke all on table public.user_states from public;
grant select, insert, update, delete on table public.user_states to authenticated;

create policy "Users can read only their KageNexus state"
on public.user_states
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create only their KageNexus state"
on public.user_states
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update only their KageNexus state"
on public.user_states
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete only their KageNexus state"
on public.user_states
for delete
to authenticated
using ((select auth.uid()) = user_id);

alter publication supabase_realtime add table public.user_states;
