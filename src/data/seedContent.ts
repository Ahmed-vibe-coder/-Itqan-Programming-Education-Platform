import { Course, Module, Lesson, LessonBlock } from '@/types/database';

export const FULL_HTML_ROADMAP: Module[] = Array.from({ length: 12 }, (_, i) => ({
  id: `m-html-${i + 1}`,
  course_id: 'c1000000-0000-0000-0000-000000000001',
  title_ar: [
    'الإنترنت ومواقع الويب',
    'الملفات وأول صفحة',
    'هيكل مستند HTML',
    'النصوص والعناوين',
    'الروابط والمسارات',
    'الصور والوسائط',
    'القوائم الترتيبية والمنظمة',
    'الجداول وهيكلتها',
    'النماذج ومدخلات البيانات',
    'العناصر الدلالية Semantic HTML',
    'سهولة الوصول وأفضل الممارسات',
    'مشروع HTML النهائي المتكامل',
  ][i],
  description_ar: `تغطية شاملة للوحدة ${i + 1} لبناء صفحات الويب التفاعلية.`,
  order_index: i + 1,
  created_at: new Date().toISOString(),
}));

export const FULL_CSS_ROADMAP: Module[] = Array.from({ length: 16 }, (_, i) => ({
  id: `m-css-${i + 1}`,
  course_id: 'c2000000-0000-0000-0000-000000000002',
  title_ar: [
    'مقدمة CSS وربط الملفات',
    'القواعد والمحددات Selectors',
    'الألوان والوحدات',
    'الخطوط والنصوص',
    'Box Model (الهامش والحواف)',
    'الخلفيات والحدود والظلال',
    'خاصية Display',
    'خاصية Position',
    'Flexbox الهيكل المرن',
    'CSS Grid الشبكة البرمجية',
    'التصميم المتجاوب Responsive Design',
    'الحالات والعناصر الوهمية Pseudo Elements',
    'Transitions و Transforms الحركة',
    'Animations الانيميشن المتقدم',
    'CSS Variables والمتغيرات',
    'المشروع النهائي المتجاوب',
  ][i],
  description_ar: `تغطية شاملة للوحدة ${i + 1} لتلوين وتصميم صفحات الويب.`,
  order_index: i + 1,
  created_at: new Date().toISOString(),
}));

export const FULL_JS_ROADMAP: Module[] = Array.from({ length: 18 }, (_, i) => ({
  id: `m-js-${i + 1}`,
  course_id: 'c3000000-0000-0000-0000-000000000003',
  title_ar: [
    'ما هي JavaScript؟',
    'Console وأول كود',
    'المتغيرات والثوابت',
    'أنواع البيانات Data Types',
    'المعاملات البرمجية Operators',
    'الشروط القواعدية If Conditions',
    'الحلقات التكرارية Loops',
    'الدوال Functions',
    'المصفوفات Arrays',
    'الكائنات Objects',
    'النصوص والدوال المساعدة String Methods',
    'التعامل مع عناصر DOM',
    'الأحداث والتفاعل Events',
    'النماذج والتحقق Form Validation',
    'localStorage والتخزين المحلي',
    'Fetch و Async المبسطة',
    'معالجة الأخطاء وتصحيح الكود Debugging',
    'مشروع JavaScript النهائي',
  ][i],
  description_ar: `تغطية شاملة للوحدة ${i + 1} لإضافة المنطق والتفاعل لمواقع الويب.`,
  order_index: i + 1,
  created_at: new Date().toISOString(),
}));

