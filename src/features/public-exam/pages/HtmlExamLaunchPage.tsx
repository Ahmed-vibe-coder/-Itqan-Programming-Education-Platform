import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Award, FileCode2, CheckCircle2, ArrowLeft, Clock, ShieldCheck, User, Sparkles } from 'lucide-react';
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
      setErrorMsg('يرجى إدخال اسمك الكريم لإصداره على الشهادة الرسمية عند الاجتياز.');
      return;
    }

    localStorage.setItem('itqan_student_name', studentName.trim());
    navigate('/html-exam/take');
  };

  return (
    <div className="min-h-screen bg-bg text-txt-primary p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full space-y-6 text-right">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>العودة للرئيسية</span>
          </Link>
          <Badge variant="warning" size="md">اختبار عام مجاني بدون تسجيل دخول</Badge>
        </div>

        {/* Hero Banner Card */}
        <Card variant="default" padding="lg" className="space-y-6 border-brand-primary/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -z-10" />

          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 text-white">
              <FileCode2 className="w-10 h-10" />
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-txt-primary">
              اختبار إتقان الشامل في لغة HTML
            </h1>
            <p className="text-xs md:text-sm text-txt-muted max-w-lg mx-auto leading-relaxed">
              اختبر مهاراتك في لغة بناء صفحات الويب HTML عبر 30 سؤالاً شاملاً، واحصل فوراً على شهادة إتقان معتمدة مرسومة برمجياً قابلة للتحميل والمشاركة عند اجتياز 50% أو أكثر.
            </p>
          </div>

          {/* Key Exam Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3.5 bg-surface-secondary rounded-2xl border border-bdr space-y-1">
              <span className="text-[11px] text-txt-muted font-bold block">عدد الأسئلة</span>
              <span className="font-black text-base text-brand-primary font-mono">30 سؤالاً</span>
            </div>

            <div className="p-3.5 bg-surface-secondary rounded-2xl border border-bdr space-y-1">
              <span className="text-[11px] text-txt-muted font-bold block">زمن الامتحان</span>
              <span className="font-black text-base text-emerald-500 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                <span>بدون وقت (Untimed)</span>
              </span>
            </div>

            <div className="p-3.5 bg-surface-secondary rounded-2xl border border-bdr space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-txt-muted font-bold block">درجة النجاح</span>
              <span className="font-black text-base text-amber-500 font-mono">50% (15 / 30)</span>
            </div>
          </div>

          {/* Student Name Input Form */}
          <form onSubmit={handleStartExam} className="space-y-4 bg-brand-primary/5 p-5 rounded-2xl border border-brand-primary/20">
            <div className="space-y-2">
              <label className="block text-xs font-black text-txt-primary flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary" />
                <span>أدخل اسمك الثلاثي (سيظهر رسمياً على الشهادة عند اجتياز الامتحان):</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="مثال: أحمد علي عبد الله"
                className="w-full px-4 py-3 bg-surface border border-bdr rounded-xl text-sm font-bold text-txt-primary focus:outline-none focus:border-brand-primary transition-all text-right"
              />
              {errorMsg && <p className="text-xs text-red-500 font-bold">{errorMsg}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowLeft className="w-5 h-5" />}
            >
              بدء امتحان HTML الآن
            </Button>
          </form>

          {/* Features Highlights */}
          <div className="space-y-2.5 pt-2 border-t border-bdr text-xs text-txt-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>يتكون الامتحان من اختيار من متعدد، صح أم خطأ، وتوقع مخرجات الكود.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>يحصل الفائزون بـ 50% أو أعلى على شهادة معتمدة رقمية قابلة للتحميل بتنسيق PNG/PDF.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>في حال حصولك على أقل من 50%، يمكنك إعادة الامتحان فوراً ومجاناً.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
