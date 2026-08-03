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

let masterSql = `-- CONSOLIDATED MASTER SCHEMA FOR ITQAN PLATFORM
-- Generated for 1-Click Execution in Supabase SQL Editor
-- Total Migrations Merged: ${files.length}

`;

for (const file of files) {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    masterSql += `-- ==========================================\n-- FILE: ${file}\n-- ==========================================\n\n` + fs.readFileSync(filePath, 'utf8') + '\n\n';
  }
}

fs.writeFileSync(path.join(dir, 'CONSOLIDATED_MASTER_SCHEMA.sql'), masterSql, 'utf8');
console.log('Successfully generated CONSOLIDATED_MASTER_SCHEMA.sql!');
