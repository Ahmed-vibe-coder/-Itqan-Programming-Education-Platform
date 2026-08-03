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
      subtitle: 'HTML, CSS, JavaScript من الصفر',
      color: 'text-[#4F63F6] dark:text-[#6577FF]',
      bg: 'bg-[#4F63F6]/10',
    },
    {
      icon: CheckSquare,
      title: 'اختبارات تفاعلية',
      subtitle: 'بوابة إتقان للتأكد من فهم كل درس',
      color: 'text-[#39C6D8]',
      bg: 'bg-[#39C6D8]/10',
    },
    {
      icon: Layers,
      title: 'مشاريع تطبيقية',
      subtitle: 'تطبيقات مواقع ويب حقيقية وكاملة',
      color: 'text-[#F4B740]',
      bg: 'bg-[#F4B740]/10',
    },
    {
      icon: Award,
      title: 'شهادات إنجاز',
      subtitle: 'شهادات موثقة عند إتمام كل مسار',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <section className="border-b border-[#94A3B8]/15 bg-[#0B1728] py-8 lg:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#101E31] border border-[rgba(148,163,184,0.18)] p-5 rounded-2xl flex items-center gap-4 transition-all hover:border-[#4F63F6]/40 hover:shadow-lg group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-base text-[#F8FAFC]">{item.title}</h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

