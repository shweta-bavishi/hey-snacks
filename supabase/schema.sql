-- hey. backend schema. Paste this whole file into Supabase > SQL Editor > Run.
-- Safe to re-run: everything is "if not exists" / "or replace".
--
-- Security model: RLS is ON for every table and there are NO policies, so the
-- public anon key can read and write nothing. Only the server (service role
-- key, used in Next.js route handlers) can touch these tables.

create table if not exists public.signups (
  id            bigint generated always as identity (start with 141) primary key,
  email         text not null,
  phone         text,
  pin_code      text,
  flavour_slugs text[] not null default '{}',
  source        text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text,
  consent_at    timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- One row per person, case-insensitive. This is what makes "duplicate" real.
create unique index if not exists signups_email_key on public.signups (lower(email));
create index if not exists signups_created_at_idx on public.signups (created_at desc);

create table if not exists public.connect_requests (
  id           bigint generated always as identity primary key,
  email        text not null,
  phone        text not null,
  flavour_slug text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  created_at   timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

alter table public.signups          enable row level security;
alter table public.connect_requests enable row level security;
alter table public.contact_messages enable row level security;

-- Atomic upsert. Returns the ticket, whether this email was new, and the
-- merged flavour list (a returning visitor adds flavours, never loses them).
create or replace function public.notify_signup(
  p_email         text,
  p_phone         text,
  p_pin_code      text,
  p_flavour_slugs text[],
  p_source        text,
  p_utm_source    text,
  p_utm_medium    text,
  p_utm_campaign  text,
  p_utm_content   text,
  p_utm_term      text
)
returns table (ticket_no bigint, was_created boolean, merged_flavour_slugs text[])
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
  v_flavours text[];
  v_inserted boolean;
begin
  insert into public.signups as s (
    email, phone, pin_code, flavour_slugs, source,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term
  )
  values (
    p_email, p_phone, p_pin_code, p_flavour_slugs, p_source,
    p_utm_source, p_utm_medium, p_utm_campaign, p_utm_content, p_utm_term
  )
  on conflict (lower(email)) do update set
    phone         = coalesce(excluded.phone, s.phone),
    pin_code      = coalesce(excluded.pin_code, s.pin_code),
    flavour_slugs = (
      select coalesce(array_agg(distinct f order by f), '{}')
      from unnest(s.flavour_slugs || excluded.flavour_slugs) as f
    ),
    updated_at    = now()
  returning s.id, s.flavour_slugs, (s.xmax = 0) into v_id, v_flavours, v_inserted;

  return query select v_id, v_inserted, v_flavours;
end;
$$;

-- Lock the function to the service role. Without this, anyone with the public
-- anon key could call it straight from the browser and skip every server check.
revoke all on function public.notify_signup(text, text, text, text[], text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.notify_signup(text, text, text, text[], text, text, text, text, text, text) to service_role;

-- Demand views for the Supabase dashboard (Table editor > Views, or SQL).
create or replace view public.demand_by_flavour as
  select f as flavour_slug, count(*) as signups
  from public.signups, unnest(flavour_slugs) as f
  group by f
  order by signups desc;

create or replace view public.demand_by_pin as
  select pin_code, count(*) as signups
  from public.signups
  where pin_code is not null
  group by pin_code
  order by signups desc;

create or replace view public.demand_by_channel as
  select coalesce(utm_source, 'direct') as channel,
         coalesce(utm_campaign, '-') as campaign,
         count(*) as signups
  from public.signups
  group by 1, 2
  order by signups desc;

revoke all on public.demand_by_flavour, public.demand_by_pin, public.demand_by_channel from anon, authenticated;
