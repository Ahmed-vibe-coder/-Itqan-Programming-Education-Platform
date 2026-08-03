import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  Play,
  BookOpen,
  CheckCircle2,
  Trophy,
  Flame,
  Zap,
  ArrowLeft,
  FileCheck2,
  Sparkles,
  Award,
  LineChart
} from 'lucide-react';
import { MetricCard } from '@/components/shared/StateComponents';

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')?.[0] || 'المبرمج';

  // Active learning lesson data
  const currentLesson = {
    id: 'l1030000-0000-0000-0000-000000000003',
    title: 'هيكل مستند HTML الرئيسي',
    courseTitle: 'HTML من الصفر إلى الإتقان',
    moduleTitle: 'الوحدة الأولى: أساسيات بناء الصفحات',
    progressPercentage: 65,
  };

  const assignedCourses = [
    {
      id: 'c1000000-0000-0000-0000-000000000001',
      slug: 'html-basics',
      title: 'مسار HTML5 الشامل',
      subject: 'html',
      completedLessons: 4,
      totalLessons: 12,
      color: 'from-[#FF6B5E]/15 to-[#FF6B5E]/5 border-[#FF6B5E]/30 text-[#FF6B5E]',
    },
    {
      id: 'c2000000-0000-0000-0000-000000000002',
      slug: 'css-basics',
      title: 'مسار CSS3 وتصميم الواجهات',
      subject: 'css',
      completedLessons: 2,
      totalLessons: 16,
      color: 'from-[#6D3DEB]/15 to-[#6D3DEB]/5 border-[#6D3DEB]/30 text-[#6D3DEB]',
    },
    {
      id: 'c3000000-0000-0000-0000-000000000003',
      slug: 'javascript-basics',
      title: 'مسار JavaScript التفاعلي',
      subject: 'js',
      completedLessons: 1,
      totalLessons: 18,
      color: 'from-[#F5B942]/15 to-[#F5B942]/5 border-[#F5B942]/30 text-[#F5B942]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Personalized Greeting Header */}
      <div className="bg-gradient-to-r from-[#6D3DEB] via-[#5B2FD1] to-[#4A22B0] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <Sparkles className="w-4 h-4 text-[#F5B942]" />
            <span>مستوى إتقان 2 — متعلم نشط</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            مرحباً بك، {firstName}! 👋
          </h1>

          <p className="text-sm md:text-base text-purple-100 leading-relaxed">
            أنت في الطريق الصحيح! أكمل درس اليوم لتكتسب مهارة عملية جديدة وتواصل التقدم في مسارك.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-white/15 px-3.5 py-2 rounded-xl backdrop-blur-sm">
              <Flame className="w-4 h-4 text-[#F5B942] fill-[#F5B942]" />
              <span>أيام الاستمرار: 3 أيام</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 px-3.5 py-2 rounded-xl backdrop-blur-sm">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>مجموع النقاط: 250 XP</span>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute left-6 bottom-0 translate-y-4 opacity-15 hidden md:block select-none pointer-events-none font-mono text-[110px] font-extrabold">
          &lt;/&gt;
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="الكورسات النشطة"
          value={assignedCourses.length}
          subtitle="3 مسارات برمجية"
          icon={BookOpen}
          color="primary"
        />
        <MetricCard
          title="الدروس المكتملة"
          value={7}
          subtitle="+2 درس هذا الأسبوع"
          icon={CheckCircle2}
          color="teal"
        />
        <MetricCard
          title="معدل الإتقان العام"
          value="96%"
          subtitle="اجتياز ممتاز للتقييمات"
          icon={LineChart}
          color="gold"
        />
        <MetricCard
          title="أوسام التميز"
          value={4}
          subtitle="وسام تميز مكتسب"
          icon={Trophy}
          color="secondary"
        />
      </div>

      {/* Main Focus: Continue Current Lesson Card */}
      <div className="bg-surface border border-bdr hover:border-brand-primary/40 rounded-2xl p-6 shadow-sm transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full inline-block border border-brand-primary/20">
              الدرس الحالي للمتابعة
            </span>
            <h2 className="text-xl font-bold text-txt-primary flex items-center gap-2">
              <span>{currentLesson.title}</span>
            </h2>
            <p className="text-xs text-txt-muted">
              {currentLesson.courseTitle} &bull; {currentLesson.moduleTitle}
            </p>
          </div>

          <Link
            to={`/app/lessons/${currentLesson.id}`}
            className="min-h-[44px] w-full md:w-auto px-6 py-3.5 bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>متابعة الشرح والتطبيق</span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-bdr">
          <div className="flex items-center justify-between text-xs text-txt-muted mb-2 font-medium">
            <span>نسبة إنجاز الدرس الحالي</span>
            <span className="font-bold text-brand-primary">{currentLesson.progressPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-secondary rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-teal rounded-full transition-all duration-500"
              style={{ width: `${currentLesson.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Layout: Assigned Courses & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Assigned Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-txt-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-primary" />
              <span>المسارات الكورسات المسندة إليك</span>
            </h2>
            <Link to="/app/courses" className="text-xs font-bold text-brand-primary hover:underline">
              عرض جميع الكورسات
            </Link>
          </div>

          <div className="space-y-4">
            {assignedCourses.map((course) => (
              <Link
                key={course.id}
                to={`/app/courses/${course.slug}`}
                className="block bg-surface border border-bdr hover:border-brand-primary/40 rounded-2xl p-5 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br border flex items-center justify-center font-mono font-bold text-sm ${course.color}`}
                    >
                      {course.subject.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-txt-primary group-hover:text-brand-primary transition-colors text-base">
                        {course.title}
                      </h3>
                      <span className="text-xs text-txt-muted">
                        أكملت {course.completedLessons} من أصل {course.totalLessons} دروس
                      </span>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-txt-muted group-hover:text-brand-primary group-hover:-translate-x-1 transition-all" />
                </div>

                {/* Course Progress bar */}
                <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-brand-primary rounded-full transition-all duration-300"
                    style={{ width: `${(course.completedLessons / course.totalLessons) * 100}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Column: Exam Alert, Achievement & Leaderboard */}
        <div className="space-y-6">
          {/* Upcoming Exam Alert */}
          <div className="bg-surface border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <FileCheck2 className="w-5 h-5" />
              <span>اختبار متاح للمحاولة</span>
            </div>
            <p className="text-xs text-txt-muted leading-relaxed">
              اختبار الوحدة الأولى في HTML متاح لك الآن. يتكون من 5 أسئلة تفاعلية لقياس مستوى الفهم.
            </p>
            <Link
              to="/app/exams"
              className="min-h-[44px] inline-flex items-center justify-center w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              بدء الاختبار الآن
            </Link>
          </div>

          {/* Recent Achievement */}
          <div className="bg-surface border border-bdr rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-txt-primary text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>أحدث وسام مكتسب</span>
              </h3>
              <span className="text-[11px] text-txt-muted">مؤخراً</span>
            </div>
            <div className="flex items-center gap-3 bg-surface-secondary p-3 rounded-xl border border-bdr">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
                🦅
              </div>
              <div>
                <h4 className="font-bold text-xs text-txt-primary">الانطلاقة البرمجية</h4>
                <p className="text-[11px] text-txt-muted">أكملت أول 5 دروس تفاعلية بنجاح.</p>
              </div>
            </div>
          </div>

          {/* Group Leaderboard Position */}
          <div className="bg-surface border border-bdr rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-txt-primary text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-primary" />
                <span>ترتيبك الحالي في لوحة الأوائل</span>
              </h3>
              <span className="text-xs font-extrabold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-lg">المركز 3</span>
            </div>
            <p className="text-xs text-txt-muted leading-relaxed">
              تفصلك 30 XP فقط عن المركز الثاني! واصل إكمال الدروس والتطبيقات البرمجية للتصدر.
            </p>
            <Link
              to="/app/leaderboard"
              className="block text-center text-xs font-bold text-brand-primary hover:underline pt-1"
            >
              عرض جدول الترتيب الكامل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

