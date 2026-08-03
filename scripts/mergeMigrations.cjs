const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../supabase/migrations');
const files = [
  '20260730_init_schema.sql',
  '20260730_complete_schema.sql',
  '20260730_enhancements_schema.sql',
  '20260730_admin_and_question_bank_enhancements.sql',
  '20260730_single_use_invitations_and_auth.sql',
  '20260730_certificates_and_system_health.sql',
  '20260801_fix_rls_and_security_hardening.sql'
];

let masterSql = `-- ==============================================================================
-- AUTOMATIC CLEAN RESET & MASTER SCHEMA FOR ITQAN PLATFORM
-- This script automatically wipes all old partial tables/types and recreates
-- the entire fresh production database schema from scratch in 1-Click!
-- ==============================================================================

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

`;

for (const file of files) {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Make all CREATE TYPE idempotent
    content = content.replace(/CREATE TYPE ([a-zA-Z0-9_]+) AS ENUM \(([^)]+)\);/g, (match, typeName, values) => {
      return `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${typeName}') THEN CREATE TYPE ${typeName} AS ENUM (${values}); END IF; END $$;`;
    });

    // Make all CREATE TABLE idempotent
    content = content.replace(/CREATE TABLE public\./g, 'CREATE TABLE IF NOT EXISTS public.');
    content = content.replace(/CREATE TABLE IF NOT EXISTS IF NOT EXISTS/g, 'CREATE TABLE IF NOT EXISTS');

    // Make all CREATE INDEX idempotent
    content = content.replace(/CREATE INDEX public\./g, 'CREATE INDEX IF NOT EXISTS public.');
    content = content.replace(/CREATE INDEX (?!IF NOT EXISTS)/g, 'CREATE INDEX IF NOT EXISTS ');
    content = content.replace(/CREATE INDEX IF NOT EXISTS IF NOT EXISTS/g, 'CREATE INDEX IF NOT EXISTS');

    masterSql += `-- ==========================================\n-- FILE: ${file}\n-- ==========================================\n\n` + content + '\n\n';
  }
}

fs.writeFileSync(path.join(dir, 'CONSOLIDATED_MASTER_SCHEMA.sql'), masterSql, 'utf8');
console.log('Successfully generated clean auto-reset CONSOLIDATED_MASTER_SCHEMA.sql!');
