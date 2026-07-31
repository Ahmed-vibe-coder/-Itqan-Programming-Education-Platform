import React from 'react';
import { Calendar, Clock, BookOpen, FileText } from 'lucide-react';

export const StudentCalendarPage: React.FC = () => {
  const events = [
    { id: 'ev1', title: 'إصدار دروس الوحدة الثانية في CSS', date: 'غداً - 10:00 صباحاً', type: 'lesson' },
    { id: 'ev2', title: 'امتحان منتصف المنهج لـ HTML', date: 'الخميس القادم', type: 'exam' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary" />
          <h1 className="text-xl font-bold text-txt-primary">التقويم والأجندة الدراسية (Student Calendar)</h1>
        </div>
      </div>

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="p-4 rounded-2xl border border-bdr bg-surface flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md">
                {ev.type === 'lesson' ? 'درس جديد' : 'امتحان مجدول'}
              </span>
              <h3 className="font-bold text-sm text-txt-primary">{ev.title}</h3>
            </div>
            <span className="text-xs text-txt-muted font-medium">{ev.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
