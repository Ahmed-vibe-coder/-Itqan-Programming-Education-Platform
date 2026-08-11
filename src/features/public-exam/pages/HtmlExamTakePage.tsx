import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Bookmark, Send, HelpCircle, CheckCircle2, AlertCircle, FileCode2 } from 'lucide-react';
import { getHtmlExamQuestions } from '@/data/htmlExamQuestions';
import { publicHtmlExamService } from '@/services/publicHtmlExamService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const HtmlExamTakePage: React.FC = () => {
  const navigate = useNavigate();

  const studentName = localStorage.getItem('itqan_student_name') || 'طالب إتقان';
  const [questions] = useState(() => getHtmlExamQuestions());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('itqan_student_name');
    if (!savedName || !savedName.trim()) {
      navigate('/html-exam', { replace: true });
    }
    // Scroll to top when changing question
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIdx, navigate]);

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (qId: string, optId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const toggleReview = (qId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswerId) {
        correctCount++;
      }
    });

    try {
      const { attempt } = await publicHtmlExamService.submitExam(
        studentName,
        correctCount,
        totalQuestions,
        answers
      );

      navigate(`/html-exam/result/${attempt.id}`, { replace: true });
    } catch (err) {
      console.error('Failed to submit public html exam attempt:', err);
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-txt-primary p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6 text-right">
        {/* Top Header Card */}
        <Card variant="default" padding="sm" className="flex items-center justify-between sticky top-4 z-30 shadow-md border-brand-primary/20 bg-surface/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center font-bold">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-sm text-txt-primary">اختبار HTML الشامل</h1>
              <p className="text-[11px] text-txt-muted font-bold">الطالب: {studentName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-txt-muted font-bold hidden sm:inline">
              تمت إجابة {answeredCount} من أصل {totalQuestions} سؤالاً
            </span>
            <Button
              onClick={() => setShowConfirmModal(true)}
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-4 h-4" />}
            >
              إنهاء وتسليم
            </Button>
          </div>
        </Card>

        {/* Progress Bar */}
        <div className="w-full bg-surface-secondary h-2.5 rounded-full overflow-hidden border border-bdr">
          <div
            className="bg-gradient-to-r from-brand-primary to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 30 Questions Navigator Bar */}
        <Card variant="default" padding="sm" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-txt-muted font-bold">
            <span>التنقل السريع بين الأسئلة (30 سؤالاً):</span>
            <span className="text-brand-primary">{progressPercent}% مكتمل</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isMarked = !!markedForReview[q.id];
              const isCurrent = idx === currentIdx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all relative shrink-0 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20 scale-105 shadow-md'
                      : isAnswered
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      : 'bg-surface-secondary border border-bdr text-txt-muted hover:border-brand-primary/40'
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
        </Card>

        {/* Main Question Card */}
        <Card variant="default" padding="lg" className="space-y-6 shadow-sm">
          {/* Question Header */}
          <div className="flex items-start justify-between gap-4 border-b border-bdr pb-4">
            <div className="space-y-1">
              <Badge variant="primary" size="sm">
                سؤال {currentIdx + 1} من {totalQuestions} — {currentQ.category}
              </Badge>
              <h2 className="text-lg md:text-xl font-black text-txt-primary leading-relaxed pt-1">
                {currentQ.prompt}
              </h2>
            </div>

            <button
              onClick={() => toggleReview(currentQ.id)}
              className={`p-2 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all shrink-0 ${
                markedForReview[currentQ.id]
                  ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                  : 'border-bdr text-txt-muted hover:text-txt-primary bg-surface-secondary'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">مراجعة لاحقاً</span>
            </button>
          </div>

          {/* Optional Code Snippet */}
          {currentQ.codeSnippet && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-100 font-mono text-sm code-block overflow-x-auto" dir="ltr">
              <pre><code>{currentQ.codeSnippet}</code></pre>
            </div>
          )}

          {/* Question Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`w-full p-4 rounded-2xl border text-right text-sm font-bold transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-sm ring-2 ring-brand-primary/20'
                      : 'border-bdr bg-surface-secondary hover:border-brand-primary/40 text-txt-primary'
                  }`}
                >
                  <span className={opt.isCode ? 'font-mono text-sm' : ''} dir={opt.isCode ? 'ltr' : undefined}>
                    {opt.text}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-bdr bg-surface'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((prev) => prev - 1)}
            variant="secondary"
            size="md"
            leftIcon={<ArrowRight className="w-4 h-4" />}
          >
            السؤال السابق
          </Button>

          {currentIdx < totalQuestions - 1 ? (
            <Button
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              variant="primary"
              size="md"
              rightIcon={<ArrowLeft className="w-4 h-4" />}
            >
              السؤال التالي
            </Button>
          ) : (
            <Button
              onClick={() => setShowConfirmModal(true)}
              variant="primary"
              size="lg"
              leftIcon={<Send className="w-4 h-4" />}
            >
              تسليم الامتحان النهائي
            </Button>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-txt-primary">تأكيد تسليم الامتحان؟</h3>
                <p className="text-xs text-txt-muted font-bold leading-relaxed">
                  لقد قمت بإجابة <strong className="text-brand-primary">{answeredCount}</strong> من أصل{' '}
                  <strong>{totalQuestions}</strong> سؤالاً. هل أنت متأكد من تسليم الإجابات واحتساب النتيجة؟
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={handleFinalSubmit}
                  isLoading={isSubmitting}
                  variant="primary"
                  size="md"
                >
                  نعم، سلم الإجابات
                </Button>
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="ghost"
                  size="md"
                >
                  العودة للأسئلة
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
