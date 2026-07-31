import React from 'react';
import { Trophy, Flame, Zap, Award, Star, CheckCircle2, Lock } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const achievements = [
    {
      id: 'a1',
      code: 'first_step',
      title: 'أول خطوة',
      description: 'سجلت دخولك وبدأت رحلتك الشيقة في البرمجة!',
      icon: '🦅',
      xp: 25,
      unlocked: true,
      date: 'اليوم',
    },
    {
      id: 'a2',
      code: 'first_lesson',
      title: 'أول درس مكتمل',
      description: 'أكملت درسك الأول بنجاح وتجاوزت بوابة الإتقان.',
      icon: '🎖️',
      xp: 50,
      unlocked: true,
      date: 'أمس',
    },
    {
      id: 'a3',
      code: 'html_starter',
      title: 'صانع الصفحات الأول',
      description: 'أتممت أول 3 دروس في كورس HTML.',
      icon: '💻',
      xp: 100,
      unlocked: true,
      date: 'منذ يومين',
    },
    {
      id: 'a4',
      code: 'streak_3',
      title: 'المستمر الشغوف',
      description: 'حافظت على التعلم لمدة 3 أيام متتالية.',
      icon: '🔥',
      xp: 75,
      unlocked: true,
      date: 'اليوم',
    },
    {
      id: 'a5',
      code: 'css_stylist',
      title: 'مهندس التنسيقات',
      description: 'أتممت أول 3 دروس في كورس CSS.',
      icon: '🎨',
      xp: 100,
      unlocked: false,
    },
    {
      id: 'a6',
      code: 'js_wizard',
      title: 'المبرمج الذكي',
      description: 'أتممت أول 3 دروس في كورس JavaScript.',
      icon: '⚡',
      xp: 100,
      unlocked: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Level Summary Header */}
      <div className="bg-gradient-to-l from-indigo-600 via-brand-primary to-purple-700 text-white rounded-3xl p-6 md:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 font-bold">
              🏆
            </div>
            <div>
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full inline-block mb-1">
                المستوى 2
              </span>
              <h1 className="text-2xl font-bold">إنجازاتك وأوسمتك</h1>
              <p className="text-xs text-indigo-100">جمع الأوسمة وحافظ على استمرارك اليومي لزيادة مستواك</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold w-full md:w-auto justify-around bg-black/20 p-4 rounded-2xl">
            <div className="text-center">
              <span className="text-txt-muted text-[11px] block">نقاط XP</span>
              <span className="text-xl font-extrabold text-amber-300 font-mono">250 XP</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-txt-muted text-[11px] block">الأيام المتتالية</span>
              <span className="text-xl font-extrabold text-orange-400 font-mono">3 أيام</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-txt-muted text-[11px] block">الأوسمة</span>
              <span className="text-xl font-extrabold text-emerald-300 font-mono">4 من 6</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
              item.unlocked
                ? 'bg-surface border-brand-primary/30 shadow-sm'
                : 'bg-surface-secondary border-bdr opacity-60 grayscale'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                item.unlocked ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-surface border border-bdr'
              }`}
            >
              {item.icon}
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-txt-primary truncate">{item.title}</h3>
                <span className="text-[11px] font-mono font-bold text-amber-500">+{item.xp} XP</span>
              </div>
              <p className="text-xs text-txt-muted leading-relaxed">{item.description}</p>
              {item.unlocked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>تم الفتح ({item.date})</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
