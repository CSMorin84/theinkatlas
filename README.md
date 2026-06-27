# The Ink Atlas

A curated directory of tattoo artists worldwide.

## Stack
- Next.js 14 (App Router)
- Supabase (database + image storage)
- Vercel (hosting)
- Cloudflare (domain + CDN)

## Setup

1. Clone this repo
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials
4. Run `npm run dev` to start locally at http://localhost:3000

## Supabase Schema

```sql
create table artists (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  slug text unique not null,
  city text,
  neighborhood text,
  bio text,
  styles text[],
  availability text,
  contact text,
  location_note text,
  claimed boolean default false,
  works jsonb
);
```
