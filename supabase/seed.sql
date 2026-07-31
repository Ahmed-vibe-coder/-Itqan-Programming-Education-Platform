-- SEED DATA FOR NAWA-CODE PLATFORM (Strict Valid Hex UUIDs)

-- 1. COURSES
INSERT INTO public.courses (id, slug, title_ar, description_ar, subject, status, estimated_hours, order_index) VALUES
('c1000000-0000-0000-0000-000000000001', 'html-basics', 'HTML من الصفر', 'تعلم كيفية بناء الهيكل الأساسي لم مواقع الويب باستخدام لغة HTML خطوة بخطوة.', 'html', 'published', 4, 1),
('c2000000-0000-0000-0000-000000000002', 'css-basics', 'CSS من الصفر', 'اكتشف سر تزيين وتنسيق صفحات الويب وتحويل الهيكل البسيط إلى تصميم جذاب ورائع.', 'css', 'published', 5, 2),
('c3000000-0000-0000-0000-000000000003', 'javascript-basics', 'JavaScript من الصفر', 'أضف التفاعل والحيوية لصفحاتك وتعلم التفكير البرمجي وبناء المنطق.', 'js', 'published', 6, 3);

-- 2. MODULES (Using valid hex UUID starting with 'b')
INSERT INTO public.modules (id, course_id, title_ar, description_ar, order_index) VALUES
('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'الوحدة الأولى: أساسيات الإنترنت وHTML', 'فهم كيفية عمل الإنترنت وكتابة أول صفحة ويب.', 1),
('b2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'الوحدة الأولى: مدخل للتنسيقات والألوان', 'ربط ملفات CSS واستخدام المحددات والألوان.', 1),
('b3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000003', 'الوحدة الأولى: بداية طريق التفكير البرمجي', 'التعرف على المتغيرات و Console وتنفيذ الأوامر.', 1);

-- 3. LESSONS (Using valid hex UUID starting with 'e')
INSERT INTO public.lessons (id, module_id, title_ar, slug, estimated_minutes, order_index, status, version) VALUES
-- HTML Lessons
('e1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'الإنترنت ومواقع الويب', 'internet-and-web', 10, 1, 'published', 1),
('e1020000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'الملفات وأول صفحة', 'files-and-first-page', 12, 2, 'published', 1),
('e1030000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'هيكل مستند HTML', 'html-document-structure', 15, 3, 'published', 1),

-- CSS Lessons
('e2010000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002', 'مقدمة CSS وربط الملفات', 'intro-to-css', 10, 1, 'published', 1),
('e2020000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002', 'القواعد والمحددات', 'css-selectors', 12, 2, 'published', 1),
('e2030000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'الألوان والوحدات', 'colors-and-units', 15, 3, 'published', 1),

-- JavaScript Lessons
('e3010000-0000-0000-0000-000000000003', 'b3000000-0000-0000-0000-000000000003', 'ما هي JavaScript؟', 'what-is-javascript', 10, 1, 'published', 1),
('e3020000-0000-0000-0000-000000000003', 'b3000000-0000-0000-0000-000000000003', 'Console وأول كود', 'console-and-first-code', 12, 2, 'published', 1),
('e3030000-0000-0000-0000-000000000003', 'b3000000-0000-0000-0000-000000000003', 'المتغيرات والثوابت', 'variables-and-constants', 15, 3, 'published', 1);

-- 4. ACHIEVEMENTS SEED
INSERT INTO public.achievement_definitions (code, title_ar, description_ar, badge_icon, xp_reward) VALUES
('first_step', 'أول خطوة', 'سجلت دخولك وبدأت رحلتك الشيقة في البرمجة!', 'footprints', 25),
('first_lesson', 'أول درس مكتمل', 'أكملت درسك الأول بنجاح وتجاوزت بوابة الإتقان.', 'award', 50),
('html_starter', 'صانع الصفحات الأول', 'أتممت أول 3 دروس في كورس HTML.', 'code', 100),
('css_stylist', 'مهندس التنسيقات', 'أتممت أول 3 دروس في كورس CSS.', 'palette', 100),
('js_wizard', 'المبرمج الذكي', 'أتممت أول 3 دروس في كورس JavaScript.', 'zap', 100),
('streak_3', 'المستمر الشغوف', 'حافظت على التعلم لمدة 3 أيام متتالية.', 'flame', 75);
