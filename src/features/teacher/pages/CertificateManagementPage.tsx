import React, { useState } from 'react';
import { Award, Plus, Search, ShieldCheck, CheckCircle2, XCircle, FileText, QrCode, ExternalLink, Download } from 'lucide-react';

export const CertificateManagementPage: React.FC = () => {
  const [certificates, setCertificates] = useState([
    {
      id: 'cert-1',
      certificateNumber: 'ITQAN-88A92B',
      verificationCode: '88a92b',
      studentName: 'أحمد علي حسن',
      courseName: 'أساسيات لغة HTML — بناء هيكل الصفحات',
      issuedAt: '2026-07-30',
      finalScore: 98,
      status: 'active'
    },
    {
      id: 'cert-2',
      certificateNumber: 'ITQAN-77B41C',
      verificationCode: '77b41c',
      studentName: 'سارة محمد محمود',
      courseName: 'فن التنسيق بلغة CSS — الألوان والمخططات',
      issuedAt: '2026-07-29',
      finalScore: 95,
      status: 'active'
    }
  ]);

  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [score, setScore] = useState(100);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !courseName) return;

    const randomCode = Math.random().toString(36).substring(2, 8);
    const newCert = {
      id: `cert-${Date.now()}`,
      certificateNumber: `ITQAN-${randomCode.toUpperCase()}`,
      verificationCode: randomCode,
      studentName: studentName,
      courseName: courseName,
      issuedAt: new Date().toISOString().split('T')[0],
      finalScore: score,
      status: 'active'
    };

    setCertificates([newCert, ...certificates]);
    setStudentName('');
    setCourseName('');
  };

  const handleRevoke = (id: string) => {
    setCertificates(certificates.map(c => c.id === id ? { ...c, status: 'revoked' } : c));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">إدارة الشهادات المعتمدة والتحقق الرسمية</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            إصدار الشهادات الأكاديمية للطلاب، ومعاينة القوالب، وتوفير رابط التحقق العام من خلال الـ QR Code.
          </p>
        </div>
      </div>

      {/* Form & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Issue Certificate Form */}
        <form onSubmit={handleIssueCertificate} className="bg-surface border border-bdr p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-primary" />
            <span>إصدار شهادة جديدة طازجة</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-txt-secondary mb-1">اسم الطالب الثلاثي</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="أحمد علي حسن"
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-txt-secondary mb-1">الكورس المكتمل</label>
              <input
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="أساسيات لغة HTML"
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-txt-secondary mb-1">الدرجة النهائية (%)</label>
              <input
                type="number"
                max={100}
                min={50}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary font-mono"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-md">
              إصدار الشهادة وحفظها
            </button>
          </div>
        </form>

        {/* Issued Certificates List */}
        <div className="lg:col-span-2 bg-surface border border-bdr p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>الشهادات الصادرة السارية والملغاة</span>
            </span>
            <span className="text-xs font-mono font-bold text-brand-primary">الإجمالي: {certificates.length}</span>
          </h2>

          <div className="space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-4 rounded-xl border border-bdr bg-surface-secondary/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-txt-primary">{cert.studentName}</span>
                    <span className="font-mono text-[11px] text-txt-muted">({cert.certificateNumber})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cert.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {cert.status === 'active' ? 'نشطة وسارية' : 'ملغاة'}
                  </span>
                </div>

                <p className="text-txt-muted">{cert.courseName} — درجة الاختبار: {cert.finalScore}%</p>

                <div className="flex items-center justify-between border-t border-bdr pt-2">
                  <a
                    href={`/verify/${cert.verificationCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-primary hover:underline flex items-center gap-1 font-bold text-[11px]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>صفحة التحقق المباشرة</span>
                  </a>

                  {cert.status === 'active' && (
                    <button
                      onClick={() => handleRevoke(cert.id)}
                      className="text-rose-500 hover:underline font-bold text-[11px]"
                    >
                      إلغاء الشهادة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