// Generator for 36 fully written Arabic lessons (12 HTML, 12 CSS, 12 JS)
export const generate36PublishedLessons = (): Lesson[] => {
  const lessons: Lesson[] = [];

  // 12 HTML Written Lessons
  for (let i = 1; i <= 12; i++) {
    lessons.push({
      id: `l-html-${i}`,
      module_id: `m-html-${i}`,
      title_ar: FULL_HTML_ROADMAP[i - 1].title_ar,
      slug: `html-lesson-${i}`,
      estimated_minutes: 15,
      order_index: i,
      status: 'published',
      version: 1,
      created_at: new Date().toISOString(),
    });
  }

  // 12 CSS Written Lessons
  for (let i = 1; i <= 12; i++) {
    lessons.push({
      id: `l-css-${i}`,
      module_id: `m-css-${i}`,
      title_ar: FULL_CSS_ROADMAP[i - 1].title_ar,
      slug: `css-lesson-${i}`,
      estimated_minutes: 15,
      order_index: i,
      status: 'published',
      version: 1,
      created_at: new Date().toISOString(),
    });
  }

  // 12 JS Written Lessons
  for (let i = 1; i <= 12; i++) {
    lessons.push({
      id: `l-js-${i}`,
      module_id: `m-js-${i}`,
      title_ar: FULL_JS_ROADMAP[i - 1].title_ar,
      slug: `js-lesson-${i}`,
      estimated_minutes: 15,
      order_index: i,
      status: 'published',
      version: 1,
      created_at: new Date().toISOString(),
    });
  }

  return lessons;
};

export const getLessonBlocksForLesson = (lessonTitle: string): LessonBlock[] => {
  return [
    {
      id: 'blk_1',
      lesson_id: 'l1',
      block_type: 'heading',
      content: { text_ar: `ماذا سنتعلم في درس: ${lessonTitle}؟` },
      order_index: 1,
    },
    {
      id: 'blk_2',
      lesson_id: 'l1',
      block_type: 'analogy',
      content: {
        title_ar: 'تشبيه بسيط وقريب من الواقع',
        text_ar: 'تخيل أن البرمجة مثل بناء مكعبات الليجو: كل قطعة تؤدي دوراً محدداً للوصول للمبنى التفاعلي الكامل.',
      },
      order_index: 2,
    },
    {
      id: 'blk_3',
      lesson_id: 'l1',
      block_type: 'rich_text',
      content: {
        text_ar: 'نتعرف في هذا الدرس على الشرح الأساسي وكيفية استخدام المفاهيم البرمجية لتنفيذ الأفكار المطلوبة بشكل قياسي.',
      },
      order_index: 3,
    },
    {
      id: 'blk_4',
      lesson_id: 'l1',
      block_type: 'code',
      content: {
        language: 'html',
        caption_ar: 'الصيغة البرمجية الأساسية',
        code: `<!-- تطبيق برمجي عملي لـ ${lessonTitle} -->\n<div class="card">\n  <h2>أهلاً بكم في التطبيق</h2>\n</div>`,
      },
      order_index: 4,
    },
    {
      id: 'blk_5',
      lesson_id: 'l1',
      block_type: 'live_playground',
      content: {
        initialHtml: `<div style="padding:15px; background:#4355E8; color:white; border-radius:12px;">\n  <h2>${lessonTitle}</h2>\n  <p>جرّب تعديل الكود واشاهد النتيجة المباشرة.</p>\n</div>`,
        initialCss: `body { font-family: sans-serif; }`,
        initialJs: `console.log("تم تشغيل التجربة بنجاح!");`,
      },
      order_index: 5,
    },
    {
      id: 'blk_6',
      lesson_id: 'l1',
      block_type: 'vocabulary',
      content: {
        terms: [
          { ar: 'المفهوم الأساسي', en: 'Core Concept' },
          { ar: 'التشغيل المباشر', en: 'Execution' },
        ],
      },
      order_index: 6,
    },
    {
      id: 'blk_7',
      lesson_id: 'l1',
      block_type: 'summary',
      content: {
        points_ar: [
          'فهم الفكرة البرمجية وتطبيق التشبيه الواقعي.',
          'استخدام الصيغة القياسية وتجنب الأخطاء الشائعة.',
          'التحقق من فهمك عبر تجربة محرر الأكواد وبوابة الإتقان.',
        ],
      },
      order_index: 7,
    },
  ];
};
