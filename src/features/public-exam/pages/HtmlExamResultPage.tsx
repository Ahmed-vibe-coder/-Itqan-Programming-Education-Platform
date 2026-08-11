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

      const data = await publicHtmlExamService.getAttemptById(attemptId);
      if (data) {
        setAttempt(data);
        if (data.passed) {
          setShowCertificate(true); // Automatically trigger certificate for passed students
        }
      }
      setLoading(false);
    }

    loadAttempt();
  }, [attemptId]);

  const handleRetakeExam = () => {
    navigate('/html-exam/take', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-txt-muted font-bold">جاري تصحيح وتجهيز نتائج الامتحان...</span>
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
            يبدو أن معرّف النتيجة غير متوفر أو تم مسحه. يمكنك البدء بمحاولة امتحان جديدة.
          </p>
          <Button onClick={handleRetakeExam} variant="primary" size="md" fullWidth>
            بدء امتحان جديد
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
            {passed ? 'تم اجتياز الامتحان بنجاح' : 'لم تتجاوز 50% — يلزم إعادة الامتحان'}
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
              {passed ? `مبروك يا بطل! أتممت امتحان HTML بنجاح` : `حظاً أوفر! لم تتمكن من اجتياز الامتحان`}
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
                  <h3 className="font-black text-sm text-txt-primary">تم إشعارات وإصدار شهادتك الرسمية!</h3>
                  <p className="text-xs text-txt-muted font-bold">
                    تم رسم شهادتك الرقمية المعتمدة بكود توثيق رقمي: <span dir="ltr" className="font-mono text-brand-primary">{verification_code}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Button
                  onClick={() => setShowCertificate(true)}
                  variant="primary"
                  size="md"
                  leftIcon={<Award className="w-4 h-4" />}
                >
                  عرض وتحميل الشهادة المرسومة
                </Button>
                <Button
                  onClick={handleRetakeExam}
                  variant="secondary"
                  size="md"
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  تحسين الدرجة (إعادة الامتحان)
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-right space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-red-500">يتطلب الحصول على الشهادة تحقيق 50% (15/30) على الأقل</h3>
                  <p className="text-xs text-txt-muted font-bold">
                    حققت {score} إجابات صحيحة من 30. يمكنك مراجعة الإجابات الصحيحة أدناه ثم إعادة الامتحان فوراً.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleRetakeExam}
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<RotateCcw className="w-5 h-5" />}
              >
                إعادة الامتحان الآن
              </Button>
            </div>
          )}

          {/* Tabs Navigation for Review */}
          <div className="flex items-center justify-center border-b border-bdr gap-4 pt-4">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 text-xs font-black transition-all border-b-2 ${
                activeTab === 'summary'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-txt-muted hover:text-txt-primary'
              }`}
            >
              ملخص الأداء والتقييم
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`pb-3 text-xs font-black transition-all border-b-2 ${
                activeTab === 'review'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-txt-muted hover:text-txt-primary'
              }`}
            >
              مراجعة الـ 30 سؤالاً وإجاباتهم (Question Review)
            </button>
          </div>

          {/* Tab 1: Summary */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-right pt-2">
              <div className="p-4 bg-surface-secondary border border-bdr rounded-2xl space-y-1">
                <span className="text-txt-muted font-bold block">إجمالي الأسئلة</span>
                <span className="font-black text-base text-txt-primary font-mono">{total_questions} أسئلة</span>
              </div>
              <div className="p-4 bg-surface-secondary border border-bdr rounded-2xl space-y-1">
                <span className="text-txt-muted font-bold block">الإجابات الصحيحة</span>
                <span className="font-black text-base text-emerald-500 font-mono">{score} إجابة</span>
              </div>
              <div className="p-4 bg-surface-secondary border border-bdr rounded-2xl space-y-1 col-span-2 sm:col-span-1">
                <span className="text-txt-muted font-bold block">الإجابات الخاطئة</span>
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
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-txt-primary text-sm">
                        سؤال {idx + 1}: {q.prompt}
                      </span>
                      {isCorrect ? (
                        <Badge variant="success" size="sm">إجابة صحيحة</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">إجابة خاطئة</Badge>
                      )}
                    </div>

                    {q.codeSnippet && (
                      <div className="p-3 bg-slate-950 rounded-xl text-slate-100 font-mono text-xs overflow-x-auto" dir="ltr">
                        <pre><code>{q.codeSnippet}</code></pre>
                      </div>
                    )}

                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt) => {
                        const isUserOpt = userChoice === opt.id;
                        const isCorrectOpt = q.correctAnswerId === opt.id;

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between font-medium ${
                              isCorrectOpt
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold'
                                : isUserOpt
                                ? 'bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300 font-bold'
                                : 'bg-surface border-bdr text-txt-muted'
                            }`}
                          >
                            <span className={opt.isCode ? 'font-mono' : ''} dir={opt.isCode ? 'ltr' : undefined}>
                              {opt.text}
                            </span>
                            {isCorrectOpt && <span className="text-[11px] font-bold text-emerald-500">الإجابة الصحيحة ✓</span>}
                            {isUserOpt && !isCorrectOpt && <span className="text-[11px] font-bold text-red-500">اختيارك ✗</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-surface border border-bdr rounded-xl text-txt-secondary leading-relaxed">
                      <strong className="text-brand-primary block mb-0.5">الشرح التوضيحي:</strong>
                      {q.explanation}
                    </div>
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
