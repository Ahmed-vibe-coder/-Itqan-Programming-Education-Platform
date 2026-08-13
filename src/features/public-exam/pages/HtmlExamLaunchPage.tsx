import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileCode2, ArrowLeft, User, Sparkles, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const HtmlExamLaunchPage: React.FC = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('itqan_student_name') || '';
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg('يرجى إدخال اسمك الكريم ليتم طباعته على الشهادة الرسمية.');
      return;
    }

    localStorage.setItem('itqan_student_name', studentName.trim());
    navigate('/html-exam/take');
  };

  return (
    <div className="min-h-screen bg-bg text-txt-primary p-4 md:p-8 flex items-center justify-center font-sans transition-colors">
      <div className="max-w-xl w-full space-y-5 text-right">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>العودة للرئيسية</span>
          </Link>
          <Badge variant="warning" size="md">اختبار مهارات معتمد مباشر</Badge>
        </div>

        {/* Main Launch Card */}
        <Card variant="default" padding="lg" className="space-y-6 border-bdr shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Ambient background glow */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Hero Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 text-white transform hover:scale-105 transition-all">
              <FileCode2 className="w-8 h-8" />
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-txt-primary tracking-tight">
              اختبار شهادة إتقان الشامل في لغة HTML
            </h1>
            <p className="text-xs md:text-sm text-txt-secondary max-w-md mx-auto leading-relaxed font-normal">
              اختبر مهاراتك التطبيقية في لغة بناء وتنسيق الويب HTML، واحصل فوراً على شهادة إتقان المعتمدة عند إكمال الاختبار.
            </p>
          </div>

          {/* Exam Questions Info Badge */}
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center gap-3 text-center">
            <BookOpen className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-txt-secondary font-bold">عدد أسئلة الاختبار:</span>
              <span className="font-black text-lg text-orange-500 font-mono">30 سؤالاً</span>
            </div>
          </div>

          {/* Student Name Input Form */}
          <form onSubmit={handleStartExam} className="space-y-4 bg-surface-secondary/40 p-4 sm:p-5 rounded-2xl border border-bdr shadow-inner">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-txt-primary flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500 shrink-0" />
                <span>أدخل اسمك الثلاثي (ليظهر رسمياً على الشهادة عند الإكمال):</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="مثال: أحمد علي عبد الله"
                className="w-full px-4 py-3 bg-surface border border-bdr rounded-xl text-sm font-bold text-txt-primary focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-right shadow-xs"
              />
              {errorMsg && <p className="text-xs text-red-500 font-bold animate-in fade-in">{errorMsg}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowLeft className="w-5 h-5" />}
              className="shadow-lg shadow-orange-500/20 hover:scale-[1.01] transition-all font-black text-base"
            >
              بدء اختبار HTML الآن
            </Button>
          </form>

          {/* Simplified Clean Highlights */}
          <div className="space-y-2 pt-2 border-t border-bdr text-xs text-txt-muted font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>أسئلة تفاعلية متنوعة تقيس المفاهيم والمهارات البرمجية الأساسية.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
              <span>شهادة إتقان رقمية معتمدة قابلة للتحميل والمشاركة عند الإنجاز.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

