import React from 'react';
import { Code2, Play, CheckCircle2, ArrowLeft } from 'lucide-react';

export const PracticeCatalogPage: React.FC = () => {
  const practiceItems = [
    {
      id: 'p1',
      title: 'إكمال الهيكل المفقود في HTML',
      category: 'HTML',
      difficulty: 'سهل',
      xp: 20,
    },
    {
      id: 'p2',
      title: 'تحديد العناصر وتلوين العناوين بـ CSS',
      category: 'CSS',
      difficulty: 'متوسط',
      xp: 30,
    },
    {
      id: 'p3',
      title: 'حساب المتغيرات وإظهار النتيجة في Console',
      category: 'JavaScript',
      difficulty: 'متوسط',
      xp: 40,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">مركز التدريب البرمجي التفاعلي</h1>
          <p className="text-xs text-txt-muted">تحديات برمجة سريعة لتعزيز المهارات وصقل المفاهيم</p>
        </div>
      </div>

      <div className="space-y-4">
        {practiceItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-bdr bg-surface flex items-center justify-between shadow-sm hover:border-brand-primary/40 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md">
                  {item.category}
                </span>
                <span className="text-[11px] text-txt-muted font-medium">{item.difficulty}</span>
              </div>
              <h3 className="font-bold text-sm text-txt-primary">{item.title}</h3>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-xs text-amber-500">+{item.xp} XP</span>
              <button
                onClick={() => alert(`بدء التحدي: ${item.title}`)}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>بدء التحدي</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
