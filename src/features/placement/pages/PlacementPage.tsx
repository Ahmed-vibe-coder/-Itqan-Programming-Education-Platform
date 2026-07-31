import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, ArrowRight, ArrowLeft, Award, Sparkles } from 'lucide-react';

export const PlacementPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);

  const placementQuestions = [
    {
      id: 1,
      prompt: 'ما هي اللغة المسؤولة عن بناء الهيكل الأساسي لصفحات الويب؟',
      options: ['HTML', 'CSS', 'JavaScript', 'Python'],
      correct: 'HTML',
    },
    {
      id: 2,
      prompt: 'أي وسم يُستخدم لإضافة رابط تشعبي لصفحة أخرى؟',
      options: ['<a>', '<link>', '<href>', '<url>'],
      correct: '<a>',
    },
    {
      id: 3,
      prompt: 'ما هي الخاصية المسؤولة عن تغيير لون خلفية العنصر في CSS؟',
      options: ['background-color', 'color', 'bg-style', 'fill-color'],
      correct: 'background-color',
    },
  ];

  const handleSelect = (opt: string) => {
    setAnswers({ ...answers, [currentQ]: opt });
  };

  const handleNext = () => {
    if (currentQ < placementQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-bdr pb-4">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-txt-primary">اختبار تحديد المستوى التكيفي (Placement Test)</h1>
            <p className="text-xs text-txt-muted">فحص سريع لمعرفتك السابقة لبناء خطتك الدراسية الشخصية</p>
          </div>
        </div>

        {!finished ? (
          <div className="space-y-6 text-right">
            <div className="flex items-center justify-between text-xs text-txt-muted">
              <span>السؤال {currentQ + 1} من {placementQuestions.length}</span>
              <span className="font-mono font-bold text-brand-primary">HTML Basics</span>
            </div>

            <h3 className="font-bold text-base text-txt-primary">
              {placementQuestions[currentQ].prompt}
            </h3>

            <div className="space-y-3">
              {placementQuestions[currentQ].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all font-mono text-xs font-bold ${
                    answers[currentQ] === opt
                      ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/30 text-brand-primary'
                      : 'border-bdr bg-surface-secondary text-txt-primary hover:border-bdr-strong'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              disabled={!answers[currentQ]}
              onClick={handleNext}
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>{currentQ < placementQuestions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة وتوصية الانطلاق'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-txt-primary">تم رصد وتحديد مستواك بنجاح! 🎉</h2>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 font-bold max-w-md mx-auto">
                التوصية الدراسية: ابدأ من "الوحدة الأولى: أساسيات الإنترنت وHTML" مع تعزيز مفاهيم الوسوم النسبية.
              </div>
            </div>

            <button
              onClick={() => navigate('/app/roadmap')}
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <span>الانتقال لخريطة التعلم الشخصية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
