import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/database';
import { useAuth } from '@/app/providers/AuthProvider';

export const LearningPathsSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    courseService.getPublishedCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load published courses:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getCourseDetails = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'html':
        return {
          icon: '</>',
          tag: 'HTML5',
          color: 'text-[#F97316]',
          bg: 'bg-[#F97316]/10',
          borderHover: 'hover:border-[#F97316]/50',
          badgeBg: 'bg-[#F97316]/10 text-[#F97316]',
          level: 'مستوى مبتدئ',
          lessons: '12 درساً تفاعلياً',
          duration: '4 ساعات',
          status: 'متاح',
          progress: 85,
        };
      case 'css':
        return {
          icon: '#{}',
          tag: 'CSS3',
          color: 'text-[#3B82F6]',
          bg: 'bg-[#3B82F6]/10',
          borderHover: 'hover:border-[#3B82F6]/50',
          badgeBg: 'bg-[#3B82F6]/10 text-[#3B82F6]',
          level: 'مستوى متوسط',
          lessons: '16 درساً تفاعلياً',
          duration: '5 ساعات',
          status: 'متاح',
          progress: 40,
        };
      case 'js':
      case 'javascript':
        return {
          icon: 'JS',
          tag: 'JavaScript',
          color: 'text-[#F59E0B]',
          bg: 'bg-[#F59E0B]/10',
          borderHover: 'hover:border-[#F59E0B]/50',
          badgeBg: 'bg-[#F59E0B]/10 text-[#F59E0B]',
          level: 'مستوى متقدم',
          lessons: '18 درساً تفاعلياً',
          duration: '6 ساعات',
          status: 'متاح',
          progress: 15,
        };
      default:
        return {
          icon: '</>',
          tag: 'تطوير الويب',
          color: 'text-[#4F63F6]',
          bg: 'bg-[#4F63F6]/10',
          borderHover: 'hover:border-[#4F63F6]/50',
          badgeBg: 'bg-[#4F63F6]/10 text-[#4F63F6]',
          level: 'جميع المستويات',
          lessons: '15 درساً تفاعلياً',
          duration: '5 ساعات',
          status: 'متاح',
          progress: 0,
        };
    }
  };

  return (
    <section id="paths" className="py-20 lg:py-28 bg-[#07111F]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Title & Description */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4F63F6]/12 border border-[#4F63F6]/25 text-[#4F63F6] dark:text-[#6577FF] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خارطة طريق تعليمية مدروسة</span>
          </div>
          <h2 className="text-3xl lg:text-[40px] font-extrabold text-[#F8FAFC] mb-4 tracking-tight leading-snug">
            مسارات التعلّم الأساسية
          </h2>
          <p className="text-base sm:text-lg text-[#CBD5E1] leading-[1.8]">
            مناهج متدرجة ومنظمة تعبر بك من البداية حتى الاحتراف في بناء وتنسيق وتطوير تطبيقات الويب
          </p>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#101E31]/60 animate-pulse border border-[rgba(148,163,184,0.18)] p-7" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {courses.map((course) => {
              const meta = getCourseDetails(course.subject);
              return (
                <div
                  key={course.id}
                  className={`bg-[#101E31] border border-[rgba(148,163,184,0.18)] ${meta.borderHover} rounded-2xl p-6 sm:p-7 transition-all duration-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between group`}
                >
                  <div>
                    {/* Top Row: Icon, Level Badge & Status */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-14 h-14 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center font-mono font-bold text-xl border border-white/5`}>
                        {meta.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          {meta.status}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${meta.badgeBg}`}>
                          {meta.level}
                        </span>
                      </div>
                    </div>

                    {/* Subject Code Tag */}
                    <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block mb-2">
                      {meta.tag}
                    </span>

                    {/* Course Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mb-3 group-hover:text-[#4F63F6] transition-colors leading-snug">
                      {course.title_ar}
                    </h3>

                    {/* Course Description */}
                    <p className="text-sm text-[#CBD5E1] leading-relaxed mb-6">
                      {course.description_ar}
                    </p>
                  </div>

                  <div>
                    {/* Logged in Progress Bar */}
                    {user && (
                      <div className="mb-5 pb-5 border-b border-[rgba(148,163,184,0.18)]">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#CBD5E1] mb-2">
                          <span>تقدمك في المسار</span>
                          <span className="text-[#39C6D8]">{meta.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#0B1728] rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-[#4F63F6] to-[#39C6D8] rounded-full transition-all duration-300"
                            style={{ width: `${meta.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Course Stats Footer */}
                    <div className="pt-4 border-t border-[rgba(148,163,184,0.18)] flex items-center justify-between text-xs text-[#94A3B8] mb-6">
                      <div className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="w-4 h-4 text-[#4F63F6]" />
                        <span>{meta.lessons}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-4 h-4 text-[#39C6D8]" />
                        <span>{course.estimated_hours || meta.duration} ساعات</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={user ? `/courses/${course.slug}` : '/register'}
                      className="min-h-[44px] w-full py-3 px-4 text-sm font-bold text-white bg-[#4F63F6] hover:bg-[#6577FF] active:bg-[#3B4ED8] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <span>{user ? 'متابعة التعلم' : 'ابدأ هذا المسار الآن'}</span>
                      <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

