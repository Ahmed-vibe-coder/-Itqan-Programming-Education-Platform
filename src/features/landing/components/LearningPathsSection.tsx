import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/database';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/shared/StateComponents';

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
          level: 'مستوى مبتدئ',
          lessons: '12 درساً تفاعلياً',
          duration: '4',
          status: 'متاح',
          progress: 85,
        };
      case 'css':
        return {
          icon: '#{}',
          tag: 'CSS3',
          level: 'مستوى متوسط',
          lessons: '16 درساً تفاعلياً',
          duration: '5',
          status: 'متاح',
          progress: 40,
        };
      case 'js':
      case 'javascript':
        return {
          icon: 'JS',
          tag: 'JavaScript',
          level: 'مستوى متقدم',
          lessons: '18 درساً تفاعلياً',
          duration: '6',
          status: 'متاح',
          progress: 15,
        };
      default:
        return {
          icon: '</>',
          tag: 'تطوير الويب',
          level: 'جميع المستويات',
          lessons: '15 درساً تفاعلياً',
          duration: '5',
          status: 'متاح',
          progress: 0,
        };
    }
  };

  return (
    <section id="paths" className="py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Description */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خارطة طريق تعليمية مدروسة</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-txt-primary mb-4 tracking-tight leading-snug">
            مسارات التعلّم الأساسية
          </h2>
          <p className="text-base sm:text-lg text-txt-secondary leading-[1.8]">
            مناهج متدرجة ومنظمة تعبر بك من البداية حتى الاحتراف في بناء وتنسيق وتطوير تطبيقات الويب
          </p>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {courses.map((course) => {
              const meta = getCourseDetails(course.subject);
              return (
                <div
                  key={course.id}
                  className="bg-card border border-bdr hover:border-orange-500/40 rounded-itqan-card p-6 sm:p-7 transition-all duration-200 shadow-sm hover:shadow-itqan-soft hover:-translate-y-1 flex flex-col justify-between group text-right"
                >
                  <div>
                    {/* Top Row: Icon, Level Badge & Status */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-mono font-black text-xl border border-orange-500/20">
                        {meta.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" size="sm">{meta.status}</Badge>
                        <Badge variant="primary" size="sm">{meta.level}</Badge>
                      </div>
                    </div>

                    {/* Subject Code Tag */}
                    <span className="text-xs font-black text-txt-muted uppercase tracking-wider block mb-2 font-mono">
                      {meta.tag}
                    </span>

                    {/* Course Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-txt-primary mb-3 group-hover:text-orange-500 transition-colors leading-snug">
                      {course.title_ar}
                    </h3>

                    {/* Course Description */}
                    <p className="text-sm text-txt-secondary leading-relaxed mb-6">
                      {course.description_ar}
                    </p>
                  </div>

                  <div>
                    {/* Logged in Progress Bar */}
                    {user && (
                      <div className="mb-5 pb-5 border-b border-bdr">
                        <div className="flex items-center justify-between text-xs font-bold text-txt-secondary mb-2">
                          <span>تقدمك في المسار</span>
                          <span className="text-orange-500 font-mono">{meta.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-bdr-soft">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-300"
                            style={{ width: `${meta.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Course Stats Footer */}
                    <div className="pt-4 border-t border-bdr flex items-center justify-between text-xs text-txt-muted mb-6">
                      <div className="flex items-center gap-1.5 font-bold">
                        <BookOpen className="w-4 h-4 text-orange-500" />
                        <span>{meta.lessons}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{course.estimated_hours || meta.duration} ساعات</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={user ? `/app/courses/${course.slug}` : '/register'} className="block">
                      <Button variant="primary" size="md" fullWidth rightIcon={<ArrowLeft className="w-4 h-4" />}>
                        {user ? 'متابعة التعلم' : 'ابدأ هذا المسار الآن'}
                      </Button>
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
