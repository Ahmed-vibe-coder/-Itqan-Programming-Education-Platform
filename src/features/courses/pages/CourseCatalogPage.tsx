import React, { useEffect, useState } from 'react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/database';
import { PageHeader, LoadingSkeleton, ErrorState, EmptyState } from '@/components/shared/StateComponents';
import { CourseCard } from '@/components/ui/CourseCard';
import { Input } from '@/components/ui/FormControls';
import { Search } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'html' | 'css' | 'js'>('all');

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

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) || c.description_ar?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || c.subject.toLowerCase() === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-8 text-right max-w-7xl mx-auto">
      <PageHeader
        title="المناهج والكورسات التعليمية"
        subtitle="اختر المسار الدراسي واستكمل الشرح والتطبيق العملي واختبر معلوماتك بنجاح"
        badge="كتالوج الكورسات"
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-itqan-card border border-bdr shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="ابحث عن كورس أو مهارة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'جميع الكورسات' },
            { id: 'html', label: 'HTML5' },
            { id: 'css', label: 'CSS3' },
            { id: 'js', label: 'JavaScript' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSubject(tab.id as any)}
              className={`px-4 py-2 rounded-itqan-btn text-xs font-black transition-all shrink-0 ${
                selectedSubject === tab.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-surface-secondary text-txt-secondary hover:text-txt-primary hover:bg-card-hover border border-bdr'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCourses} />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title="لم يتم العثور على كورسات"
          description="جرّب البحث بكلمات مختلفة أو تغيير التصفية."
          onAction={() => {
            setSearchQuery('');
            setSelectedSubject('all');
          }}
          actionLabel="إعادة ضبط الفلاتر"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              slug={course.slug}
              title={course.title_ar}
              instructor="الأكاديمية"
              level="جميع المستويات"
              duration={`${course.estimated_hours} ساعات`}
              lessonsCount={12}
              badge={course.subject.toUpperCase()}
              variant="catalog"
            />
          ))}
        </div>
      )}
    </div>
  );
};
