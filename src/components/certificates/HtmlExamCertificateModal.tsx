import React from 'react';
import { Share2, Download, Award, X } from 'lucide-react';

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
  const isPassed = percentage >= 50;
  const examTitle = 'اختبار إتقان الشامل في لغة HTML';
  const courseTitle = 'دورة تطوير الويب - HTML';

  const handleShareWhatsApp = () => {
    const message = `
🎓 *شهادة إتمام كورس HTML*

👤 *الطالب:* ${studentName}
📚 *الامتحان:* ${examTitle}
📖 *المادة:* ${courseTitle}

✅ *النتيجة:* ${score}/${totalQuestions} (${percentage.toFixed(1)}%)
⏱️ *التاريخ:* ${new Date(completedAt).toLocaleString('ar-EG')}
🔒 *رمز التوثيق:* ${verificationCode}

${isPassed ? '🎉 *تهانينا! نجح في الامتحان*' : '📝 *يحتاج إلى مراجعة*'}

_منصة إتقان (Itqan Academy) - نظام الامتحانات الذكي_
    `.trim();

    const whatsappUrl = `https://wa.me/${teacherPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownload = () => {
    const text = `
==============================================
          شهادة إتمام كورس HTML
         منصة إتقان (Itqan Academy)
==============================================

الطالب: ${studentName}
الامتحان: ${examTitle}
المادة: ${courseTitle}

النتيجة: ${score}/${totalQuestions} (${percentage.toFixed(1)}%)
تاريخ الإصدار: ${new Date(completedAt).toLocaleString('ar-EG')}
رمز التوثيق الرقمي: ${verificationCode}

الحالة: ${isPassed ? '✅ ناجح' : '❌ راسب'}

صادرة عن منصة إتقان (Itqan Academy) - شهادة معتمدة لكورس HTML
    `.trim();

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate_${studentName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-right text-gray-900">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 border border-gray-300 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all z-20"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Content */}
        <div className="p-6 md:p-8">
          
          {/* Header with decorative elements */}
          <div className="text-center mb-8 relative pt-2">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 -z-10" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -z-10" />

            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg ring-4 ring-blue-100">
              <Award className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">شهادة إتمام كورس HTML</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
          </div>

          {/* Certificate Details */}
          <div className="space-y-6 mb-8">
            
            {/* Student Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                نشهد بأن الطالب
              </h3>
              <p className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                {studentName}
              </p>
              <p className="text-gray-600 font-medium">قد أتم بنجاح اختبار كورس HTML</p>
            </div>

            {/* Quiz Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-right">
                <p className="text-sm text-gray-600 mb-1">📚 عنوان الامتحان</p>
                <p className="font-semibold text-gray-900">{examTitle}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-right">
                <p className="text-sm text-gray-600 mb-1">📖 المادة / الكورس</p>
                <p className="font-semibold text-gray-900">{courseTitle}</p>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-green-300">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">النتيجة</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {score}/{totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">النسبة المئوية</p>
                  <p className={`text-2xl font-bold font-mono ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {percentage.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">الحالة</p>
                  <p className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {isPassed ? '✅ ناجح' : '❌ راسب'}
                  </p>
                </div>
              </div>
            </div>

            {/* Time & Date */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-right">
                <p className="text-sm text-gray-600 mb-1">🔒 رمز التوثيق الرقمي</p>
                <p className="font-semibold text-blue-600 font-mono" dir="ltr">
                  {verificationCode}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-right">
                <p className="text-sm text-gray-600 mb-1">📅 تاريخ الإتمام</p>
                <p className="font-semibold text-gray-900">
                  {new Date(completedAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 font-medium">
                صادرة عن منصة إتقان (Itqan Academy) — شهادة معتمدة لكورس HTML
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleShareWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              مشاركة عبر واتساب مع المعلم
            </button>

            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
              >
                <Download className="w-5 h-5" />
                تحميل الشهادة
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>

          {/* WhatsApp Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 text-center border border-gray-200">
            📱 سيتم إرسال الشهادة إلى رقم المعلم: <span dir="ltr" className="font-bold">{teacherPhone}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
