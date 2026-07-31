import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FileCheck2, Clock, ShieldAlert, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';

export const ExamLaunchPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const examDetails = {
    id: assessmentId || 'exam-101',
    title: 'امتحان الوحدة الأولى: HTML والأساسيات',
    courseTitle: 'HTML من الصفر',
    timeLimitMinutes: 20,
    passingScore: 70,
    totalQuestions: 5,
    maxScore: 50,
  };

  const handleStartExam = () => {
    // Navigate to active exam interface
    navigate(`/app/exams/${examDetails.id}/take`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto">
          <FileCheck2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full inline-block">
            {examDetails.courseTitle}
          </span>
          <h1 className="text-2xl font-bold text-txt-primary">{examDetails.title}</h1>
        </div>

        {/* Key Exam Metadata */}
        <div className="grid grid-cols-3 gap-3 bg-surface-secondary p-4 rounded-2xl border border-bdr text-center">
          <div>
            <span className="text-[11px] text-txt-muted block mb-1">وقت الامتحان</span>
            <div className="font-bold text-sm text-txt-primary flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>{examDetails.timeLimitMinutes} دقيقة</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-txt-muted block mb-1">عدد الأسئلة</span>
            <div className="font-bold text-sm text-txt-primary">
              {examDetails.totalQuestions} أسئلة
            </div>
          </div>

          <div>
            <span className="text-[11px] text-txt-muted block mb-1">درجة النجاح</span>
            <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
              %{examDetails.passingScore}
            </div>
          </div>
        </div>

        {/* Exam Rules & Instructions */}
        <div className="text-right bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-brand-primary flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>تعليمات الامتحان الهامة</span>
          </h3>

          <ul className="space-y-2 text-xs text-txt-secondary leading-relaxed list-disc list-inside">
            <li>يبدأ حساب الوقت فور الضغط على زر "بدء الامتحان الآن".</li>
            <li>يتم حفظ إجاباتك تلقائياً أثناء التنقل بين الأسئلة.</li>
            <li>عند انتهاء المؤقت التنازلي، سيتم تقديم إجاباتك وتصحيحها سحابياً تلقائياً.</li>
            <li>يمكنك تحديد الأسئلة للمراجعة قبل الاعتماد النهائي.</li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartExam}
          className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
        >
          <span>بدء الامتحان الآن</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
