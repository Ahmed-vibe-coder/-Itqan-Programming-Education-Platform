import React, { useState } from 'react';
import { CheckCircle2, XCircle, ShieldCheck, Sparkles, ArrowLeft, RotateCcw, Award } from 'lucide-react';

interface QuestionItem {
  id: string;
  prompt_ar: string;
  options: Array<{ id: string; text_ar: string; code?: string }>;
  correct_id: string;
  explanation_ar: string;
}

interface MasteryGateProps {
  questions: QuestionItem[];
  onPassed: () => void;
  nextLessonId?: string;
}

export const MasteryGate: React.FC<MasteryGateProps> = ({
  questions,
  onPassed,
  nextLessonId,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectOption = (qId: string, optId: string) => {
    if (submitted && passed) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert('يرجى إجابة جميع الأسئلة المطلوبة أولاً.');
      return;
    }

    setLoading(true);

    // Validate 100% pass score
    let allCorrect = true;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] !== q.correct_id) {
        allCorrect = false;
      }
    });

    setSubmitted(true);
    setPassed(allCorrect);

    if (allCorrect) {
      onPassed();
    }

    setLoading(false);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setPassed(false);
  };

  return (
    <div className="mt-12 p-6 md:p-8 rounded-3xl bg-surface border-2 border-brand-primary/30 shadow-md space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-txt-primary">تأكد أنك فهمت 🎯</h3>
            <p className="text-xs text-txt-muted">أكمل أسئلة التحقق للتمكن من فتح الدرس التالي برصيد كامل.</p>
          </div>
        </div>

        {passed && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>تم الإتقان بنسبة 100%!</span>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correct_id;

          return (
            <div key={q.id} className="space-y-3 bg-surface-secondary p-5 rounded-2xl border border-bdr">
              <h4 className="font-bold text-sm text-txt-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-xs flex items-center justify-center font-extrabold">
                  {idx + 1}
                </span>
                <span>{q.prompt_ar}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {q.options.map((opt) => {
                  const isSelected = userChoice === opt.id;
                  let borderStyle = 'border-bdr bg-surface hover:border-bdr-strong';

                  if (submitted) {
                    if (opt.id === q.correct_id) {
                      borderStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      borderStyle = 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400';
                    }
                  } else if (isSelected) {
                    borderStyle = 'border-brand-primary bg-brand-primary/10 text-brand-primary font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`p-3.5 rounded-xl border text-xs text-right transition-all flex items-center justify-between ${borderStyle}`}
                    >
                      <span className={opt.code ? 'font-mono text-left' : ''} dir={opt.code ? 'ltr' : undefined}>
                        {opt.text_ar || opt.code}
                      </span>
                      {submitted && opt.id === q.correct_id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation feedback */}
              {submitted && (
                <div
                  className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}
                >
                  <p className="font-bold mb-0.5">{isCorrect ? 'إجابة صحيحة ممتاز!' : 'إجابة تحتاج مراجعة:'}</p>
                  <p>{q.explanation_ar}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-bdr flex items-center justify-between">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>إرسال إجابات التحقق</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : passed ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-500" />
              <div>
                <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-300">أحسنت! تم إلغاء القفل عن الدرس التالي</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">+25 XP تمت إضافتها لرصيدك.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between gap-4">
            <span className="text-xs text-red-500 font-medium">تحتاج 100% لإتقان الدرس وتجاوز هذه المرحلة.</span>
            <button
              type="button"
              onClick={handleRetry}
              className="px-5 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
