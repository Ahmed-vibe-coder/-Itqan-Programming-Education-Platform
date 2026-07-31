import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Bookmark, ArrowRight, ArrowLeft, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ExamPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(20 * 60); // 20 mins
  const [submitting, setSubmitting] = useState(false);

  interface OptionItem {
    id: string;
    text: string;
    code?: boolean;
  }

  interface QuestionItem {
    id: string;
    prompt: string;
    code?: string;
    options: OptionItem[];
  }

  const questions: QuestionItem[] = [
    {
      id: 'q1',
      prompt: 'ما المعنى الدلالي للوسم <header> في صفحة الويب؟',
      options: [
        { id: 'a', text: 'تمثيل الهيدر والترويسة العلوية للموقع' },
        { id: 'b', text: 'إضافة رابط خارجي محمي' },
        { id: 'c', text: 'تغيير نوع الخط للفقرات' },
        { id: 'd', text: 'إخفاء عناصر الصفحة' },
      ],
    },
    {
      id: 'q2',
      prompt: 'أي المحددات التالية يمثل معرّف ID في لغة CSS؟',
      options: [
        { id: 'a', text: '.main-title' },
        { id: 'b', text: '#main-title', code: true },
        { id: 'c', text: '*main-title' },
        { id: 'd', text: '$main-title' },
      ],
    },
    {
      id: 'q3',
      prompt: 'ما النتيجة المتوقعة للرمز البرمجي التالي في JavaScript؟',
      code: 'let age = 12;\nconsole.log(age + 3);',
      options: [
        { id: 'a', text: '15' },
        { id: 'b', text: '123' },
        { id: 'c', text: 'Error' },
        { id: 'd', text: 'undefined' },
      ],
    },
  ];

  // Timer Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: string, optId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const toggleReview = (qId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    setSubmitting(true);

    // Mock attempt submission
    setTimeout(() => {
      navigate(`/app/results/att-101`, { replace: true });
    }, 1000);
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sticky Header Bar */}
      <div className="bg-surface border border-bdr rounded-2xl p-4 flex items-center justify-between sticky top-20 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-txt-primary">امتحان HTML والأساسيات</span>
          <span className="text-xs text-txt-muted">
            سؤال {currentIdx + 1} من أصل {questions.length}
          </span>
        </div>

        {/* Timer Bar */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono font-bold text-sm">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>{formatTimer(timeLeftSeconds)}</span>
        </div>
      </div>

      {/* Question Navigator Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isMarked = !!markedForReview[q.id];
          const isCurrent = idx === currentIdx;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-10 h-10 rounded-xl text-xs font-bold transition-all relative shrink-0 ${
                isCurrent
                  ? 'bg-brand-primary text-white ring-2 ring-brand-primary/40 scale-105'
                  : isAnswered
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                  : 'bg-surface border border-bdr text-txt-muted hover:border-bdr-strong'
              }`}
            >
              {idx + 1}
              {isMarked && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-surface" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Question Surface */}
      <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg md:text-xl font-bold text-txt-primary leading-relaxed">
            {currentQ.prompt}
          </h2>
          <button
            onClick={() => toggleReview(currentQ.id)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              markedForReview[currentQ.id]
                ? 'bg-amber-500/10 border-amber-500 text-amber-600'
                : 'border-bdr text-txt-muted hover:text-txt-primary'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">تحديد للمراجعة</span>
          </button>
        </div>

        {/* Optional Code Snippet */}
        {currentQ.code && (
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-100 font-mono text-sm code-block" dir="ltr">
            <pre><code>{currentQ.code}</code></pre>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                className={`w-full p-4 rounded-2xl border text-right text-sm transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-bold shadow-sm'
                    : 'border-bdr bg-surface-secondary hover:border-bdr-strong text-txt-primary'
                }`}
              >
                <span className={opt.code ? 'font-mono' : ''} dir={opt.code ? 'ltr' : undefined}>
                  {opt.text}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-bdr'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((prev) => prev - 1)}
          className="px-5 py-2.5 rounded-xl border border-bdr text-txt-secondary hover:text-txt-primary text-xs font-bold disabled:opacity-40 flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>السؤال السابق</span>
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx((prev) => prev + 1)}
            className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <span>السؤال التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmitExam}
            disabled={submitting}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>تسليم الامتحان النهائي</span>
          </button>
        )}
      </div>
    </div>
  );
};
