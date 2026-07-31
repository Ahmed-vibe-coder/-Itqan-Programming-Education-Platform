import React from 'react';
import { Bookmark, BookOpen, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookmarksPage: React.FC = () => {
  const bookmarks = [
    {
      id: 'b1',
      lessonId: 'l1030000-0000-0000-0000-000000000003',
      title: 'هيكل مستند HTML الأساسي',
      courseTitle: 'HTML من الصفر',
      savedDate: 'اليوم',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
          <h1 className="text-xl font-bold text-txt-primary">الدروس والمواضيع المحفوظة</h1>
        </div>
      </div>

      <div className="space-y-3">
        {bookmarks.map((bm) => (
          <div key={bm.id} className="p-4 rounded-2xl border border-bdr bg-surface flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md">
                {bm.courseTitle}
              </span>
              <h3 className="font-bold text-sm text-txt-primary">{bm.title}</h3>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/app/lessons/${bm.lessonId}`}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>مراجعة الدرس</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
