# منصة إتقان — Itqan Programming Platform 🚀

[![Production Build](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tests Passed](https://img.shields.io/badge/Vitest-23%2F23%20Passed-green?logo=vitest)](https://vitest.dev/)

**إتقان** هي منصة متكاملة ومصممة خصيصاً لتعليم أساسيات البرمجة (**HTML5, CSS3, JavaScript**) للناشئين والأطفال (من عمر 10 إلى 15 سنة) باللغة العربية، مع توفير مركز قيادة كامل للمدرس وبنك أسئلة متطور ونظام شهادات معتمدة ورابط توثيق عام.

---

## ✨ المميزات الرئيسية للمنصة (Key Features)

### 🔑 1. نظام الدعوات أحادية الاستخدام والتأمين
- **دعوات فردية موجهة:** كود دعوة ينتهي فور استخدامه (`max_uses = 1`).
- **المطابقة الاسمية:** مطابقة اسم الطالب الثلاثي باللغة العربية مع إزالة التشكيل وتوحيد الأحرف.
- **تسجيل الدخول باسم المستخدم:** الدخول دون الحاجة لبريد إلكتروني خارجي للطالب.

### 📚 2. مناهج تفاعلية و 36 درساً منشوراً
- **3 مناهج أكاديمية:** HTML5، CSS3، ولغة JavaScript.
- **محرر كتل بصري (Visual Block Editor):** أكثر من 25 كتلة تفاعلية للشرح والتطبيقات والمقارنات.
- **محرر كود حي تفاعلي (Live Code Playground):** تجربة الأكواد ومعاينتها فورياً على الجوال والكمبيوتر.

### 🧩 3. بنك الأسئلة المركزي و 24 نوعاً تفاعلياً
- محرك عرض وتصحيح آلي لـ 24 نوعاً من الأسئلة (اختيار من متعدد، صح وخطأ، سحب وإسقاط، ترتيب الكود، التنبؤ بالخرج، اكتشاف الخطأ وتصحيحه...إلخ).
- بدائل اللمس المخصصة للهواتف الذكية (أزرار لأعلى ولأسفل، اختيار بلمسة واحدة).

### 🏆 4. الامتحانات، التصحيح السيرفراتي، والشهادات المعتمدة
- **نسبة %80 للاجتياز:** منح شهادة تفوق معتمدة تلقائياً عند تحقيق نسبة 80% أو أكثر في الامتحان النهائي.
- **رابط توثيق عام (`/verify/:code`):** صفحة عامة للتحقق من صحة أي شهادة صادرة من المنصة.
- **تصحيح سيرفراتي محمي:** منع التلاعب في درجات الأمتحانات عبر Edge Functions.

### ⚡ 5. مركز قيادة المعلم والبحث الشامل
- قائمة الأوامر والبحث الشامل عبر **`Ctrl+K`**.
- لوحة مراقبة وسلامة المنظومة المباشرة (`/teacher/system-health`).
- قائمة انتباه المعلم للطلاب المحتاجين للمساعدة والتصحيح والمعاملات المعلقة.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend & Database:** Supabase Postgres, Row Level Security (RLS)
- **Serverless:** Supabase Edge Functions (Deno / TypeScript)
- **Testing:** Vitest, Testing Library
- **PWA:** Service Worker offline support & Mobile Shell (320px–430px)

---

## 🚦 التشغيل السريع (Quick Start)

### 1. استنساخ المستودع (Clone Repository)
```bash
git clone https://github.com/USERNAME/itqan-code-platform.git
cd itqan-code-platform
```

### 2. تثبيت التبعيات (Install Dependencies)
```bash
npm install
```

### 3. إعداد متغيرات البيئة (Environment Variables)
قم بإنشاء ملف `.env` بناءً على الملف النموذج `.env.example`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. تشغيل خادم التطوير (Run Development Server)
```bash
npm run dev
```

### 5. تشغيل الاختبارات الآلية (Run Tests)
```bash
npm test
```

### 6. بناء النسخة الإنتاجية (Build Production)
```bash
npm run build
```

---

## 📜 الترخيص (License)
هذا المشروع مرخص بموجب ترخيص **MIT** — راجع ملف [LICENSE](LICENSE) للتفاصيل.
