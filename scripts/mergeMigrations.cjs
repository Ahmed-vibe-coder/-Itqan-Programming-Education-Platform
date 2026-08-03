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

    // Clean up any remaining DO $$ type guards if any
    content = content.replace(/DO \$\$ BEGIN IF NOT EXISTS \(SELECT 1 FROM pg_type WHERE typname = '[^']+'\) THEN (CREATE TYPE [^;]+;); END IF; END \$\$;/g, '$1');
    content = content.replace(/DO \$\$ BEGIN\s+IF NOT EXISTS \(SELECT 1 FROM pg_type WHERE typname = '[^']+'\) THEN\s+(CREATE TYPE [^;]+;);\s+END IF;\s+END \$\$;/g, '$1');

    masterSql += `-- ==========================================\n-- FILE: ${file}\n-- ==========================================\n\n` + content + '\n\n';
  }
}

fs.writeFileSync(path.join(dir, 'CONSOLIDATED_MASTER_SCHEMA.sql'), masterSql, 'utf8');
console.log('Successfully generated clean standard CONSOLIDATED_MASTER_SCHEMA.sql!');
