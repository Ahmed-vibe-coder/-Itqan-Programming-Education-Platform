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
  Target,
  Award,
  AlertCircle
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')?.[0] || 'المبرمج';

  // Mock active course data
  const currentLesson = {
    id: 'l1030000-0000-0000-0000-000000000003',
    title: 'هيكل مستند HTML',
    courseTitle: 'HTML من الصفر',
    moduleTitle: 'الوحدة الأولى: أساسيات الإنترنت وHTML',
    progressPercentage: 65,
  };

  const assignedCourses = [
    {
      id: 'c1000000-0000-0000-0000-000000000001',
      slug: 'html-basics',
      title: 'HTML من الصفر',
      subject: 'html',
      completedLessons: 2,
      totalLessons: 12,
      color: 'from-orange-500/10 to-orange-500/5 border-orange-500/30 text-orange-500',
    },
    {
      id: 'c2000000-0000-0000-0000-000000000002',
      slug: 'css-basics',
      title: 'CSS من الصفر',
      subject: 'css',
      completedLessons: 0,
      totalLessons: 16,
      color: 'from-blue-500/10 to-blue-500/5 border-blue-500/30 text-blue-500',
    },
    {
      id: 'c3000000-0000-0000-0000-000000000003',
      slug: 'javascript-basics',
      title: 'JavaScript من الصفر',
      subject: 'js',
      completedLessons: 0,
      totalLessons: 18,
      color: 'from-amber-500/10 to-amber-500/5 border-amber-500/30 text-amber-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Personalized Greeting Header */}
      <div className="bg-gradient-to-l from-brand-primary to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>مستوى المبرمج 2 — تلميذ أنشط</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            مرحباً بك، {firstName}! 👋
          </h1>

          <p className="text-sm md:text-base text-indigo-100 leading-relaxed">
            أنت في الطريق الصحيح! أكمل درس اليوم لتكتسب مهارة جديدة وتحافظ على مستواك.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>أيام الاستمرار: 3 أيام</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl">
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>مجموع النقاط: 250 XP</span>
            </div>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute left-6 bottom-0 translate-y-4 opacity-15 hidden md:block select-none pointer-events-none">
          <span className="font-mono text-[120px] font-bold">&lt;/&gt;</span>
        </div>
      </div>

      {/* Hero Action: Continue Current Lesson */}
      <div className="bg-surface border border-bdr hover:border-brand-primary/40 rounded-2xl p-6 shadow-sm transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full inline-block">
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
            className="w-full md:w-auto px-6 py-3.5 bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
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
          <div className="w-full h-2.5 bg-surface-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500"
              style={{ width: `${currentLesson.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Overview Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Assigned Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-txt-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-primary" />
              <span>الكورسات المسندة إليك</span>
            </h2>
            <Link to="/app/courses" className="text-xs font-semibold text-brand-primary hover:underline">
              عرض الكل
            </Link>
          </div>

          <div className="space-y-4">
            {assignedCourses.map((course) => (
              <Link
                key={course.id}
                to={`/app/courses/${course.slug}`}
                className="block bg-surface border border-bdr hover:border-bdr-strong rounded-2xl p-5 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center font-bold text-sm ${course.color}`}
                    >
                      {course.subject.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-txt-primary group-hover:text-brand-primary transition-colors">
                        {course.title}
                      </h3>
                      <span className="text-xs text-txt-muted">
                        أكملت {course.completedLessons} من أصل {course.totalLessons} دروس
                      </span>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-txt-muted group-hover:text-brand-primary transition-colors" />
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full"
                    style={{ width: `${(course.completedLessons / course.totalLessons) * 100}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Column: Next Action, Exam Alert & Achievement */}
        <div className="space-y-6">
          {/* Upcoming Exam Alert */}
          <div className="bg-surface border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <FileCheck2 className="w-5 h-5" />
              <span>اختبار متاح للعرض</span>
            </div>
            <p className="text-xs text-txt-muted leading-relaxed">
              اختبار الوحدة الأولى في HTML متاح لك الآن. يتكون من 5 أسئلة للتأكد من المهارات العامة.
            </p>
            <Link
              to="/app/exams"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all"
            >
              بدء الامتحان
            </Link>
          </div>

          {/* Recent Achievement */}
          <div className="bg-surface border border-bdr rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-txt-primary text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>أحدث إنجاز مكتسب</span>
              </h3>
              <span className="text-[11px] text-txt-muted">اليوم</span>
            </div>
            <div className="flex items-center gap-3 bg-surface-secondary p-3 rounded-xl border border-bdr">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
                🦅
              </div>
              <div>
                <h4 className="font-bold text-xs text-txt-primary">أول خطوة</h4>
                <p className="text-[11px] text-txt-muted">سجلت دخولك وبدأت رحلة التعلم.</p>
              </div>
            </div>
          </div>

          {/* Group Leaderboard Position */}
          <div className="bg-surface border border-bdr rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-txt-primary text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-primary" />
                <span>ترتيبك في المجموعة</span>
              </h3>
              <span className="text-xs font-extrabold text-brand-primary">المركز 3</span>
            </div>
            <p className="text-xs text-txt-muted">
              تفصلك 30 XP فقط عن المركز الثاني! واصل إكمال الدروس لتصدر القائمة.
            </p>
            <Link
              to="/app/leaderboard"
              className="block text-center text-xs font-semibold text-brand-primary hover:underline pt-1"
            >
              عرض جدول الترتيب الكامل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
