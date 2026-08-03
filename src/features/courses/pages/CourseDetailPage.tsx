import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course, Module } from '@/types/database';
import { BookOpen, CheckCircle2, Lock, Play, ArrowRight, Clock, AlertCircle, RefreshCw, FileQuestion } from 'lucide-react';

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
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-txt-muted font-medium">جاري تحميل تفاصيل المنهج...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-2xl text-center space-y-4 max-w-md mx-auto my-8">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchCourseData}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 mx-auto transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 border border-bdr bg-surface rounded-3xl text-center space-y-5 max-w-md mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-txt-primary">المنهج غير موجود</h2>
          <p className="text-xs text-txt-muted leading-relaxed">
            عذراً، المنهج الدراسي الذي تبحث عنه غير موجود أو تم إزالته.
          </p>
        </div>
        <Link
          to="/app/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة المناهج</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Course Banner */}
      <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full uppercase">
            {course.subject}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-txt-muted">
            <Clock className="w-4 h-4 text-brand-primary" />
            <span>{course.estimated_hours} ساعات</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-txt-primary">{course.title_ar}</h1>
        <p className="text-sm text-txt-secondary leading-relaxed">{course.description_ar}</p>
      </div>

      {/* Curriculum Modules */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-primary" />
          <span>الوحدات والدروس المبرمجة</span>
        </h2>

        {modules.map((m, idx) => (
          <div key={m.id} className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h3 className="font-bold text-base text-txt-primary">
                الوحدة {idx + 1}: {m.title_ar}
              </h3>
            </div>
            <p className="text-xs text-txt-muted">{m.description_ar}</p>

            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between text-xs">
                <span className="font-bold text-txt-primary">هيكل مستند HTML</span>
                <Link
                  to="/app/lessons/l1030000-0000-0000-0000-000000000003"
                  className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-lg transition-all flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>دخول الدرس</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
