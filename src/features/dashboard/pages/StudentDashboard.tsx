import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/database';
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
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')?.[0] || 'المتعلم';

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    courseService
      .getPublishedCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load courses for dashboard:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Active learning lesson data
  const currentLesson = {
    id: 'l1030000-0000-0000-0000-000000000003',
    title: 'هيكل مستند HTML الرئيسي والوسوم',
    courseTitle: 'HTML من الصفر إلى الإتقان',
    moduleTitle: 'الوحدة الأولى: أساسيات بناء الصفحات',
    progressPercentage: 65,
  };

  const assignedCourses = courses.length > 0
    ? courses.map((c, i) => ({
        id: c.id,
        slug: c.slug,
        title: c.title_ar,
        subject: c.subject.toUpperCase(),
        completedLessons: i === 0 ? 4 : i === 1 ? 2 : 1,
        totalLessons: 12 + i * 2,
        color: i === 0 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : i === 1 ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      }))
    : [
        {
          id: 'c1000000-0000-0000-0000-000000000001',
          slug: 'html-basics',
          title: 'مسار HTML5 الشامل',
          subject: 'HTML',
          completedLessons: 4,
          totalLessons: 12,
          color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        },
        {
          id: 'c2000000-0000-0000-0000-000000000002',
          slug: 'css-basics',
          title: 'مسار CSS3 وتصميم الواجهات',
          subject: 'CSS',
          completedLessons: 2,
          totalLessons: 16,
          color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        },
        {
          id: 'c3000000-0000-0000-0000-000000000003',
          slug: 'javascript-basics',
          title: 'مسار JavaScript التفاعلي',
          subject: 'JS',
          completedLessons: 1,
          totalLessons: 18,
          color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        },
      ];

  return (
    <div className="space-y-8 text-right">
      {/* Personalized Greeting Hero Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white rounded-itqan-card p-6 md:p-8 shadow-itqan-soft relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-black backdrop-blur-sm border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>مستوى إتقان 2 — متعلم نشط</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            مرحباً بك، {firstName}! 👋
          </h1>

          <p className="text-sm md:text-base text-orange-50 leading-relaxed font-medium">
            أنت في الطريق الصحيح! أكمل درس اليوم لتكتسب مهارة عملية جديدة وتواصل التقدم في مسارك.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-black">
            <div className="flex items-center gap-1.5 bg-white/20 px-3.5 py-2 rounded-xl backdrop-blur-sm">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>أيام الاستمرار: 3 أيام متتالية</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 px-3.5 py-2 rounded-xl backdrop-blur-sm font-mono">
              <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>مجموع النقاط: 250 XP</span>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute left-6 bottom-0 translate-y-4 opacity-15 hidden md:block select-none pointer-events-none font-mono text-[110px] font-black">
          &lt;/&gt;
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="الكورسات المسجلة"
          value={assignedCourses.length}
          subtitle="مسارات برمجية حية"
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
          title="أوسمة التميز"
          value={4}
          subtitle="وسام تميز مكتسب"
          icon={Trophy}
          color="secondary"
        />
      </div>

      {/* Main Focus: Continue Current Lesson Card */}
      <Card variant="interactive" padding="lg" className="border-orange-500/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="primary" size="sm">الدرس الحالي للمتابعة</Badge>
            <h2 className="text-xl font-black text-txt-primary">
              {currentLesson.title}
            </h2>
            <p className="text-xs text-txt-muted font-bold">
              {currentLesson.courseTitle} &bull; {currentLesson.moduleTitle}
            </p>
          </div>

          <Link to={`/app/lessons/${currentLesson.id}`}>
            <Button variant="primary" size="lg" leftIcon={<Play className="w-4 h-4 fill-white" />}>
              متابعة الشرح والتطبيق
            </Button>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-bdr">
          <div className="flex items-center justify-between text-xs text-txt-muted mb-2 font-bold">
            <span>نسبة إنجاز الدرس الحالي</span>
            <span className="font-mono text-orange-500">{currentLesson.progressPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-secondary rounded-full overflow-hidden border border-bdr-soft">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${currentLesson.progressPercentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Grid Layout: Assigned Courses & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Assigned Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-txt-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <span>الكورسات المسندة إليك</span>
            </h2>
            <Link to="/app/courses" className="text-xs font-bold text-orange-500 hover:underline">
              عرض جميع الكورسات
            </Link>
          </div>

          <div className="space-y-4">
            {assignedCourses.map((course) => (
              <Link key={course.id} to={`/app/courses/${course.slug}`} className="block">
                <Card variant="interactive" padding="md" className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center font-mono font-black text-sm ${course.color}`}
                      >
                        {course.subject}
                      </div>
                      <div>
                        <h3 className="font-black text-txt-primary group-hover:text-orange-500 transition-colors text-base">
                          {course.title}
                        </h3>
                        <span className="text-xs text-txt-muted font-bold">
                          أكملت {course.completedLessons} من أصل {course.totalLessons} دروس
                        </span>
                      </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-txt-muted group-hover:text-orange-500 group-hover:-translate-x-1 transition-all" />
                  </div>

                  {/* Course Progress bar */}
                  <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-bdr-soft">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${(course.completedLessons / course.totalLessons) * 100}%` }}
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Column: Exam Alert, Achievement & Leaderboard */}
        <div className="space-y-6">
          {/* Upcoming Exam Alert */}
          <Card variant="default" padding="md" className="border-amber-500/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-500 font-black text-sm">
              <FileCheck2 className="w-5 h-5" />
              <span>اختبار متاح للمحاولة</span>
            </div>
            <p className="text-xs text-txt-muted leading-relaxed">
              اختبار الوحدة الأولى في HTML متاح لك الآن. يتكون من 5 أسئلة تفاعلية لقياس مستوى الفهم.
            </p>
            <Link to="/app/exams">
              <Button variant="primary" size="md" fullWidth>
                بدء الاختبار الآن
              </Button>
            </Link>
          </Card>

          {/* Recent Achievement */}
          <Card variant="default" padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-txt-primary text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>أحدث وسام مكتسب</span>
              </h3>
              <span className="text-[11px] text-txt-muted font-bold">مؤخراً</span>
            </div>
            <div className="flex items-center gap-3 bg-surface-secondary p-3 rounded-xl border border-bdr">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
                🦅
              </div>
              <div>
                <h4 className="font-black text-xs text-txt-primary">الانطلاقة البرمجية</h4>
                <p className="text-[11px] text-txt-muted">أكملت أول 5 دروس تفاعلية بنجاح.</p>
              </div>
            </div>
          </Card>

          {/* Group Leaderboard Position */}
          <Card variant="default" padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-txt-primary text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500" />
                <span>ترتيبك في لوحة الأوائل</span>
              </h3>
              <Badge variant="primary" size="sm">المركز 3</Badge>
            </div>
            <p className="text-xs text-txt-muted leading-relaxed">
              تفصلك 30 XP فقط عن المركز الثاني! واصل إكمال الدروس والتطبيقات البرمجية للتصدر.
            </p>
            <Link to="/app/leaderboard" className="block text-center text-xs font-extrabold text-orange-500 hover:underline pt-1">
              عرض جدول الترتيب الكامل
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
