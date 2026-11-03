-- Run against the deployed schema. All fixture users and rows are rolled back.
begin;

insert into auth.users (id) values
  ('bfc67d66-0232-4932-b85d-013b552a3901'),
  ('bfc67d66-0232-4932-b85d-013b552a3902'),
  ('bfc67d66-0232-4932-b85d-013b552a3903');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"bfc67d66-0232-4932-b85d-013b552a3901","role":"authenticated"}', true);
insert into public.user_states (user_id, state, device_id)
values (auth.uid(), '{"profiles":[],"test":"account-a"}', 'rls-test-a');

select set_config('request.jwt.claims', '{"sub":"bfc67d66-0232-4932-b85d-013b552a3902","role":"authenticated"}', true);
insert into public.user_states (user_id, state, device_id)
values (auth.uid(), '{"profiles":[],"test":"account-b"}', 'rls-test-b');

do $$
declare affected integer;
begin
  assert (select count(*) from public.user_states) = 1, 'Account B can see another account';
  assert (select state->>'test' from public.user_states) = 'account-b', 'Wrong account state';
  update public.user_states set revision = 2 where user_id = auth.uid();
  get diagnostics affected = row_count;
  assert affected = 1, 'Own-row update failed';
  update public.user_states set revision = 99 where user_id = 'bfc67d66-0232-4932-b85d-013b552a3901';
  get diagnostics affected = row_count;
  assert affected = 0, 'Cross-account update succeeded';
  delete from public.user_states where user_id = 'bfc67d66-0232-4932-b85d-013b552a3901';
  get diagnostics affected = row_count;
  assert affected = 0, 'Cross-account delete succeeded';
  begin
    insert into public.user_states (user_id, state, device_id)
    values ('bfc67d66-0232-4932-b85d-013b552a3903', '{}', 'rls-cross-insert');
    raise exception 'Cross-account insert succeeded';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.user_states set user_id = 'bfc67d66-0232-4932-b85d-013b552a3903' where user_id = auth.uid();
    raise exception 'Ownership reassignment succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claims', '{"sub":"bfc67d66-0232-4932-b85d-013b552a3901","role":"authenticated"}', true);
do $$
declare affected integer;
begin
  assert (select count(*) from public.user_states) = 1, 'Account A can see another account';
  assert (select state->>'test' from public.user_states) = 'account-a', 'Account A state was modified';
  assert (select revision from public.user_states) = 1, 'Account B modified Account A';
  update public.user_states set revision = 2 where user_id = auth.uid() and revision = 1;
  get diagnostics affected = row_count;
  assert affected = 1, 'Matching revision update failed';
  update public.user_states set revision = 3 where user_id = auth.uid() and revision = 1;
  get diagnostics affected = row_count;
  assert affected = 0, 'A stale revision overwrote newer state';
  delete from public.user_states where user_id = auth.uid();
  get diagnostics affected = row_count;
  assert affected = 1, 'Own-row delete failed';
end $$;

select set_config('request.jwt.claims', '{"role":"authenticated"}', true);
do $$
begin
  assert (select count(*) from public.user_states) = 0, 'Missing identity can read state';
end $$;

rollback;
select 'passed' as result,
  'two-account isolation, own CRUD, cross-account denial, ownership checks, revision conflicts, missing identity; all fixtures rolled back' as checks;
