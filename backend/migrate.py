#!/usr/bin/env python3
import os
import psycopg2
from pathlib import Path

# Get connection string from Supabase
# Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

# Extract host from URL (e.g., https://xxxxx.supabase.co -> xxxxx.supabase.co)
if not SUPABASE_URL:
    print("❌ Missing NEXT_PUBLIC_SUPABASE_URL")
    exit(1)

host = SUPABASE_URL.replace('https://', '').replace('http://', '')

# You need to get the database password from Supabase settings
# For now, we'll prompt or use an env var
db_password = os.getenv('SUPABASE_DB_PASSWORD')
if not db_password:
    print("❌ Please set SUPABASE_DB_PASSWORD environment variable")
    print("   Find it in Supabase Dashboard > Project Settings > Database > Connection string")
    exit(1)

# Connection string
conn_string = f"postgresql://postgres:{db_password}@{host}:5432/postgres"

try:
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()

    # Run migrations in order
    migration_files = [
        '001_profiles.sql',
        '002_categories.sql',
        '003_courses.sql',
        '004_lessons.sql',
        '005_enrollments.sql',
        '006_reviews.sql',
    ]

    for filename in migration_files:
        filepath = Path('supabase/migrations') / filename
        print(f"⏳ Running {filename}...")

        with open(filepath) as f:
            sql = f.read()

        cursor.execute(sql)
        conn.commit()
        print(f"✅ {filename} completed")

    cursor.close()
    conn.close()

    print("\n✅ All migrations completed successfully!")

except Exception as e:
    print(f"❌ Migration failed: {e}")
    exit(1)
