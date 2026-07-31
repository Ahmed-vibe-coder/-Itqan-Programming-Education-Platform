import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  BookOpen,
  FileCheck,
  Code2,
  Bell,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  Globe
} from 'lucide-react';

interface ScheduledItem {
  id: string;
  title: string;
  type: 'lesson' | 'exam' | 'project' | 'announcement';
  groupName: string;
  scheduledTimeCairo: string; // Africa/Cairo
  status: 'scheduled' | 'published' | 'cancelled';
}

export const ContentCalendarPage: React.FC = () => {
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([
    {
      id: 'sch-1',
      title: 'نشر درس: تنسيق العناصر باستخدام Flexbox',
      type: 'lesson',
      groupName: 'المجموعة الأولى (أبطال HTML)',
      scheduledTimeCairo: '2026-08-01 10:00 ص (القاهرة)',
      status: 'scheduled',
    },
    {
      id: 'sch-2',
      title: 'افتتاح امتحان الوحدة الثانية — مفاهيم CSS',
      type: 'exam',
      groupName: 'المجموعة الأولى (أبطال HTML)',
      scheduledTimeCairo: '2026-08-03 04:00 م (القاهرة)',
      status: 'scheduled',
    },
    {
      id: 'sch-3',
      title: 'تسليم مشروع: بناء صفحة هبوط تفاعلية',
      type: 'project',
      groupName: 'مجموعة الموهوبين',
      scheduledTimeCairo: '2026-08-05 08:00 م (القاهرة)',
      status: 'scheduled',
    }
  ]);

  const [viewMode, setViewMode] = useState<'agenda' | 'week'>('agenda');
  const [filterGroup, setFilterGroup] = useState('all');

  const handlePublishNow = (id: string) => {
    setScheduledItems(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'published' } : item)
    );
  };

  const handleCancelSchedule = (id: string) => {
    setScheduledItems(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'cancelled' } : item)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">تقويم المحتوى والإطلاق الجدولي (Content Calendar)</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-brand-primary" />
            <span>إدارة مواعيد نشر الدروس والامتحانات والمشاريع بالتوقيت المحلي (Africa/Cairo — القاهرة).</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${viewMode === 'agenda' ? 'bg-brand-primary text-white' : 'bg-surface-secondary border border-bdr text-txt-muted'}`}
          >
            عرض الأجندة
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${viewMode === 'week' ? 'bg-brand-primary text-white' : 'bg-surface-secondary border border-bdr text-txt-muted'}`}
          >
            عرض الأسبوع
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-bdr rounded-2xl p-4 flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-txt-muted" />
          <span className="font-bold text-txt-secondary">تصفية حسب المجموعة:</span>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="bg-surface-secondary border border-bdr rounded-xl px-3 py-1.5 text-xs text-txt-primary"
          >
            <option value="all">جميع المجموعات</option>
            <option value="group1">المجموعة الأولى (أبطال HTML)</option>
            <option value="group2">مجموعة الموهوبين</option>
          </select>
        </div>

        <span className="text-xs font-mono font-bold text-brand-primary">التوقيت الحالي: Africa/Cairo (UTC+3)</span>
      </div>

      {/* Agenda Items List */}
      <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2">جدول الإطلاقات المجدولة القادمة</h2>

        <div className="space-y-3">
          {scheduledItems.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-bdr bg-surface-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    item.type === 'lesson' ? 'bg-brand-primary/10 text-brand-primary' :
                    item.type === 'exam' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {item.type === 'lesson' ? 'درس مجدول' : item.type === 'exam' ? 'امتحان مجدول' : 'مشروع'}
                  </span>
                  <h3 className="text-xs font-bold text-txt-primary">{item.title}</h3>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-txt-muted">
                  <span>المجموعة: {item.groupName}</span>
                  <span className="flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400">
                    <Clock className="w-3 h-3" />
                    <span>{item.scheduledTimeCairo}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'scheduled' ? (
                  <>
                    <button
                      onClick={() => handlePublishNow(item.id)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>نشر الآن</span>
                    </button>
                    <button
                      onClick={() => handleCancelSchedule(item.id)}
                      className="px-3 py-1.5 bg-surface border border-bdr hover:bg-rose-500/10 text-rose-500 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>إلغاء الجدولة</span>
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'published' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                  }`}>
                    {item.status === 'published' ? 'تم النشر بنجاح' : 'ملغي'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
