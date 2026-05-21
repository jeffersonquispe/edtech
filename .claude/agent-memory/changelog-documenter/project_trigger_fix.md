---
name: project-trigger-fix
description: handle_new_user trigger requires SET search_path = public; hotfix SQL in FIX_TRIGGER.sql
metadata:
  type: project
---

The `handle_new_user` trigger (defined in migration 001_profiles.sql) failed in production because the function lacked an explicit `search_path`.

**Fix applied via `FIX_TRIGGER.sql` (not a numbered migration — executed directly in Supabase SQL Editor):**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

**Why:** Without `SET search_path = public`, the SECURITY DEFINER function may fail to resolve the `profiles` table depending on the Supabase Postgres version or connection search_path settings.

**How to apply:** Any future SECURITY DEFINER trigger functions must include `SET search_path = public`. This fix was applied outside the migration sequence — if the schema is reset from scratch, the fix should be incorporated into migration 001 or applied as migration 007.
