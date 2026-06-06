# Supabase + OpenRouter Setup

Follow these steps so your frontend, Supabase backend, database, auth, and AI generator are connected.

## 1. Create `.env`

Copy `.env.example` to `.env` and paste your keys:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
# or VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
VITE_OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
```

The app will use Supabase for auth and storage when `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are present.

## 2. Run The Supabase Migration

Option A: Supabase Dashboard

1. Open Supabase Dashboard.
2. Go to SQL Editor.
3. Copy the full SQL from `supabase/migrations/20260101000000_quizverse_schema.sql`.
4. Paste and run it.

Option B: Supabase CLI

```bash
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

## 3. Create Admin User

1. Register in the app with your admin email.
2. Run this in Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## 4. OpenRouter AI Setup

For quick local testing, putting `VITE_OPENROUTER_API_KEY` in `.env` is enough.

For production, use the Supabase Edge Function so your OpenRouter key is not exposed in browser JavaScript:

```bash
supabase functions deploy generate-quiz
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
supabase secrets set OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
```

For local Edge Function testing:

```bash
supabase functions serve generate-quiz --env-file .env
```

The frontend first calls `supabase.functions.invoke('generate-quiz')`. If that is not available locally and `VITE_OPENROUTER_API_KEY` exists, it falls back to direct OpenRouter requests.

## 5. Run The App

```bash
npm run dev
```

## 6. Supabase Auth Settings

For development, you can disable email confirmation in Supabase:

Authentication -> Providers -> Email -> Confirm email = off

For production, keep email confirmation on and configure your Site URL and Redirect URLs.

## 7. What Is Stored In Supabase

- `profiles`: user profile and role
- `quizzes`: quiz metadata and questions as JSONB
- `quiz_attempts`: user submissions and answer review data
- `leaderboards`: ranking data

The app automatically seeds the default quizzes into Supabase the first time an authenticated user opens the app and the `quizzes` table is empty.