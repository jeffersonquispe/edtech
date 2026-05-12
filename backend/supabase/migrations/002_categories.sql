CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only service role can insert/update/delete categories"
  ON categories FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only service role can update categories"
  ON categories FOR UPDATE
  WITH CHECK (false);

CREATE POLICY "Only service role can delete categories"
  ON categories FOR DELETE
  USING (false);
