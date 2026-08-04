import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, RotateCcw, ArrowLeft, BookOpen, Lightbulb, Zap, Download } from 'lucide-react';
import { CertificateModal } from '@/components/shared/CertificateModal';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
    <div className="max-w-2xl mx-auto space-y-6 text-right">
      {showCertificate && (
        <CertificateModal
          data={{
            studentName: profile?.full_name || 'طالب إتقان',
            courseOrExamTitle: resultData.assessmentTitle,
            subject: resultData.subject,
            score: resultData.score,
            maxScore: resultData.maxScore,
            percentage: (resultData.score / resultData.maxScore) * 100,
            isPassed: resultData.passed,
            timeTakenMinutes: 12,
            completedAt: new Date().toISOString(),
            verificationCode: `ITQAN-CERT-${attemptId?.substring(0, 6).toUpperCase() || '2026-EXAM'}`,
          }}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <Card variant="default" padding="lg" className="text-center space-y-6 shadow-itqan-soft border-orange-500/20">
        {/* Celebration Header Icon */}
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20">
          <Award className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <Badge variant="success" size="md">نتيجة الامتحان الرسمية</Badge>
          <h1 className="text-2xl font-black text-txt-primary">{resultData.assessmentTitle}</h1>
        </div>

        {/* Big Score Radial/Card */}
        <div className="p-6 rounded-itqan-card bg-gradient-to-br from-emerald-500/10 via-surface-secondary to-surface border border-emerald-500/30 max-w-sm mx-auto space-y-2 shadow-sm">
          <span className="text-xs text-txt-muted font-bold">درجتك المكتسبة</span>
          <div className="text-5xl font-black text-emerald-500 font-mono">
            %{resultData.score}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-500 font-black pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>اجتزت الامتحان بنجاح! (+{resultData.xpEarned} XP)</span>
          </div>
        </div>

        {/* Certificate Claim Banner */}
        {resultData.passed && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-itqan-card flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xs text-txt-primary">مبروك! حصلت على شهادة إتمام رسمية</h3>
                <p className="text-[11px] text-txt-muted font-bold">يمكنك استعراض الشهادة وتنزيلها أو مشاركتها عبر واتساب المعلم.</p>
              </div>
            </div>

            <Button
              onClick={() => setShowCertificate(true)}
              variant="primary"
              size="md"
              leftIcon={<Award className="w-4 h-4" />}
            >
              عرض الشهادة
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-secondary border border-bdr">
            <span className="text-txt-muted block mb-1 font-bold">الأسئلة الصحيحة</span>
            <span className="font-black text-base text-txt-primary font-mono">
              {resultData.correctCount} من {resultData.totalQuestions}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary border border-bdr">
            <span className="text-txt-muted block mb-1 font-bold">حالة التقييم</span>
            <span className="font-black text-base text-emerald-500">
              معتمد ومحسوب
            </span>
          </div>
        </div>

        {/* Smart Review Recommendation Box */}
        {resultData.smartRecommendation && (
          <div className="text-right bg-amber-500/10 border border-amber-500/30 rounded-itqan-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-black text-xs">
              <Lightbulb className="w-4 h-4" />
              <span>توصية المراجعة الذكية (Smart Review)</span>
            </div>
            <p className="text-xs text-txt-primary font-medium leading-relaxed">
              {resultData.smartRecommendation.reason}
            </p>
            <Link
              to={`/app/lessons/${resultData.smartRecommendation.lessonId}`}
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-500 hover:underline pt-1"
            >
              <BookOpen className="w-4 h-4" />
              <span>انتقل لدرس: {resultData.smartRecommendation.lessonTitle}</span>
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {resultData.passed && (
            <Button
              onClick={() => setShowCertificate(true)}
              variant="secondary"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
            >
              تنزيل الشهادة
            </Button>
          )}

          <Link to="/app/courses" className="flex-1">
            <Button variant="primary" size="md" fullWidth rightIcon={<ArrowLeft className="w-4 h-4" />}>
              العودة لكتاب الكورسات
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
