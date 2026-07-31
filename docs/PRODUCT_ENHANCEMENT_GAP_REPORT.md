# Product Enhancement Gap Report — منصة "نواة كود" (nawa-code)

**تاريخ التقرير الجنائي والتدقيق**: 30 يوليو 2026  
**الفئة المستهدفة**: الأكاديمية العربية المتخصصة لتعليم البرمجة للناشئين (10 - 15 سنة)

---

## 1. مصفوفة فحص وتحليل المزايا (Enhancement Gap Matrix)

| Domain | Feature Area | Required Path | Status Classification | Missing Implementation & Expansion Strategy | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Student** | Guided Onboarding | `/app/onboarding` | `NOT_IMPLEMENTED` | بناء سير ترحيب وإعداد الطالب، قياس الخبرات السابقة، وتخصيص المسار | High |
| **Student** | Placement Assessment | `/app/placement` | `NOT_IMPLEMENTED` | امتحان تحديد المستوى التكيفي وتحديد نقطة الانطلاق المناسبة | High |
| **Student** | Personal Learning Roadmap | `/app/roadmap` | `PARTIALLY_IMPLEMENTED` | تحويل العرض إلى شجرة تفاعلية بـ 7 حالات لكل عقدة درس ومرحلة | High |
| **Student** | Concept Skill Map | `/app/skills` | `NOT_IMPLEMENTED` | خريطة المفاهيم المهارية لـ HTML/CSS/JS (غير متكونة، يتعلم، يحتاج مراجعة، أتقن) | High |
| **Student** | Personal Mistake Notebook | `/app/mistakes` | `NOT_IMPLEMENTED` | "دفتر أخطائي" - التجميع التلقائي للأخطاء من الإتقان والامتحانات مع تصنيف الحالة | High |
| **Student** | Adaptive Spaced Review | `/app/review-center` | `NOT_IMPLEMENTED` | "مركز المراجعة المتباعدة" - جدولة المراجعات بناءً على منحن النسيان وفحص الثقة | High |
| **Student** | Projects & Portfolio | `/app/projects`, `/app/portfolio` | `NOT_IMPLEMENTED` | نظام المشاريع التراكمية ومعرض الأعمال الشخصي المعتمد من المعلم | Medium |
| **Student** | Weekly Missions & Focus Mode | `/app/missions` | `NOT_IMPLEMENTED` | المهمات الأسبوعية ووضع التركيز الخالي من المشتتات | Medium |
| **Student** | Ask the Teacher Help | `/app/help-requests` | `NOT_IMPLEMENTED` | نظام طلبات المساعدة المباشرة بين الطالب والمعلم مرفق بلقطة من الكود | Medium |
| **Teacher** | Attention Center | `/teacher/attention` | `NOT_IMPLEMENTED` | "مركز انتباه المعلم" - قائمة ذكية مرتبة حسب أولوية الطلاب المحتاجين للمساعدة | High |
| **Teacher** | Student Timeline | `/teacher/students/:id/timeline` | `NOT_IMPLEMENTED` | السجل الزمني التفصيلي لنشاط وحركات الطالب | Medium |
| **Teacher** | Concept Difficulty Heatmap | `/teacher/analytics/heatmap` | `NOT_IMPLEMENTED` | خريطة حرارية لمفاهيم المناهج والمجموعات لتحديد نقاط التعثر | Medium |
| **Teacher** | Content Quality Checker | `/teacher/content/checker` | `NOT_IMPLEMENTED` | فاحص جودة المحتوى والروابط واكتشاف النواقص قبل النشر | Medium |
| **Platform** | Global Search & Command Menu | Keyboard `Ctrl+K` | `NOT_IMPLEMENTED` | قائمة الأوامر السريعة والبحث الموحد في الدروس والمفاهيم والطلاب | Medium |

---

## 2. ترتيب التنفيذ الفوري (Execution Phases)
سنشرع فوراً ودون توقف في تطوير وبناء جميع مكونات المرحلة A والمرحلة B والمراحل التكميلية، وإنشاء جداول قاعدة البيانات والخدمات والواجهات والأجهزة الاختبارية.
