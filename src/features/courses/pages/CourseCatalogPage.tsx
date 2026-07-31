import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/database';
import { BookOpen, ArrowLeft, Clock, Sparkles } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getPublishedCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
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
