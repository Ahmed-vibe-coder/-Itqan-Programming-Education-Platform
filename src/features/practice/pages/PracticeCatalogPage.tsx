import React, { useState } from 'react';
import { Code2, Play, CheckCircle2, ArrowLeft, Sparkles, X, Zap } from 'lucide-react';

interface PracticeItem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  xp: number;
  initialCode: string;
  instruction: string;
}

export const PracticeCatalogPage: React.FC = () => {
  const [practiceItems] = useState<PracticeItem[]>([
    {
      id: 'p1',
      title: 'إكمال الهيكل المفقود في HTML',
      category: 'HTML',
      difficulty: 'سهل',
      xp: 20,
      initialCode: `<!DOCTYPE html>\n<html>\n  <head>\n    <!-- أضف عنوان الصفحة هنا -->\n  </head>\n  <body>\n    <h1>مرحباً بالعالم!</h1>\n  </body>\n</html>`,
      instruction: 'أضف الوسم <title>صفحتي</title> داخل قسم <head> لجعل الصفحة مكتملة.',
    },
    {
      id: 'p2',
      title: 'تحديد العناصر وتلوين العناوين بـ CSS',
      category: 'CSS',
      difficulty: 'متوسط',
      xp: 30,
      initialCode: `h1 {\n  /* تجعل لون النص أحمر */\n}`,
      instruction: 'اكتب الخاصية color: red; داخل محدد h1 لتلوين العنوان باللون الأحمر.',
    },
    {
      id: 'p3',
      title: 'حساب المتغيرات وإظهار النتيجة في Console',
      category: 'JavaScript',
      difficulty: 'متوسط',
      xp: 40,
      initialCode: `let x = 5;\nlet y = 10;\n// اطبع مجموع x و y هنا`,
      instruction: 'استخدم console.log(x + y); لطباعة المجموع في المنصة.',
    },
  ]);

  const [activeChallenge, setActiveChallenge] = useState<PracticeItem | null>(null);
  const [userCode, setUserCode] = useState('');
  const [solved, setSolved] = useState(false);

  const handleStartChallenge = (item: PracticeItem) => {
    setActiveChallenge(item);
    setUserCode(item.initialCode);
    setSolved(false);
  };

  const handleTestCode = () => {
    setSolved(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary flex items-center gap-2">
            <Code2 className="w-6 h-6 text-brand-primary" />
            <span>مركز التدريب البرمجي التفاعلي</span>
          </h1>
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
                onClick={() => handleStartChallenge(item)}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>بدء التحدي</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Challenge Runner Modal */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-bdr rounded-3xl p-6 w-full max-w-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-txt-primary">{activeChallenge.title}</h3>
              </div>
              <button onClick={() => setActiveChallenge(null)} className="text-txt-muted hover:text-txt-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-secondary border border-bdr text-xs text-txt-secondary space-y-1">
              <span className="font-bold text-txt-primary block">التعليمات المطلوبة:</span>
              <p>{activeChallenge.instruction}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-txt-secondary mb-1">المحرر التفاعلي:</label>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                dir="ltr"
                rows={7}
                className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl border border-bdr focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-left"
              />
            </div>

            {solved && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>إجابة ممتازة! جرى فحص الكود وحصلت على +{activeChallenge.xp} XP بنجاح.</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-amber-500 font-bold text-xs flex items-center gap-1">
                <Zap className="w-4 h-4 fill-amber-500" />
                <span>+{activeChallenge.xp} XP عند الحل</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChallenge(null)}
                  className="px-4 py-2 bg-surface-secondary border border-bdr text-xs font-bold rounded-xl text-txt-secondary"
                >
                  إغلاق
                </button>
                <button
                  onClick={handleTestCode}
                  className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>فحص وتشغيل الكود</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

