import React, { useRef, useEffect } from 'react';
import { Share2, Download, Award, X } from 'lucide-react';
import { drawHtmlCertificateOnCanvas, downloadCertificatePng } from '@/utils/drawCertificateCanvas';

export interface HtmlExamCertificateModalProps {
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  verificationCode?: string;
  teacherPhone?: string;
  onClose: () => void;
}

export const HtmlExamCertificateModal: React.FC<HtmlExamCertificateModalProps> = ({
  studentName,
  score,
  totalQuestions,
  percentage,
  completedAt,
  verificationCode = 'ITQAN-HTML-2026',
  teacherPhone = '+201128968983',
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPassed = percentage >= 50;
  const examTitle = 'اختبار إتقان الشامل في لغة HTML';
  const courseTitle = 'HTML & Web Development Course';

  useEffect(() => {
    if (canvasRef.current) {
      drawHtmlCertificateOnCanvas(canvasRef.current, {
        studentName,
        courseTitle,
        completedAt,
        verificationCode,
        academyName: 'HTML Master Academy (Itqan Platform)',
        instructorName: 'Ahmed Saeed',
        instructorTitle: 'Ai & Full Stack Developer',
      });
    }
  }, [studentName, courseTitle, completedAt, verificationCode]);

  const handleDownloadPng = () => {
    downloadCertificatePng({
      studentName,
      courseTitle,
      completedAt,
      verificationCode,
      academyName: 'HTML Master Academy (Itqan Platform)',
      instructorName: 'Ahmed Saeed',
      instructorTitle: 'Ai & Full Stack Developer',
    });
  };

  const handleShareWhatsApp = () => {
    const message = `
🎓 *شهادة إتمام كورس HTML الرسمية*

👤 *الطالب:* ${studentName}
📚 *الامتحان:* ${examTitle}
📖 *المادة:* ${courseTitle}

✅ *النتيجة:* ${score}/${totalQuestions} (${percentage.toFixed(1)}%)
⏱️ *التاريخ:* ${new Date(completedAt).toLocaleString('ar-EG')}
🔒 *رمز التوثيق:* ${verificationCode}

${isPassed ? '🎉 *تهانينا! نجح في الامتحان*' : '📝 *يحتاج إلى مراجعة*'}

_صادرة عن منصة إتقان (HTML Master Academy) — تم إصدار الشهادة بصيغة PNG معتمدة_
    `.trim();

    const whatsappUrl = `https://wa.me/${teacherPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative text-right text-white p-6 md:p-8 space-y-6">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all z-20"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg ring-4 ring-amber-400/20 mb-2">
            <Award className="w-9 h-9 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white">شهادة إتمام كورس HTML المعتمدة</h2>
          <p className="text-xs text-slate-400 font-bold">
            التصميم الكلاسيكي الفاخر 2026 (Canvas high-resolution ready for download)
          </p>
        </div>

        {/* Live Canvas Certificate Preview Container */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-white flex justify-center items-center p-2">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-xl shadow-lg max-w-full block"
            style={{ aspectRatio: '1200 / 800' }}
          />
        </div>

        {/* Certificate Metadata Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-1">اسم الطالب</span>
            <span className="font-bold text-amber-400 text-sm">{studentName}</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-1">رمز التوثيق</span>
            <span className="font-mono font-bold text-emerald-400 text-sm" dir="ltr">{verificationCode}</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-1">المحاضر المعتمد</span>
            <span className="font-bold text-white text-sm">Ahmed Saeed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownloadPng}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all text-base"
          >
            <Download className="w-5 h-5" />
            <span>تحميل الشهادة الرسمية (PNG عالية الدقة)</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold transition-all"
            >
              <Share2 className="w-4 h-4" />
              مشاركة عبر واتساب مع المعلم
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-5 py-3 rounded-xl font-bold transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-800/50 rounded-xl text-xs text-slate-400 text-center border border-slate-700/50">
          📱 سيتم إرسال نصوص التوثيق المعتمدة إلى المعلم: <span dir="ltr" className="font-bold text-amber-400">{teacherPhone}</span>
        </div>

      </div>
    </div>
  );
};

