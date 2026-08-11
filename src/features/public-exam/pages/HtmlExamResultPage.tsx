import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowLeft, BookOpen, ShieldCheck, Download, Share2, HelpCircle } from 'lucide-react';
import { getHtmlExamQuestions } from '@/data/htmlExamQuestions';
import { publicHtmlExamService, PublicExamAttempt } from '@/services/publicHtmlExamService';
import { HtmlExamCertificateModal } from '@/components/certificates/HtmlExamCertificateModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const HtmlExamResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [questions] = useState(() => getHtmlExamQuestions());
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<PublicExamAttempt | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'review'>('summary');

  useEffect(() => {
    async function loadAttempt() {
      if (!attemptId) {
        setLoading(false);
        return;
      }
      try {
        const found = await publicHtmlExamService.getAttemptById(attemptId);
        if (found) {
          setAttempt(found);
          // If student passed (score >= 50%), auto show certificate popup
          if (found.passed) {
            setShowCertificate(true);
          }
        }
      } catch (err) {
        console.error('Error fetching exam attempt:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [attemptId]);

  const handleRetakeExam = () => {
    navigate('/html-exam');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="text-xs text-txt-muted font-bold">جاري تصحيح وتجهيز نتائج الاختبار...</span>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <Card variant="default" padding="lg" className="max-w-md w-full text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-black text-txt-primary">لم يتم العثور على نتيجة المحاولة</h2>
          <p className="text-xs text-txt-muted font-bold">
            يبدو أن معرّف النتيجة غير متوفر أو تم مسحه. يمكنك البدء بمحاولة اختبار جديدة.
          </p>
          <Button onClick={handleRetakeExam} variant="primary" size="md" fullWidth>
            بدء اختبار جديد
          </Button>
        </Card>
      </div>
    );
  }

  const { student_name, score, total_questions, percentage, passed, verification_code, completed_at, answers_json } = attempt;

  return (
    <div className="min-h-screen bg-bg text-txt-primary p-4 md:p-8 font-sans">
      {/* Certificate Modal */}
      {showCertificate && passed && (
        <HtmlExamCertificateModal
          studentName={student_name}
          score={score}
          totalQuestions={total_questions}
          percentage={percentage}
          completedAt={completed_at}
          verificationCode={verification_code || 'ITQAN-HTML-2026'}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-6 text-right">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>الرئيسية</span>
          </Link>
          <Badge variant={passed ? 'success' : 'danger'} size="md">
            {passed ? 'تم اجتياز الاختبار بنجاح' : 'لم تتجاوز 50% — يلزم إعادة الاختبار'}
          </Badge>
        </div>

        {/* Main Result Summary Card */}
        <Card variant="default" padding="lg" className="text-center space-y-6 shadow-xl border-bdr relative overflow-hidden">
          <div className="text-center space-y-3">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg ${
                passed
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-emerald-500/10'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/10'
              }`}
            >
              {passed ? <Award className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>

            <h1 className="text-2xl font-black text-txt-primary">
              {passed ? `مبروك يا بطل! أتممت اختبار HTML بنجاح` : `حظاً أوفر! لم تتمكن من اجتياز الاختبار`}
            </h1>
            <p className="text-xs text-txt-muted font-bold">الطالب: {student_name}</p>
          </div>

          {/* Big Score Radial Card */}
          <div
            className={`p-6 rounded-3xl border max-w-sm mx-auto space-y-2 text-center shadow-inner ${
              passed
                ? 'bg-gradient-to-br from-emerald-500/10 via-surface-secondary to-surface border-emerald-500/30'
                : 'bg-gradient-to-br from-red-500/10 via-surface-secondary to-surface border-red-500/30'
            }`}
          >
            <span className="text-xs text-txt-muted font-bold">النسبة المئوية الحاصل عليها</span>
            <div className={`text-5xl font-black font-mono ${passed ? 'text-emerald-500' : 'text-red-500'}`}>
              %{percentage.toFixed(1)}
            </div>
            <div className="text-xs font-black text-txt-primary pt-1">
              الدرجة: {score} من أصل {total_questions} أسئلة صحيحة
            </div>
          </div>

          {/* Result Actions / Certificate Claim */}
          {passed ? (
            <div className="p-5 bg-gradient-to-r from-amber-500/15 to-emerald-500/15 border border-amber-500/30 rounded-2xl text-right space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-txt-primary">تم إصدار شهادتك الرسمية المعتمدة!</h3>
                  <p className="text-xs text-txt-muted font-bold">
                    تم رسم شهادتك الرقمية المعتمدة بكود توثيق رقمي: <span dir="ltr" className="font-mono text-brand-primary">{verification_code}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  onClick={() => setShowCertificate(true)}
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={<Award className="w-4 h-4" />}
                >
                  عرض وتحميل الشهادة الرسمية
                </Button>
                <Button
                  onClick={handleRetakeExam}
                  variant="secondary"
                  size="md"
                  fullWidth
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  إعادة الاختبار لتحسين الدرجة
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-center space-y-3">
              <p className="text-xs text-red-500 font-bold">
                عذراً، يلزم الحصول على 50% أو أكثر (15 سؤالاً من أصل 30) لإصدار الشهادة الرسمية المعتمدة.
              </p>
              <Button
                onClick={handleRetakeExam}
                variant="primary"
                size="md"
                className="bg-red-600 hover:bg-red-700 text-white border-none"
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                إعادة اختبار HTML الآن
              </Button>
            </div>
          )}

          {/* Navigation Tabs (Summary vs Review) */}
          <div className="flex items-center justify-center gap-4 border-t border-bdr pt-4">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                activeTab === 'summary'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-txt-muted hover:text-txt-primary'
              }`}
            >
              ملخص النتيجة
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'review'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-txt-muted hover:text-txt-primary'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>مراجعة الـ 30 سؤالاً وإجاباتهم</span>
            </button>
          </div>

          {/* Tab 1: Summary Stats Grid */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-2 gap-4 text-center text-xs pt-2">
              <div className="p-4 bg-surface-secondary rounded-2xl border border-bdr space-y-1">
                <span className="text-txt-muted font-bold block">عدد الإجابات الصحيحة</span>
                <span className="font-black text-base text-emerald-500 font-mono">{score} سؤالاً</span>
              </div>
              <div className="p-4 bg-surface-secondary rounded-2xl border border-bdr space-y-1">
                <span className="text-txt-muted font-bold block">عدد الإجابات الخاطئة</span>
                <span className="font-black text-base text-red-500 font-mono">{total_questions - score} إجابة</span>
              </div>
            </div>
          )}

          {/* Tab 2: Detailed Questions Review */}
          {activeTab === 'review' && (
            <div className="space-y-4 text-right pt-2">
              {questions.map((q, idx) => {
                const userChoice = answers_json[q.id];
                const isCorrect = userChoice === q.correctAnswerId;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                      isCorrect
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-txt-primary flex items-center gap-2">
                        <span>سؤال {idx + 1}:</span>
                        <span>{q.prompt}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {isCorrect ? 'إجابة صحيحة ✓' : 'إجابة خاطئة ✕'}
                      </span>
                    </div>

                    {q.codeSnippet && (
                      <div className="p-2.5 bg-slate-950 rounded-xl text-emerald-400 font-mono text-[11px] overflow-x-auto" dir="ltr">
                        <pre><code>{q.codeSnippet}</code></pre>
                      </div>
                    )}

                    {/* Choices Breakdown */}
                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt) => {
                        const isUserOption = opt.id === userChoice;
                        const isCorrectOption = opt.id === q.correctAnswerId;

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              isCorrectOption
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold'
                                : isUserOption && !isCorrect
                                ? 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300 font-bold'
                                : 'bg-surface border-bdr text-txt-secondary'
                            }`}
                          >
                            <span className={opt.isCode ? 'font-mono' : ''} dir={opt.isCode ? 'ltr' : undefined}>
                              {opt.text}
                            </span>
                            {isCorrectOption && <span className="text-[10px] text-emerald-500 font-black">الإجابة الصحيحة ✓</span>}
                            {isUserOption && !isCorrectOption && <span className="text-[10px] text-red-500 font-black">إجابتك ✕</span>}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-txt-muted font-bold border-t border-bdr/40 pt-2">
                      💡 الشرح التوضيحي: {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
