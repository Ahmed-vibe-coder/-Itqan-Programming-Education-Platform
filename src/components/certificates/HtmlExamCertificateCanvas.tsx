import React, { useRef, useEffect } from 'react';
import { Download, Printer, Share2, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface CanvasCertificateProps {
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  verificationCode: string;
  teacherPhone?: string;
}

export const HtmlExamCertificateCanvas: React.FC<CanvasCertificateProps> = ({
  studentName,
  score,
  totalQuestions,
  percentage,
  completedAt,
  verificationCode,
  teacherPhone = '+201128968983',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1600;
    const height = 1131; // A4 aspect ratio 1.414 landscape

    canvas.width = width;
    canvas.height = height;

    // 1. Background Fill with Elegant Off-White / Ivory Cream
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#FAFAF9');
    bgGradient.addColorStop(0.5, '#F5F5F4');
    bgGradient.addColorStop(1, '#E7E5E4');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Outer Border (Gold / Emerald Accent)
    const margin = 40;
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#D97706'; // Gold accent
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#059669'; // Emerald accent
    ctx.strokeRect(margin + 16, margin + 16, width - (margin + 16) * 2, height - (margin + 16) * 2);

    // Corner Ornaments
    const drawCornerOrnament = (x: number, y: number) => {
      ctx.save();
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCornerOrnament(margin + 16, margin + 16);
    drawCornerOrnament(width - (margin + 16), margin + 16);
    drawCornerOrnament(margin + 16, height - (margin + 16));
    drawCornerOrnament(width - (margin + 16), height - (margin + 16));

    // 3. Header Ribbon / Badge Icon
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Platform Logo Text
    ctx.font = 'bold 30px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('منصة إتقان لتعليم البرمجة — ITQAN ACADEMY', width / 2, 130);

    // Decorative Line
    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, 165);
    ctx.lineTo(width / 2 + 250, 165);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#D97706';
    ctx.stroke();

    // Main Certificate Title
    ctx.font = 'black 64px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('شهـادة إتـقـان واجـتـيـاز', width / 2, 230);

    ctx.font = 'bold 36px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText('اختبار أساسيات وتطبيقات لغة HTML', width / 2, 300);

    // Attestation Text
    ctx.font = '28px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('تشهد الأكاديمية بأن البطل(ة) المبدع(ة):', width / 2, 385);

    // Student Name Box & Name
    const nameY = 480;
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(width / 2 - 400, nameY - 45, 800, 90);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#F59E0B';
    ctx.strokeRect(width / 2 - 400, nameY - 45, 800, 90);

    ctx.font = 'bold 52px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#B45309';
    ctx.fillText(studentName || 'طالب إتقان', width / 2, nameY + 5);

    // Body Text
    ctx.font = '26px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(
      'قد أتم بنجاح واقتدار كافة متطلبات الاختبار الشامل المكون من 30 سؤالاً في لغة HTML',
      width / 2,
      590
    );
    ctx.fillText('وأظهر كفاءة متميزة في فهم الوسوم الدلالية والهياكل والنماذج وبناء صفحات الويب.', width / 2, 635);

    // 4. Score Grid Banner
    const scoreBoxY = 720;
    ctx.fillStyle = '#ECFDF5';
    ctx.fillRect(width / 2 - 350, scoreBoxY - 45, 700, 90);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#10B981';
    ctx.strokeRect(width / 2 - 350, scoreBoxY - 45, 700, 90);

    ctx.font = 'bold 32px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#047857';
    ctx.fillText(
      `النتيجة العامة: ${score} / ${totalQuestions} أسئلة صحيحة  (${percentage.toFixed(1)}%)`,
      width / 2,
      scoreBoxY + 4
    );

    // 5. Verification Code & Date Footer
    const formattedDate = new Date(completedAt).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    ctx.font = 'bold 22px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'right';
    ctx.fillText(`تاريخ الإصدار: ${formattedDate}`, width - 120, 890);

    ctx.textAlign = 'left';
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#0284C7';
    ctx.fillText(`رمز التوثيق الرقمي: ${verificationCode}`, 120, 890);

    // 6. Seals and Signatures
    ctx.textAlign = 'center';

    // Official Stamp Seal Graphic
    const sealX = width / 2;
    const sealY = 930;

    ctx.save();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 55, 0, Math.PI * 2);
    ctx.fillStyle = '#D97706';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sealX, sealY, 48, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = 'bold 18px "Tajawal", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('منصة إتقان', sealX, sealY - 8);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('★ ITQAN ★', sealX, sealY + 14);
    ctx.restore();

    // Instructor Signature
    ctx.font = 'bold 22px "Tajawal", sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.fillText('اعتماد قسم التعليم والبرمجة', 240, 970);
    ctx.font = 'italic 20px "Segoe UI", cursive';
    ctx.fillStyle = '#D97706';
    ctx.fillText('Itqan Academic Board', 240, 1005);
  }, [studentName, score, totalQuestions, percentage, completedAt, verificationCode]);

  // Actions
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    const cleanName = (studentName || 'Student').replace(/\s+/g, '_');
    link.download = `Cert_HTML_Itqan_${cleanName}_${verificationCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <title>شهادة إتقان — ${studentName}</title>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
            img { max-width: 100%; height: auto; border: 1px solid #ccc; }
            @page { size: landscape; margin: 0; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShareWhatsApp = () => {
    const verifyUrl = `${window.location.origin}/verify/${verificationCode}`;
    const text = `
🎓 *شهادة إتقان واجتياز اختبار HTML الرسمي*

👤 *اسم الطالب:* ${studentName}
📚 *الاختبار:* اختبار أساسيات لغة HTML الشامل (30 سؤال)
📊 *النتيجة:* ${score}/${totalQuestions} (${percentage.toFixed(1)}%)
🔒 *رمز التحقق الرقمي:* ${verificationCode}
🌐 *رابط التوثيق:* ${verifyUrl}

🎉 _تم إصدار هذه الشهادة رسمياً عبر منصة إتقان لتعليم البرمجة_
    `.trim();

    const url = `https://wa.me/${teacherPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 text-center">
      {/* Canvas Display wrapper */}
      <div className="overflow-hidden rounded-2xl border-4 border-amber-500/30 shadow-2xl bg-surface p-2 max-w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-xl object-contain block mx-auto shadow-md"
          style={{ maxHeight: '600px' }}
        />
      </div>

      {/* Action Toolbar Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <Button
          onClick={handleDownloadPNG}
          variant="primary"
          size="lg"
          leftIcon={<Download className="w-5 h-5" />}
        >
          تحميل الشهادة (PNG)
        </Button>

        <Button
          onClick={handlePrint}
          variant="secondary"
          size="lg"
          leftIcon={<Printer className="w-5 h-5" />}
        >
          طباعة الشهادة (PDF)
        </Button>

        <Button
          onClick={handleShareWhatsApp}
          variant="secondary"
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-none"
          leftIcon={<Share2 className="w-5 h-5" />}
        >
          مشاركة واتساب
        </Button>
      </div>

      <div className="text-xs text-txt-muted flex items-center justify-center gap-1.5 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>شهادة رقمية معتمدة قابلة للتوثيق بكود: </span>
        <strong className="font-mono text-txt-primary">{verificationCode}</strong>
      </div>
    </div>
  );
};
