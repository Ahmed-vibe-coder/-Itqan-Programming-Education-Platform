import React, { useState } from 'react';
import { FileCheck, Check, Sparkles, User, AlertCircle } from 'lucide-react';

export const GradingQueuePage: React.FC = () => {
  const [items, setItems] = useState([
    {
      id: 'gr-1',
      studentName: 'محمد أحمد',
      assessmentTitle: 'امتحان الوحدة الأولى: HTML والأساسيات',
      questionPrompt: 'اشرح الفرق بين الوسمين <head> و <body> بلغة مبسطة.',
      studentAnswer: 'وسم head يحتوي على البيانات الخفية والمعلومات، أما body يحتوي على المحتوى الذي يراه الزائر على الشاشة.',
      maxScore: 10,
      givenScore: 10,
      feedback: 'إجابة ممتازة ودقيقة جداً!',
    },
  ]);

  const handleGrade = (id: string) => {
    alert('تم اعتماد الدرجة الممنوحة والتحديث سحابياً!');
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl font-bold text-txt-primary">طابور التصحيح اليدوي للأسئلة والأكواد</h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-bdr rounded-2xl p-6">
          <p className="text-sm text-txt-muted">طابور التصحيح اليدوي فارغ حالياً! جميع الإجابات جرى تقييمها.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="p-6 rounded-2xl border border-bdr bg-surface space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-bdr pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  <span className="font-bold text-sm text-txt-primary">{item.studentName}</span>
                </div>
                <span className="text-xs text-txt-muted">{item.assessmentTitle}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-txt-secondary">السؤال: {item.questionPrompt}</h4>
                <div className="p-3 bg-surface-secondary border border-bdr rounded-xl text-xs text-txt-primary leading-relaxed">
                  {item.studentAnswer}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-txt-secondary">الدرجة الممنوحة:</span>
                  <input
                    type="number"
                    defaultValue={item.givenScore}
                    max={item.maxScore}
                    className="w-16 p-1.5 border border-bdr rounded-lg text-xs font-mono font-bold text-center bg-surface"
                  />
                  <span className="text-xs text-txt-muted">من أصل {item.maxScore}</span>
                </div>

                <button
                  onClick={() => handleGrade(item.id)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد الدرجة وإرسال الملاحظات</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
