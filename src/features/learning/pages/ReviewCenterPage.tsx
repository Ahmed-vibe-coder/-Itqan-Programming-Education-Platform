import React, { useEffect, useState } from 'react';
import { reviewService, ReviewItem } from '@/services/reviewService';
import { useAuth } from '@/app/providers/AuthProvider';
import { RefreshCw, Play, CheckCircle2, HelpCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReviewCenterPage: React.FC = () => {
  const { profile } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    if (profile?.id) {
      reviewService
        .getDueReviews(profile.id)
        .then(setReviews)
        .catch((err) => console.error(err));
    }
  }, [profile?.id]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-brand-primary" />
          <h1 className="text-xl font-bold text-txt-primary">مركز المراجعة المتباعدة التكيفي (Spaced Review)</h1>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-5 rounded-2xl border border-bdr bg-surface flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md">
                موعد المراجعة: اليوم
              </span>
              <h3 className="font-bold text-sm text-txt-primary">{rev.lessonTitle_ar}</h3>
              <p className="text-xs text-txt-muted">الفصل المجدول: كل {rev.intervalDays} أيام للحفاظ على منحن التذكر</p>
            </div>

            <Link
              to={`/app/lessons/${rev.lessonId}`}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>بدء المراجعة السريعة</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
