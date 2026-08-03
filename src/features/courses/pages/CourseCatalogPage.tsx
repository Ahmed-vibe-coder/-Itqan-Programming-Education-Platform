import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/database';
import { BookOpen, ArrowLeft, Clock, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = () => {
    setLoading(true);
    setError(null);
    courseService
      .getPublishedCourses()
      .then((data) => {
        setCourses(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setError(err?.message || 'حدث خطأ أثناء تحميل الكورسات. يرجى المحاولة مرة أخرى.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">المناهج والكورسات المتاحة</h1>
          <p className="text-xs text-txt-muted">اختر المنهج الدراسي واستكمل الشرح والتطبيق العملي</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface border border-bdr rounded-2xl animate-pulse p-6" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchCourses}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 mx-auto transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-8 border border-bdr bg-surface rounded-2xl text-center space-y-3 max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-txt-muted mx-auto" />
          <h3 className="font-bold text-base text-txt-primary">لا توجد مناهج متاحة حالياً</h3>
          <p className="text-xs text-txt-muted">سيتم إضافة مناهج دورية قريباً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/app/courses/${course.slug}`}
              className="bg-surface border border-bdr hover:border-brand-primary/40 rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary font-mono font-bold flex items-center justify-center text-sm">
                  {course.subject.toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-txt-primary group-hover:text-brand-primary transition-colors">
                  {course.title_ar}
                </h3>
                <p className="text-xs text-txt-muted leading-relaxed line-clamp-3">
                  {course.description_ar}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-bdr flex items-center justify-between text-xs text-txt-secondary">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{course.estimated_hours} ساعات تعليمية</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-txt-muted group-hover:text-brand-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
