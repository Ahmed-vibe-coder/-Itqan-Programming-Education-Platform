import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course, Module } from '@/types/database';
import { BookOpen, CheckCircle2, Lock, Play, ArrowRight, Clock } from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (courseSlug) {
      courseService.getCourseBySlug(courseSlug).then((c) => {
        if (c) {
          setCourse(c);
          courseService.getCourseModules(c.id).then(setModules);
        }
      });
    }
  }, [courseSlug]);

  if (!course) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-sm text-txt-muted">جاري تحميل تفاصيل المنهج...</p>
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
