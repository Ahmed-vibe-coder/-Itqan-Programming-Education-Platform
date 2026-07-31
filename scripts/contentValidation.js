import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.join(__dirname, '..', 'content-packages');

console.log('🔍 بدء التحقق الفعلي من صحة حزم المحتوى (Content Package Validation)...');

const subjects = ['html', 'css', 'javascript'];
let totalPackages = 0;
let errors = [];

subjects.forEach((subj) => {
  const pkgPath = path.join(baseDir, subj, 'course.json');
  if (!fs.existsSync(pkgPath)) {
    errors.push(`ملف الحزمة غير موجود: ${pkgPath}`);
    return;
  }

  try {
    const content = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (!content.schemaVersion || !content.packageId || !content.course) {
      errors.push(`ملف ${subj}/course.json يفتقر إلى الحقول الأساسية المطلوبة.`);
    } else {
      console.log(`✅ حزمة ${subj.toUpperCase()}: معرف الحزمة (${content.packageId}) — عنوان الكورس: ${content.course.title_ar}`);
      totalPackages++;
    }
  } catch (e) {
    errors.push(`خطأ في قراءة صيغة JSON لحزمة ${subj}: ${e.message}`);
  }
});

if (errors.length > 0) {
  console.error('❌ توجد أخطاء في فحص حزم المحتوى:');
  errors.forEach((err) => console.error(` - ${err}`));
  process.exit(1);
} else {
  console.log(`✨ اكتمل الفحص بنجاح! إجمالي الحزم الصحيحة: ${totalPackages}`);
  process.exit(0);
}
