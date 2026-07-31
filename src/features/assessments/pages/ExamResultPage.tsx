import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, RotateCcw, ArrowLeft, BookOpen, Lightbulb, Zap, Download } from 'lucide-react';
import { CertificateModal } from '@/components/shared/CertificateModal';
import { useAuth } from '@/app/providers/AuthProvider';

export const ExamResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { profile } = useAuth();
  const [showCertificate, setShowCertificate] = useState(false);

  const resultData = {
    assessmentTitle: 'امتحان الوحدة الأولى: HTML والأساسيات',
    subject: 'HTML',
    score: 90,
    maxScore: 100,
    passingScore: 70,
    passed: true,
    totalQuestions: 5,
    correctCount: 4,
    xpEarned: 100,
    smartRecommendation: {
      lessonId: 'l1030000-0000-0000-0000-000000000003',
      lessonTitle: 'هيكل مستند HTML',
      reason: 'يُنصح بمراجعة الفرق بين الوسمين head و body لتجاوز أخطائك في الأسئلة الدلالية.',
    },
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {showCertificate && (
        <CertificateModal
          data={{
            studentName: profile?.full_name || 'طالب نواة كود',
            courseOrExamTitle: resultData.assessmentTitle,
            subject: resultData.subject,
            score: resultData.score,
            maxScore: resultData.maxScore,
            percentage: (resultData.score / resultData.maxScore) * 100,
            isPassed: resultData.passed,
            timeTakenMinutes: 12,
            completedAt: new Date().toISOString(),
            verificationCode: `NAWA-CERT-${attemptId?.substring(0, 6).toUpperCase() || '2026-EXAM'}`,
          }}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-sm">
        {/* Celebration Header Icon */}
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full inline-block">
            نتيجة الامتحان الرسمية
          </span>
          <h1 className="text-2xl font-bold text-txt-primary">{resultData.assessmentTitle}</h1>
        </div>

        {/* Big Score Radial/Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-surface-secondary to-surface border border-emerald-500/30 max-w-sm mx-auto space-y-2 shadow-sm">
          <span className="text-xs text-txt-muted font-medium">درجتك المكتسبة</span>
          <div className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            %{resultData.score}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-bold pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>اجتزت الامتحان بنجاح! (+{resultData.xpEarned} XP)</span>
          </div>
        </div>

        {/* Certificate Claim Banner */}
        {resultData.passed && (
          <div className="p-4 bg-gradient-to-r from-brand-primary/10 via-purple-500/10 to-brand-primary/10 border border-brand-primary/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-txt-primary">مبروك! حصلت على شهادة إتمام رسمية</h3>
                <p className="text-[11px] text-txt-muted">يمكنك استعراض الشهادة وتنزيلها أو مشاركتها عبر واتساب المعلم.</p>
              </div>
            </div>

            <button
              onClick={() => setShowCertificate(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-brand-primary to-purple-600 hover:from-brand-primary-hover hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>عرض شهادة الإتمام</span>
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-secondary border border-bdr">
            <span className="text-txt-muted block mb-1">الأسئلة الصحيحة</span>
            <span className="font-bold text-base text-txt-primary">
              {resultData.correctCount} من {resultData.totalQuestions}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary border border-bdr">
            <span className="text-txt-muted block mb-1">حالة التقييم</span>
            <span className="font-bold text-base text-emerald-600 dark:text-emerald-400">
              معتمد ومحسوب
            </span>
          </div>
        </div>

        {/* Smart Review Recommendation Box */}
        {resultData.smartRecommendation && (
          <div className="text-right bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <Lightbulb className="w-4 h-4" />
              <span>توصية المراجعة الذكية (Smart Review)</span>
            </div>
            <p className="text-xs text-txt-primary leading-relaxed">
              {resultData.smartRecommendation.reason}
            </p>
            <Link
              to={`/app/lessons/${resultData.smartRecommendation.lessonId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1"
            >
              <BookOpen className="w-4 h-4" />
              <span>انتقل لدرس: {resultData.smartRecommendation.lessonTitle}</span>
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {resultData.passed && (
            <button
              onClick={() => setShowCertificate(true)}
              className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل الشهادة</span>
            </button>
          )}

          <Link
            to="/app/courses"
            className="flex-1 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>العودة للكورسات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

