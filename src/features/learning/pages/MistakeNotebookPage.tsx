import React, { useEffect, useState } from 'react';
import { mistakeService, MistakeEntry } from '@/services/mistakeService';
import { useAuth } from '@/app/providers/AuthProvider';
import { BookMarked, CheckCircle2, AlertTriangle, HelpCircle, RefreshCw } from 'lucide-react';

export const MistakeNotebookPage: React.FC = () => {
  const { profile } = useAuth();
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);

  useEffect(() => {
    if (profile?.id) {
      mistakeService.getStudentMistakes(profile.id).then(setMistakes);
    }
  }, [profile?.id]);

  const handleUpdate = async (id: string, status: MistakeEntry['review_status']) => {
    await mistakeService.updateMistakeStatus(id, status);
    setMistakes(mistakes.map((m) => (m.id === id ? { ...m, review_status: status } : m)));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl font-bold text-txt-primary">دفتر أخطائي (Mistake Notebook)</h1>
        </div>
      </div>

      <div className="space-y-4">
        {mistakes.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl border border-bdr bg-surface space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <span className="font-bold text-xs text-brand-primary">{item.concept_ar}</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                تكرار الخطأ: {item.repetitions} مرات
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-txt-primary">السؤال: {item.question_prompt}</h4>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 font-mono">
                إجابتك السابقة: {item.student_answer || 'إجابة غير دقيقة'}
              </div>
              <div className="p-3 bg-surface-secondary border border-bdr rounded-xl text-txt-secondary leading-relaxed">
                <span className="font-bold block text-txt-primary mb-1">الشرح والتصحيح:</span>
                {item.explanation_ar}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-txt-muted">حالة المراجعة الشخصية:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(item.id, 'reviewing')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                    item.review_status === 'reviewing'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-bdr bg-surface-secondary text-txt-secondary'
                  }`}
                >
                  أراجعه الآن
                </button>
                <button
                  onClick={() => handleUpdate(item.id, 'mastered')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                    item.review_status === 'mastered'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-bdr bg-surface-secondary text-txt-secondary'
                  }`}
                >
                  فهمته تماماً
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
