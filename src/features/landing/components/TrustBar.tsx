import React, { useEffect, useState } from 'react';
import { BookOpen, CheckSquare, Layers, Award } from 'lucide-react';
import { courseService } from '@/services/courseService';

export const TrustBar: React.FC = () => {
  const [coursesCount, setCoursesCount] = useState<number>(3);

  useEffect(() => {
    let isMounted = true;
    courseService.getPublishedCourses()
      .then(courses => {
        if (!isMounted) return;
        if (courses && courses.length > 0) {
          setCoursesCount(courses.length);
        }
      })
      .catch(err => {
        console.warn('Failed to load live course stats:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const items = [
    {
      icon: BookOpen,
      title: `${coursesCount} مسارات تعليمية متكاملة`,
      subtitle: 'تطوير الويب والبرمجة من الصفر',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      icon: CheckSquare,
      title: 'اختبارات تفاعلية',
      subtitle: 'بوابة إتقان للتأكد من فهم كل درس',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Layers,
      title: 'مشاريع تطبيقية',
      subtitle: 'تطبيقات ومواقع حقيقية متكاملة',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Award,
      title: 'شهادات إنجاز',
      subtitle: 'شهادات موثقة عند إتمام كل مسار',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section className="border-b border-bdr bg-surface-secondary/50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-card border border-bdr p-5 rounded-itqan-card flex items-center gap-4 transition-all hover:border-orange-500/40 shadow-sm hover:shadow-itqan-soft group text-right"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h3 className="font-extrabold text-base text-txt-primary">{item.title}</h3>
                  <p className="text-xs text-txt-muted mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
