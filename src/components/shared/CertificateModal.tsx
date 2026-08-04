import React from 'react';
import { Award, Share2, Download, X, CheckCircle2, Calendar, Clock, BookOpen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface CertificateData {
  studentName: string;
  courseOrExamTitle: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  timeTakenMinutes?: number;
  completedAt: string;
  verificationCode?: string;
  teacherPhone?: string;
}

interface CertificateModalProps {
  data: CertificateData;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ data, onClose }) => {
  const teacherPhone = data.teacherPhone || '+201128968983';

  const handleShareWhatsApp = () => {
    const message = `
🎓 *شهادة إتمام وتفوق - منصة إتقان (Itqan)*

👤 *الطالب:* ${data.studentName}
📚 *المنهج / الامتحان:* ${data.courseOrExamTitle}
📖 *المادة:* ${data.subject.toUpperCase()}

✅ *النتيجة:* ${data.score}/${data.maxScore} (${data.percentage.toFixed(1)}%)
⏱️ *الوقت:* ${data.timeTakenMinutes || 15} دقيقة
📅 *التاريخ:* ${new Date(data.completedAt).toLocaleDateString('ar-EG')}
🔒 *رمز التحقق:* ${data.verificationCode || 'ITQAN-CERT-2026'}

${data.isPassed ? '🎉 *تهانينا! أتم المنهج بنجاح وإتقان*' : '📝 *تم إتمام المحاولة*'}

_منصة إتقان — Itqan | المنصة التعليمية الذكية_
    `.trim();

    const whatsappUrl = `https://wa.me/${teacherPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownload = () => {
    const text = `
==============================================
         شهادة إتمام وتفوق رسمية
            منصة إتقان (Itqan)
==============================================

تشهد منصة "إتقان" بأن الطالب:
اسم الطالب: ${data.studentName}

قد أتم بنجاح ومتطلبات الإتقان لمسار:
المنهج / الامتحان: ${data.courseOrExamTitle}
التخصص: ${data.subject.toUpperCase()}

بيانات النتيجة والتقييم:
------------------------
الدرجة الحاصل عليها: ${data.score} من أصل ${data.maxScore}
النسبة المئوية: ${data.percentage.toFixed(1)}%
حالة الاعتماد: ${data.isPassed ? 'مكتمل بنجاح (Passed)' : 'قيد المراجعة'}
تاريخ الإصدار: ${new Date(data.completedAt).toLocaleString('ar-EG')}
رمز التوثيق الرقمي: ${data.verificationCode || 'ITQAN-CERT-2026'}

------------------------
منصة إتقان التعليمية الحديثة
    `.trim();

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate_${data.studentName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-bdr rounded-itqan-card shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-txt-primary text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-surface-secondary border border-bdr text-txt-muted hover:text-txt-primary flex items-center justify-center transition-all z-10"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Header Decorative Banner */}
          <div className="text-center relative pt-2">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl -z-10" />
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/20 ring-4 ring-orange-500/20">
              <Award className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-txt-primary mb-1">شهادة إتمام وتفوق</h2>
            <p className="text-xs text-txt-muted font-bold">صادرة عن منصة "إتقان" التعليمية</p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-400 mx-auto rounded-full mt-3" />
          </div>

          {/* Recipient Details Box */}
          <div className="bg-surface-secondary/70 border border-bdr rounded-itqan-card p-6 text-center space-y-2 relative overflow-hidden">
            <div className="text-xs font-black text-txt-muted uppercase tracking-wider">نشهد بأن الطالب(ة)</div>
            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 py-1">
              {data.studentName}
            </div>
            <div className="text-xs text-txt-secondary font-bold">قد أتم بنجاح وبكفاءة عالية دراسة واجتياز:</div>
            <div className="text-sm font-black text-orange-500 bg-orange-500/10 px-3.5 py-1 rounded-full inline-block mt-1 border border-orange-500/20">
              {data.courseOrExamTitle}
            </div>
          </div>

          {/* Quiz / Subject Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface border border-bdr rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] text-txt-muted font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                <span>المادة والتخصص</span>
              </span>
              <p className="font-black text-xs text-txt-primary uppercase font-mono">{data.subject}</p>
            </div>

            <div className="bg-surface border border-bdr rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] text-txt-muted font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>رمز التوثيق الرقمي</span>
              </span>
              <p className="font-mono font-black text-xs text-txt-primary" dir="ltr">
                {data.verificationCode || 'ITQAN-CERT-2026'}
              </p>
            </div>
          </div>

          {/* Dashed Border Score Results Card */}
          <div className="bg-emerald-500/5 border-2 border-dashed border-emerald-500/30 rounded-itqan-card p-5 text-center">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-txt-muted font-bold block mb-1">النتيجة</span>
                <span className="text-xl font-black font-mono text-txt-primary">
                  {data.score} / {data.maxScore}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-txt-muted font-bold block mb-1">النسبة المئوية</span>
                <span className={`text-xl font-black font-mono ${data.isPassed ? 'text-emerald-500' : 'text-red-500'}`}>
                  {data.percentage.toFixed(1)}%
                </span>
              </div>

              <div>
                <span className="text-[11px] text-txt-muted font-bold block mb-1">الحالة</span>
                <span className={`text-sm font-black block mt-1 ${data.isPassed ? 'text-emerald-500' : 'text-red-500'}`}>
                  {data.isPassed ? 'مكتمل بنجاح' : 'محاولة جديدة'}
                </span>
              </div>
            </div>
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-surface border border-bdr rounded-xl flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <div>
                <span className="text-txt-muted block text-[10px] font-bold">الوقت المستغرق</span>
                <span className="font-black text-txt-primary font-mono">{data.timeTakenMinutes || 15} دقيقة</span>
              </div>
            </div>

            <div className="p-3 bg-surface border border-bdr rounded-xl flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <div>
                <span className="text-txt-muted block text-[10px] font-bold">تاريخ الإصدار</span>
                <span className="font-black text-txt-primary">
                  {new Date(data.completedAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Button
              onClick={handleShareWhatsApp}
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              مشاركة الشهادة عبر واتساب
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDownload}
                variant="secondary"
                size="md"
                leftIcon={<Download className="w-4 h-4" />}
              >
                تحميل (TXT)
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                size="md"
              >
                إغلاق
              </Button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 text-[11px] text-txt-muted font-medium">
            📱 سيتم إرسال نسخة من الشهادة إلى المعلم المشرف عبر الواتساب: <span dir="ltr">{teacherPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
