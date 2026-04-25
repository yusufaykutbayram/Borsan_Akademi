-- 1. User tablosunu oluştur
CREATE TABLE IF NOT EXISTS "User" (
  "id"              TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name"            TEXT NOT NULL,
  "tc_number"       TEXT NOT NULL,
  "password_hash"   TEXT NOT NULL,
  "role"            TEXT NOT NULL DEFAULT 'EMPLOYEE',
  "language"        TEXT NOT NULL DEFAULT 'tr',
  "xp_points"       INTEGER NOT NULL DEFAULT 0,
  "force_pw_change" BOOLEAN NOT NULL DEFAULT true,
  "created_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- 2. Unique kısıtlaması ekle
CREATE UNIQUE INDEX IF NOT EXISTS "User_tc_number_key" ON "User"("tc_number");

-- 3. Admin kullanıcısını ekle
-- Şifre: Borsan2026
INSERT INTO "User" ("id", "name", "tc_number", "password_hash", "role", "force_pw_change", "xp_points")
VALUES (
  gen_random_uuid()::text,
  'Admin',
  '111111',
  '$2b$10$wFUQg2kt3n.xSJ6JYqVOruTmuekbGOjVlhmiJFjC7kui8AunWHQVq',
  'ADMIN',
  false,
  0
)
ON CONFLICT ("tc_number") DO UPDATE SET
  "name" = 'Admin',
  "password_hash" = '$2b$10$wFUQg2kt3n.xSJ6JYqVOruTmuekbGOjVlhmiJFjC7kui8AunWHQVq',
  "role" = 'ADMIN',
  "force_pw_change" = false;

-- 4. Kontrol et
SELECT id, name, tc_number, role, force_pw_change FROM "User";
