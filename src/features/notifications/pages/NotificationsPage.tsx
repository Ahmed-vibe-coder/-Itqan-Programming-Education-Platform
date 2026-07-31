import React, { useState } from 'react';
import { Bell, CheckCircle2, BookOpen, Award, FileCheck2, Sparkles } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title_ar: 'تم فتح درس جديد!',
      body_ar: 'قام المعلم بإنشاء ونشر درس جديد في كورس HTML: "هيكل مستند HTML".',
      type: 'course',
      is_read: false,
      date: 'منذ 10 دقائق',
    },
    {
      id: 'n2',
      title_ar: 'إنجاز مكتسب جديد 🏆',
      body_ar: 'تهانينا! حصلت على وسام "المستمر الشغوف" بعد 3 أيام من التعلم المتواصل.',
      type: 'achievement',
      is_read: false,
      date: 'منذ ساعة',
    },
    {
      id: 'n3',
      title_ar: 'اختبار متاح للعرض',
      body_ar: 'تمت إضافتك لـ "امتحان الوحدة الأولى: HTML والأساسيات". متاح للتقديم الآن.',
      type: 'exam',
      is_read: true,
      date: 'أمس',
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-primary" />
          <h1 className="text-xl font-bold text-txt-primary">مركز الإشعارات والتنبيهات</h1>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>تحديد الكل ككمقروء</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
              n.is_read
                ? 'bg-surface border-bdr'
                : 'bg-brand-primary/5 border-brand-primary/30 shadow-sm'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                n.type === 'achievement'
                  ? 'bg-amber-500/10 text-amber-500'
                  : n.type === 'exam'
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'bg-brand-primary/10 text-brand-primary'
              }`}
            >
              {n.type === 'achievement' ? (
                <Award className="w-5 h-5" />
              ) : n.type === 'exam' ? (
                <FileCheck2 className="w-5 h-5" />
              ) : (
                <BookOpen className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-txt-primary">{n.title_ar}</h3>
                <span className="text-[10px] text-txt-muted">{n.date}</span>
              </div>
              <p className="text-xs text-txt-secondary leading-relaxed">{n.body_ar}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
