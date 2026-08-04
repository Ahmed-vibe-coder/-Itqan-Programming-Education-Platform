import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course, Module } from '@/types/database';
import { BookOpen, CheckCircle2, Lock, Play, ArrowRight, Clock, Award, Star, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton, ErrorState, EmptyState } from '@/components/shared/StateComponents';

export const CourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseData = () => {
    if (!courseSlug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    courseService
      .getCourseBySlug(courseSlug)
      .then(async (c) => {
        if (!c) {
          setCourse(null);
          setLoading(false);
          return;
        }
        setCourse(c);
        try {
          const mods = await courseService.getCourseModules(c.id);
          setModules(mods || []);
        } catch (mErr) {
          console.error('Error loading course modules:', mErr);
          setModules([]);
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching course by slug:', err);
        setError('حدث خطأ أثناء تحميل تفاصيل المنهج. يرجى المحاولة لاحقاً.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseSlug]);

  if (loading) {
    return <LoadingSkeleton type="card" count={2} className="max-w-4xl mx-auto" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchCourseData} className="max-w-md mx-auto my-8" />;
  }

  if (!course) {
    return (
      <EmptyState
        title="الكورس غير موجود"
        description="عذراً، الكورس الذي تبحث عنه غير موجود أو تم نقله."
        actionLabel="العودة لكتالوج الكورسات"
        onAction={() => window.location.href = '/app/courses'}
        className="max-w-md mx-auto my-8"
      />
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-right pb-20 md:pb-8">
      {/* Course Banner Hero */}
      <Card variant="default" padding="lg" className="border-orange-500/30 bg-gradient-to-br from-card via-surface-secondary to-card shadow-itqan-soft space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="md">{course.subject.toUpperCase()}</Badge>
            <Badge variant="success" size="md">منهج محدّث 2026</Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-txt-muted font-mono font-bold">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{course.estimated_hours} ساعات تعليمية</span>
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>4.9 (120 تقييم)</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-black text-txt-primary leading-snug">
            {course.title_ar}
          </h1>
          <p className="text-sm sm:text-base text-txt-secondary leading-relaxed max-w-3xl">
            {course.description_ar}
          </p>
        </div>

        {/* Skills & Certificate Info Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-bdr">
          <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-bdr">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-txt-primary">المهارات المكتسبة</h4>
              <p className="text-[11px] text-txt-muted">تطبيق عملي وكتابة كود حقيقي</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-bdr">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-txt-primary">التقييم المستمر</h4>
              <p className="text-[11px] text-txt-muted">اختبارات بعد كل وحدة تفاعلية</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-bdr">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-txt-primary">الشهادة المتاحة</h4>
              <p className="text-[11px] text-txt-muted">شهادة إتقان الموثقة مجاناً</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Link to="/app/lessons/l1030000-0000-0000-0000-000000000003">
            <Button variant="primary" size="lg" leftIcon={<Play className="w-5 h-5 fill-white" />}>
              ابدأ المنهج الآن
            </Button>
          </Link>
        </div>
      </Card>

      {/* Curriculum Modules Accordion / List */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-txt-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <span>الوحدات والمناهج المبرمجة</span>
        </h2>

        {modules.map((m, idx) => (
          <Card key={m.id} variant="default" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h3 className="font-black text-base text-txt-primary">
                الوحدة {idx + 1}: {m.title_ar}
              </h3>
              <Badge variant="neutral" size="sm">4 دروس</Badge>
            </div>
            <p className="text-xs text-txt-muted font-bold">{m.description_ar}</p>

            <div className="space-y-2.5 pt-2">
              <div className="p-3.5 rounded-itqan-btn border border-bdr bg-surface-secondary flex items-center justify-between text-xs transition-colors hover:border-orange-500/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <span className="font-black text-txt-primary block">هيكل مستند HTML الرئيسي والوسوم</span>
                    <span className="text-[11px] text-txt-muted">15 دقيقة &bull; شرح وتطبيق عملي</span>
                  </div>
                </div>
                <Link to="/app/lessons/l1030000-0000-0000-0000-000000000003">
                  <Button variant="primary" size="sm" leftIcon={<Play className="w-3.5 h-3.5 fill-white" />}>
                    دخول الدرس
                  </Button>
                </Link>
              </div>

              <div className="p-3.5 rounded-itqan-btn border border-bdr bg-surface-secondary/50 flex items-center justify-between text-xs opacity-75">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-bdr text-txt-muted flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <span className="font-black text-txt-primary block">العناوين والفقرات والقوائم في HTML</span>
                    <span className="text-[11px] text-txt-muted">20 دقيقة &bull; تطبيق برمجي</span>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-txt-muted" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Mobile Bottom Sticky Action Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-bdr p-3 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-txt-primary block">{course.title_ar}</span>
          <span className="text-[11px] text-orange-500 font-bold">{course.estimated_hours} ساعات تعليمية</span>
        </div>
        <Link to="/app/lessons/l1030000-0000-0000-0000-000000000003">
          <Button variant="primary" size="md" leftIcon={<Play className="w-4 h-4 fill-white" />}>
            ابدأ الكورس
          </Button>
        </Link>
      </div>
    </div>
  );
};
