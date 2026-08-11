export type QuestionType = 'mcq' | 'true_false' | 'fill_blank' | 'code_output' | 'tag_match';

export interface HtmlExamQuestion {
  id: string;
  type: QuestionType;
  category: string;
  prompt: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
    isCode?: boolean;
  }[];
  correctAnswerId: string;
  explanation: string;
}

export const DEFAULT_HTML_EXAM_QUESTIONS: HtmlExamQuestion[] = [
  // 1. MCQ - Structure
  {
    id: 'q1',
    type: 'mcq',
    category: 'أساسيات الهيكل',
    prompt: 'ما هو الوسم الرئيسي الأول الذي يخبر متصفح الويب بأن الصفحات مكتوبة بمعيار HTML5؟',
    options: [
      { id: 'a', text: '<!DOCTYPE html>', isCode: true },
      { id: 'b', text: '<html>', isCode: true },
      { id: 'c', text: '<head>', isCode: true },
      { id: 'd', text: '<meta charset="UTF-8">', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'إعلان <!DOCTYPE html> يوضع في السطر الأول لتعريف المتصفح بنوع المستند وأنه يتبع مواصفات HTML5 الحديثة.',
  },

  // 2. MCQ - Title
  {
    id: 'q2',
    type: 'mcq',
    category: 'الوسوم الدلالية',
    prompt: 'أين يجب كتابة وسم <title> المسئول عن عنوان الصفحة في شريط المتصفح؟',
    options: [
      { id: 'a', text: 'داخل وسم <body>' },
      { id: 'b', text: 'داخل وسم <head>' },
      { id: 'c', text: 'خارج وسم <html>' },
      { id: 'd', text: 'داخل وسم <footer>' },
    ],
    correctAnswerId: 'b',
    explanation: 'عنوان الصفحة <title> جزء من البيانات الوصفية (Metadata) ويجب أن يكون دائماً داخل عنصر <head>.',
  },

  // 3. True/False - Paragraph
  {
    id: 'q3',
    type: 'true_false',
    category: 'عناصر النصوص',
    prompt: 'هل يقوم الوسم <p> ببدء سطر جديد تلقائياً وإضافة مسافة عمودية هامشية قبل وبعد النص؟',
    options: [
      { id: 'true', text: 'صحيح (True)' },
      { id: 'false', text: 'خطأ (False)' },
    ],
    correctAnswerId: 'true',
    explanation: 'وسم الفقرة <p> عنصر من النوع الكتلوي (Block-level element) ينشئ سطر جديد ويمتلك هامش افتراضي.',
  },

  // 4. MCQ - Headings
  {
    id: 'q4',
    type: 'mcq',
    category: 'العناوين الرئيسية',
    prompt: 'أي من الوسوم التالية يمثل أكبر وأهم عنوان رئيسي في الصفحة وفقاً للممارسات الدلالية وSEO؟',
    options: [
      { id: 'a', text: '<h6>', isCode: true },
      { id: 'b', text: '<heading>', isCode: true },
      { id: 'c', text: '<h1>', isCode: true },
      { id: 'd', text: '<head>', isCode: true },
    ],
    correctAnswerId: 'c',
    explanation: 'وسم <h1> هو العنوان الأعلى أهمية وحجماً افتراضياً، ويُنصح باستخدام h1 واحد فقط لكل صفحة.',
  },

  // 5. Fill in blank - Image alt
  {
    id: 'q5',
    type: 'fill_blank',
    category: 'الوسائط والصور',
    prompt: 'أكمل الخصائص الناقصة لإضافة نص بديل يظهر في حال تعذر تحميل الصورة لضعف الإنترنت أو قارئات الشاشة:',
    codeSnippet: '<img src="logo.png" ____="شعار منصة إتقان">',
    options: [
      { id: 'a', text: 'alt', isCode: true },
      { id: 'b', text: 'title', isCode: true },
      { id: 'c', text: 'name', isCode: true },
      { id: 'd', text: 'description', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'خاصية alt (Alternative Text) تستخدم لوصف محتوى الصورة إذا لم تظهر أو عند استخدام قارئات الشاشة للمكفوفين.',
  },

  // 6. Code Output - Link
  {
    id: 'q6',
    type: 'code_output',
    category: 'الروابط التشعبية',
    prompt: 'ما السلوك المتوقع عند النقر على الرابط التالي في المتصفح؟',
    codeSnippet: '<a href="https://itqan.edu" target="_blank">زيارة منصة إتقان</a>',
    options: [
      { id: 'a', text: 'فتح الموقع في نفس التبويب الحالي' },
      { id: 'b', text: 'فتح الموقع في تبويب (Tab) أو نافذة جديدة' },
      { id: 'c', text: 'تحميل ملف نصي باسم itqan.edu' },
      { id: 'd', text: 'إخفاء الرابط وعدم التفاعل معه' },
    ],
    correctAnswerId: 'b',
    explanation: 'الخاصية target="_blank" توجّه المتصفح لفتح الرابط المتشعب في تبويب جديد تماماً.',
  },

  // 7. MCQ - Lists
  {
    id: 'q7',
    type: 'mcq',
    category: 'القوائم',
    prompt: 'ما هو الوسم المناسب لإنشاء قائمة مرتبة مسبوقة بأرقام متسلسلة (1, 2, 3...)؟',
    options: [
      { id: 'a', text: '<ul>', isCode: true },
      { id: 'b', text: '<ol>', isCode: true },
      { id: 'c', text: '<dl>', isCode: true },
      { id: 'd', text: '<list>', isCode: true },
    ],
    correctAnswerId: 'b',
    explanation: 'وسم <ol> اختصار لـ Ordered List ويستخدم للقوائم المرقّمة المتسلسلة.',
  },

  // 8. Tag Match - Navigation
  {
    id: 'q8',
    type: 'tag_match',
    category: 'الوسوم الدلالية HTML5',
    prompt: 'ما العنصر الدلالي المصمم خصيصاً لاحتواء روابط التنقل الرئيسية في الموقع (Navigation Menu)؟',
    options: [
      { id: 'a', text: '<menu>', isCode: true },
      { id: 'b', text: '<nav>', isCode: true },
      { id: 'c', text: '<header>', isCode: true },
      { id: 'd', text: '<aside>', isCode: true },
    ],
    correctAnswerId: 'b',
    explanation: 'وسم <nav> (Navigation) يحدد منطقة روابط التنقل الرئيسية والفرعية لمساعدة محركات البحث وقارئات الشاشة.',
  },

  // 9. True/False - Void elements
  {
    id: 'q9',
    type: 'true_false',
    category: 'قواعد صياغة الكود',
    prompt: 'وسم الإغلاق </br> مطلوب إجبارياً في لغة HTML5 مثل وسم الفقرة </p>.',
    options: [
      { id: 'true', text: 'صحيح (True)' },
      { id: 'false', text: 'خطأ (False)' },
    ],
    correctAnswerId: 'false',
    explanation: 'وسم <br> وسم ذاتي الإغلاق (Void Element / Self-closing) ولا يحتاج لوسم إغلاق منفصل </br>.',
  },

  // 10. MCQ - Forms
  {
    id: 'q10',
    type: 'mcq',
    category: 'النماذج ومدخلات البيانات',
    prompt: 'أي نوع من حقول الإدخال <input> يسمح للمستخدم باختيار خيار واحد فقط من بين مجموعة خيارات؟',
    options: [
      { id: 'a', text: 'type="checkbox"', isCode: true },
      { id: 'b', text: 'type="radio"', isCode: true },
      { id: 'c', text: 'type="select"', isCode: true },
      { id: 'd', text: 'type="button"', isCode: true },
    ],
    correctAnswerId: 'b',
    explanation: 'أزرار الخيار type="radio" عند مشاركتها نفس خاصية name تسمح باختيار عنصر واحد فقط من المجموعة.',
  },

  // 11. Fill in blank - Form Action
  {
    id: 'q11',
    type: 'fill_blank',
    category: 'النماذج والباك إند',
    prompt: 'أكمل الخاصية المسئولة عن تحديد عنوان الرابط (URL) الذي تُرسل إليه بيانات النموذج عند الضغط على إرسال:',
    codeSnippet: '<form ____="/api/submit-quiz" method="POST">',
    options: [
      { id: 'a', text: 'action', isCode: true },
      { id: 'b', text: 'href', isCode: true },
      { id: 'c', text: 'src', isCode: true },
      { id: 'd', text: 'target', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'خاصية action تضع مسار الخادم أو الوجهة التي تستقبل بيانات النموذج المرسلة.',
  },

  // 12. MCQ - Tables
  {
    id: 'q12',
    type: 'mcq',
    category: 'الجداول البيانات',
    prompt: 'ما هو الوسم المستعمل لتعريف خلايا العناوين الرئيسية داخل الجدول ويكون نصها غامقاً ومحاذى في المنتصف بالوضع الافتراضي؟',
    options: [
      { id: 'a', text: '<td>', isCode: true },
      { id: 'b', text: '<th>', isCode: true },
      { id: 'c', text: '<tr>', isCode: true },
      { id: 'd', text: '<thead>', isCode: true },
    ],
    correctAnswerId: 'b',
    explanation: 'وسم <th> اختصار لـ Table Header ويعرف خلايا ترويسات الجدول.',
  },

  // 13. True/False - Comments
  {
    id: 'q13',
    type: 'true_false',
    category: 'التعليقات',
    prompt: 'تُكتب التعليقات في لغة HTML بين الصيغة <!-- هذا تعليق --> ولا تظهر على شاشة المتصفح للمستخدم.',
    options: [
      { id: 'true', text: 'صحيح (True)' },
      { id: 'false', text: 'خطأ (False)' },
    ],
    correctAnswerId: 'true',
    explanation: 'الصيغة <!-- comment --> هي الطريقة الصحيحة للتعليقات، وهي مفيدة لشرح الكود وتتجاهلها المتصفحات أثناء العرض.',
  },

  // 14. Code Output - Text formatting
  {
    id: 'q14',
    type: 'code_output',
    category: 'تنسيق النصوص',
    prompt: 'ما النتيجة البصرية المقترنة بالوسم <strong> في الكود التالي؟',
    codeSnippet: '<p>تعلم البرمجة معنا <strong>بإتقان وشغف</strong></p>',
    options: [
      { id: 'a', text: 'عرض الكلمات خطاً مائلاً (Italic)' },
      { id: 'b', text: 'عرض الكلمات خطاً عريضاً داكناً (Bold) وتأكيد أهميتها دلالياً' },
      { id: 'c', text: 'وضع خط أسفل الكلمات (Underline)' },
      { id: 'd', text: 'تغيير لون الكلمات للون الأحمر' },
    ],
    correctAnswerId: 'b',
    explanation: 'وسم <strong> يمنح النص شكلاً غامقاً ومظهراً عريضاً ويعبّر دلالياً عن الأهمية العالية للنص.',
  },

  // 15. MCQ - Metadata charset
  {
    id: 'q15',
    type: 'mcq',
    category: 'الترميز واللغة',
    prompt: 'ما هي قيمة ترميز الأحرف الموصى بها عالمياً في وسم <meta> لدعم اللغة العربية وجميع لغات العالم بدون مشاكل رمزيّة؟',
    options: [
      { id: 'a', text: '<meta charset="UTF-8">', isCode: true },
      { id: 'b', text: '<meta charset="ISO-8859-1">', isCode: true },
      { id: 'c', text: '<meta charset="ASCII">', isCode: true },
      { id: 'd', text: '<meta charset="WINDOWS-1256">', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'ترميز UTF-8 هو الترميز المعياري للويب الشامل لدعم العربية وكل الحروف الخاصة.',
  },

  // 16. Tag Match - Main
  {
    id: 'q16',
    type: 'tag_match',
    category: 'الوسوم الدلالية HTML5',
    prompt: 'أي وسم دلالي يحيط بالمحتوى الفريد والأصلي الرئيسي للصفحة (المستقل عن الترويسات والتذييلات التكرارية)؟',
    options: [
      { id: 'a', text: '<main>', isCode: true },
      { id: 'b', text: '<article>', isCode: true },
      { id: 'c', text: '<section>', isCode: true },
      { id: 'd', text: '<body>', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'وسم <main> يمثل المحتوى المركزي الرئيسي المنفرد الخاص بهذه الصفحة ولا يتكرر عبر صفحات الموقع.',
  },

  // 17. Fill in blank - Multiline text
  {
    id: 'q17',
    type: 'fill_blank',
    category: 'النماذج',
    prompt: 'أكمل الوسم المناسب لاستقبال نص متعدد الأسطر مثل كتابة رسالة أو تعليق مطول:',
    codeSnippet: '<____ rows="4" cols="50" placeholder="اكتب تعليقك هنا..."></____>',
    options: [
      { id: 'a', text: 'textarea', isCode: true },
      { id: 'b', text: 'input type="text"', isCode: true },
      { id: 'c', text: 'textbox', isCode: true },
      { id: 'd', text: 'field', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'عنصر <textarea> ينشئ مربع نصي متكافئ ومتعدد الأسطر لرسائل التعليقات والمقالات.',
  },

  // 18. True/False - Inline vs Block
  {
    id: 'q18',
    type: 'true_false',
    category: 'أنواع العناصر',
    prompt: 'وسم <span> هو عنصر سطري (Inline Element) لا يبدأ سطراً جديداً، بينما <div> عنصر كتلوي (Block Element).',
    options: [
      { id: 'true', text: 'صحيح (True)' },
      { id: 'false', text: 'خطأ (False)' },
    ],
    correctAnswerId: 'true',
    explanation: 'عناصر Inline مثل <span> تأخذ مساحة المحتوى فقط، بينما Block مثل <div> تشغل كامل عرض السطر المتاح.',
  },

  // 19. MCQ - Video element
  {
    id: 'q19',
    type: 'mcq',
    category: 'الوسائط المتعددة',
    prompt: 'أي خاصية يجب إضافتها لعنصر <video> لتمكين المستخدم من تشغيل وإيقاف الصوت والتحكم بالفيلم؟',
    options: [
      { id: 'a', text: 'controls', isCode: true },
      { id: 'b', text: 'autoplay', isCode: true },
      { id: 'c', text: 'loop', isCode: true },
      { id: 'd', text: 'src', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'خاصية controls تعرض أزرار التشغيل، الإيقاف، شريط التقدم، والتحكم في مستوى الصوت.',
  },

  // 20. Code Output - Dropdown list
  {
    id: 'q20',
    type: 'code_output',
    category: 'النماذج والقوائم المنسدلة',
    prompt: 'في القائمة المنسدلة التالية، ما هو الخيار المحدد مسبقاً للظهور فور فتح الصفحة؟',
    codeSnippet: `<select>
  <option value="1">القاهرة</option>
  <option value="2" selected>الرياض</option>
  <option value="3">دبي</option>
</select>`,
    options: [
      { id: 'a', text: 'القاهرة' },
      { id: 'b', text: 'الرياض' },
      { id: 'c', text: 'دبي' },
      { id: 'd', text: 'لا يتم تحديد أي خيار' },
    ],
    correctAnswerId: 'b',
    explanation: 'وجود خاصية selected على خيار "الرياض" يجعله المحدد افتراضياً في القائمة المنسدلة.',
  },

  // 21. MCQ - Audio Tag
  {
    id: 'q21',
    type: 'mcq',
    category: 'الوسائط المتعددة',
    prompt: 'ما هو الوسم القياسي لتضمين واستماع المقاطع الصوتية في صفحات HTML5؟',
    options: [
      { id: 'a', text: '<audio>', isCode: true },
      { id: 'b', text: '<sound>', isCode: true },
      { id: 'c', text: '<music>', isCode: true },
      { id: 'd', text: '<mp3>', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'وسم <audio> هو الوسم المعياري المعتمد في HTML5 لإدراج ملفات الصوت MP3/WAV/OGG.',
  },

  // 22. Tag Match - Footer
  {
    id: 'q22',
    type: 'tag_match',
    category: 'الوسوم الدلالية',
    prompt: 'ما الوسم المناسب لوضع حقوق النشر والمعلومات الختامية للموقع في أسفل الصفحة؟',
    options: [
      { id: 'a', text: '<footer>', isCode: true },
      { id: 'b', text: '<bottom>', isCode: true },
      { id: 'c', text: '<end>', isCode: true },
      { id: 'd', text: '<aside>', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'وسم <footer> يتضمن معلومات حقوق التبييض، سياسة الخصوصية، وشروط الاستخدام في تذييل الصفحة.',
  },

  // 23. Fill in blank - Table colspan
  {
    id: 'q23',
    type: 'fill_blank',
    category: 'الجداول',
    prompt: 'لدمج خليتين أفُقيتين في سطر واحد داخل الجدول، نستخدم الخاصية:',
    codeSnippet: '<td ____="2">خلية مدموجة عمودين</td>',
    options: [
      { id: 'a', text: 'colspan', isCode: true },
      { id: 'b', text: 'rowspan', isCode: true },
      { id: 'c', text: 'span', isCode: true },
      { id: 'd', text: 'merge', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'خاصية colspan (Column Span) تدمج الخلايا الممتدة عبر عدة أعمدة أفُقياً.',
  },

  // 24. True/False - Void Image tag
  {
    id: 'q24',
    type: 'true_false',
    category: 'وسوم الوسائط',
    prompt: 'وسم الصورة <img> يحتاج دائماً إلى وسم إغلاق منفصل مثل </img>.',
    options: [
      { id: 'true', text: 'صحيح (True)' },
      { id: 'false', text: 'خطأ (False)' },
    ],
    correctAnswerId: 'false',
    explanation: 'عنصر <img> من العناصر الفارغة Self-Closing الذاتية ولا يحتوي على وسم إغلاق </img>.',
  },

  // 25. MCQ - Attribute required
  {
    id: 'q25',
    type: 'mcq',
    category: 'تحقق النماذج Validation',
    prompt: 'ما الخاصية التي تجعل الحقل إلزامياً ولا تتيح إرسال النموذج إلا بعد إكمال تعبئته؟',
    options: [
      { id: 'a', text: 'required', isCode: true },
      { id: 'b', text: 'validate', isCode: true },
      { id: 'c', text: 'important', isCode: true },
      { id: 'd', text: 'mandatory', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'إضافة الخاصية required تمنع إرسال النموذج إذا كان الحقل فارغاً من البيانات.',
  },

  // 26. Code Output - Paragraph and Break
  {
    id: 'q26',
    type: 'code_output',
    category: 'تنسيق النصوص',
    prompt: 'ما نتيجة تنفيذ هذا الكود داخل المتصفح؟',
    codeSnippet: '<p>مرحباً بكم<br>في أستراليا</p>',
    options: [
      { id: 'a', text: 'عرض "مرحباً بكم في أستراليا" في سطر واحد' },
      { id: 'b', text: 'عرض "مرحباً بكم" في سطر، و "في أستراليا" في السطر التالي مباشرة' },
      { id: 'c', text: 'إخفاء كلمة أستراليا' },
      { id: 'd', text: 'حدوث خطأ برلمجي في الصفحة' },
    ],
    correctAnswerId: 'b',
    explanation: 'وسم <br> (Line Break) يُحدث قطعا وفصلاً للسطر وينتقل للسطر التالي دون إغلاق الفقرة.',
  },

  // 27. MCQ - External CSS Link
  {
    id: 'q27',
    type: 'mcq',
    category: 'ربط الملفات الخارجية',
    prompt: 'أي وسم يُستعمل لربط ملف التنسيقات الخارجي style.css بصفحة ال HTML؟',
    options: [
      { id: 'a', text: '<link rel="stylesheet" href="style.css">', isCode: true },
      { id: 'b', text: '<style src="style.css">', isCode: true },
      { id: 'c', text: '<script href="style.css">', isCode: true },
      { id: 'd', text: '<css path="style.css">', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'عنصر <link rel="stylesheet" href="..."> هو الطريق الصحيح لربط ملفات CSS الخارجية بالـ head.',
  },

  // 28. Tag Match - Aside
  {
    id: 'q28',
    type: 'tag_match',
    category: 'الوسوم الدلالية',
    prompt: 'ما الوسم الدلالي المخصص لوضع محتوى جانبي ثانوي (مثل الإعلانات أو روابط ذات صلة)؟',
    options: [
      { id: 'a', text: '<aside>', isCode: true },
      { id: 'b', text: '<sidebar>', isCode: true },
      { id: 'c', text: '<section>', isCode: true },
      { id: 'd', text: '<div>', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'وسم <aside> يغطي المحتوى الجانبي المساعد المستقل عن موضوع المقال الرئيسي.',
  },

  // 29. MCQ - HTML Attributes Quotes
  {
    id: 'q29',
    type: 'mcq',
    category: 'قواعد الصياغة',
    prompt: 'ما هي الطريقة القياسية الموصى بها لمنح قيم للخصائص (Attributes) في HTML؟',
    options: [
      { id: 'a', text: 'وضع القيمة بين علامتي تنصيص مزدوجة class="btn"', isCode: true },
      { id: 'b', text: 'كتابة اسم الخاصية بدون علامات تنصيص class=btn', isCode: true },
      { id: 'c', text: 'استخدام الأقواس الهلالية class=(btn)', isCode: true },
      { id: 'd', text: 'استخدام علامة النسبة المئوية class=%btn%', isCode: true },
    ],
    correctAnswerId: 'a',
    explanation: 'الممارسات القياسية توصي بقوة بإحاطة قيم الخصائص بعلامات تنصيص "..." لتجنب الأخطاء البرمجية.',
  },

  // 30. True/False - Semantic web
  {
    id: 'q30',
    type: 'true_false',
    category: 'الويب الدلالي SEO',
    prompt: 'استخدام الوسوم الدلالية مثل <article> و <header> يساعد محركات البحث وقارئات الشاشة في فهم هيكل موقعك بدقة أكثر من مجرد استخدام <div> فقط.',
    options: [
      { id: 'true', text: 'صحيح (True)' },
      { id: 'false', text: 'خطأ (False)' },
    ],
    correctAnswerId: 'true',
    explanation: 'الوسوم الدلالية (Semantic HTML5) تعطي معنى ووضوحاً بنيوياً لكل جزء في الصفحة، مما يرفع تقييم الموقع في جوجل ويحسن إمكانية الوصول النظري (Accessibility).',
  },
];

const LOCAL_STORAGE_QUESTIONS_KEY = 'itqan_custom_html_questions';

/**
 * Returns active questions list (reads custom admin modifications from localStorage or defaults to 30 dataset).
 */
export function getHtmlExamQuestions(): HtmlExamQuestion[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_QUESTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading custom HTML questions:', e);
  }
  return DEFAULT_HTML_EXAM_QUESTIONS;
}

/**
 * Saves modified/new questions dataset for HTML exam.
 */
export function saveHtmlExamQuestions(questions: HtmlExamQuestion[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_QUESTIONS_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Error saving custom HTML questions:', e);
  }
}

export const HTML_EXAM_QUESTIONS = DEFAULT_HTML_EXAM_QUESTIONS;
