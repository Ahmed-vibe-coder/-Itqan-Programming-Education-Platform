import React, { useState, useEffect } from 'react';
import { Award, Plus, Search, ShieldCheck, CheckCircle2, XCircle, FileText, QrCode, ExternalLink, Download, Eye, Users, Edit3, Save, HelpCircle, Code } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { publicHtmlExamService, PublicExamAttempt, PublicCertificate } from '@/services/publicHtmlExamService';
import { getHtmlExamQuestions, saveHtmlExamQuestions, HtmlExamQuestion } from '@/data/htmlExamQuestions';
import { HtmlExamCertificateModal } from '@/components/certificates/HtmlExamCertificateModal';

export const CertificateManagementPage: React.FC = () => {
  const [certificates, setCertificates] = useState<any[]>([
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

  const [publicAttempts, setPublicAttempts] = useState<PublicExamAttempt[]>([]);
  const [htmlQuestions, setHtmlQuestions] = useState<HtmlExamQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<'html_exam' | 'edit_questions' | 'manual_issue'>('html_exam');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertificateModalData, setSelectedCertificateModalData] = useState<any | null>(null);

  // Question editing state
  const [editingQuestion, setEditingQuestion] = useState<HtmlExamQuestion | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [score, setScore] = useState(100);

  useEffect(() => {
    async function loadData() {
      // Load public exam attempts
      const attempts = await publicHtmlExamService.getAllAttempts();
      setPublicAttempts(attempts);

      // Load HTML exam questions
      const currentQuestions = getHtmlExamQuestions();
      setHtmlQuestions(currentQuestions);

      // Load Supabase certificates
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('issued_at', { ascending: false });

        if (!error && data) {
          setCertificates(data.map((c: any) => ({
            id: c.id,
            certificateNumber: c.certificate_number,
            verificationCode: c.verification_code,
            studentName: c.student_full_name,
            courseName: c.course_name,
            issuedAt: new Date(c.issued_at).toISOString().split('T')[0],
            finalScore: c.final_score,
            status: c.status
          })));
        }
      }
    }
    loadData();
  }, []);

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !courseName) return;

    const randomCode = Math.random().toString(36).substring(2, 8);
    const certNum = `ITQAN-${randomCode.toUpperCase()}`;

    if (isSupabaseConfigured()) {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('certificates').insert({
        certificate_number: certNum,
        verification_code: randomCode,
        student_id: userData.user?.id || '10000000-0000-0000-0000-000000000001',
        course_id: '10000000-0000-0000-0000-000000000001',
        student_full_name: studentName,
        course_name: courseName,
        final_score: score,
        status: 'active'
      }).select().single();

      if (!error && data) {
        setCertificates([{
          id: data.id,
          certificateNumber: data.certificate_number,
          verificationCode: data.verification_code,
          studentName: data.student_full_name,
          courseName: data.course_name,
          issuedAt: new Date(data.issued_at).toISOString().split('T')[0],
          finalScore: data.final_score,
          status: data.status
        }, ...certificates]);
        setStudentName('');
        setCourseName('');
        return;
      }
    }

    const newCert = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
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

  const handleSaveQuestionChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const updated = htmlQuestions.map((q) => (q.id === editingQuestion.id ? editingQuestion : q));
    setHtmlQuestions(updated);
    saveHtmlExamQuestions(updated);
    setEditingQuestion(null);
    setSaveSuccessMsg('تم حفظ وتحديث السؤال بنجاح في قاعدة البيانات والفرونت إند!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const filteredAttempts = publicAttempts.filter((a) =>
    a.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.verification_code && a.verification_code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-right font-sans">
      {/* Modal Certificate Preview for Admin */}
      {selectedCertificateModalData && (
        <HtmlExamCertificateModal
          studentName={selectedCertificateModalData.studentName}
          score={selectedCertificateModalData.score}
          totalQuestions={selectedCertificateModalData.totalQuestions}
          percentage={selectedCertificateModalData.percentage}
          completedAt={selectedCertificateModalData.completedAt}
          verificationCode={selectedCertificateModalData.verificationCode}
          onClose={() => setSelectedCertificateModalData(null)}
        />
      )}

      {/* Page Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">إدارة نتائج امتحانات HTML والشهادات والأسئلة</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            متابعة نتائج الطلاب، تنزيل الشهادات، وتعديل وإدارة أسئلة امتحان HTML الـ 30 بالكامل.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-surface-secondary p-1 rounded-xl border border-bdr flex-wrap">
          <button
            onClick={() => setActiveTab('html_exam')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'html_exam'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-txt-muted hover:text-txt-primary'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>نتائج الطلاب والشهادات</span>
          </button>

          <button
            onClick={() => setActiveTab('edit_questions')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'edit_questions'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-txt-muted hover:text-txt-primary'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>تعديل أسئلة الامتحان ({htmlQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('manual_issue')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'manual_issue'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-txt-muted hover:text-txt-primary'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إصدار شهادة يدوية</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Tab 1: Public HTML Exam Results */}
      {activeTab === 'html_exam' && (
        <div className="bg-surface border border-bdr p-6 rounded-2xl space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-bdr pb-4">
            <div>
              <h2 className="text-base font-black text-txt-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>سجل نتائج الطلاب في اختبار HTML الشامل (30 سؤالاً)</span>
              </h2>
              <p className="text-xs text-txt-muted">
                يظهر هنا اسم الطالب الثلاثي، الدرجة من 30، النسبة المئوية، حالة النجاح، وخيار تنزيل الشهادة.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث باسم الطالب أو الكود..."
                className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-bdr rounded-xl text-xs text-txt-primary focus:outline-none focus:border-brand-primary"
              />
              <Search className="w-4 h-4 text-txt-muted absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Attempts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-surface-secondary text-txt-muted border-b border-bdr">
                  <th className="p-3 font-bold">اسم الطالب</th>
                  <th className="p-3 font-bold">النتيجة</th>
                  <th className="p-3 font-bold">النسبة المئوية</th>
                  <th className="p-3 font-bold">الحالة</th>
                  <th className="p-3 font-bold">رمز الشهادة</th>
                  <th className="p-3 font-bold">تاريخ الإتمام</th>
                  <th className="p-3 font-bold text-center">معاينة / تنزيل الشهادة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bdr">
                {filteredAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-txt-muted font-bold">
                      لا توجد محاولات مجراة حتى الآن لمطابقة البحث.
                    </td>
                  </tr>
                ) : (
                  filteredAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="p-3 font-black text-txt-primary">{attempt.student_name}</td>
                      <td className="p-3 font-mono font-bold">{attempt.score} / {attempt.total_questions}</td>
                      <td className="p-3 font-mono font-bold text-brand-primary">%{attempt.percentage}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            attempt.passed
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-500 border border-red-500/30'
                          }`}
                        >
                          {attempt.passed ? 'ناجح ✅' : 'لم يتجاوز 50% ❌'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-txt-muted" dir="ltr">
                        {attempt.verification_code || '---'}
                      </td>
                      <td className="p-3 text-txt-muted">
                        {new Date(attempt.completed_at).toLocaleString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3 text-center">
                        {attempt.passed ? (
                          <button
                            onClick={() =>
                              setSelectedCertificateModalData({
                                studentName: attempt.student_name,
                                score: attempt.score,
                                totalQuestions: attempt.total_questions,
                                percentage: attempt.percentage,
                                completedAt: attempt.completed_at,
                                verificationCode: attempt.verification_code,
                              })
                            }
                            className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تنزيل الشهادة</span>
                          </button>
                        ) : (
                          <span className="text-txt-muted text-[11px]">بدون شهادة (يلزم إعادة)</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Edit HTML 30 Questions */}
      {activeTab === 'edit_questions' && (
        <div className="bg-surface border border-bdr p-6 rounded-2xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-4">
            <div>
              <h2 className="text-base font-black text-txt-primary flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand-primary" />
                <span>إدارة وتعديل أسئلة امتحان HTML الـ 30 بالكامل</span>
              </h2>
              <p className="text-xs text-txt-muted">
                يمكن للأدمن تعديل نص أي سؤال، خيارات الإجابة، الإجابة الصحيحة، الشرح، أو الكود المرفق فوراً.
              </p>
            </div>
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-black rounded-full border border-brand-primary/20">
              إجمالي الأسئلة: {htmlQuestions.length}
            </span>
          </div>

          {/* List of Questions for Editing */}
          <div className="space-y-4">
            {htmlQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-surface-secondary/60 border border-bdr rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-black text-sm text-txt-primary">{q.prompt}</span>
                  </div>

                  <button
                    onClick={() => setEditingQuestion({ ...q })}
                    className="px-3 py-1.5 bg-brand-primary text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:bg-brand-primary-hover shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل السؤال</span>
                  </button>
                </div>

                {q.codeSnippet && (
                  <div className="p-2.5 bg-slate-950 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto" dir="ltr">
                    <pre><code>{q.codeSnippet}</code></pre>
                  </div>
                )}

                {/* Options display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {q.options.map((opt) => {
                    const isCorrect = opt.id === q.correctAnswerId;
                    return (
                      <div
                        key={opt.id}
                        className={`p-2 rounded-xl border flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'bg-surface border-bdr text-txt-secondary'
                        }`}
                      >
                        <span className={opt.isCode ? 'font-mono' : ''} dir={opt.isCode ? 'ltr' : undefined}>
                          {opt.text}
                        </span>
                        {isCorrect && <span className="text-[10px] text-emerald-500 font-black">الإجابة الصحيحة ✓</span>}
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-txt-muted font-bold border-t border-bdr pt-2">
                  💡 الشرح: {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Edit Modal Dialog */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-bdr rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h3 className="font-black text-base text-txt-primary flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand-primary" />
                <span>تعديل السؤال {editingQuestion.id}</span>
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="w-8 h-8 rounded-full bg-surface-secondary border border-bdr text-txt-muted hover:text-txt-primary flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestionChanges} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-txt-secondary mb-1">نص السؤال الرئيسي</label>
                <textarea
                  rows={2}
                  required
                  value={editingQuestion.prompt}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, prompt: e.target.value })}
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-3 text-xs text-txt-primary font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-txt-secondary mb-1">الكود البرمجي المرفق (اختياري)</label>
                <textarea
                  rows={3}
                  value={editingQuestion.codeSnippet || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, codeSnippet: e.target.value })}
                  dir="ltr"
                  className="w-full bg-slate-950 text-emerald-400 font-mono border border-bdr rounded-xl p-3 text-xs"
                />
              </div>

              {/* Options Editing */}
              <div className="space-y-2">
                <label className="block font-bold text-txt-secondary">الخيارات المتاحة (تحديد الإجابة الصحيحة بالراديو)</label>
                {editingQuestion.options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_ans"
                      checked={editingQuestion.correctAnswerId === opt.id}
                      onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswerId: opt.id })}
                      className="w-4 h-4 text-brand-primary shrink-0"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...editingQuestion.options];
                        newOpts[idx] = { ...newOpts[idx], text: e.target.value };
                        setEditingQuestion({ ...editingQuestion, options: newOpts });
                      }}
                      className="flex-1 bg-surface-secondary border border-bdr rounded-xl p-2 text-xs text-txt-primary font-medium"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-txt-secondary mb-1">الشرح التوضيحي للحل</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-3 text-xs text-txt-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-bdr">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 bg-surface-secondary border border-bdr rounded-xl font-bold text-txt-muted"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl shadow-md inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات الآن</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Manual Certificate Issuance */}
      {activeTab === 'manual_issue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleIssueCertificate} className="bg-surface border border-bdr p-6 rounded-2xl space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-primary" />
              <span>إصدار شهادة يدوية خاصة</span>
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

          <div className="lg:col-span-2 bg-surface border border-bdr p-6 rounded-2xl space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>الشهادات الصادرة السارية</span>
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
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      نشطة وسارية
                    </span>
                  </div>
                  <p className="text-txt-muted">{cert.courseName} — درجة الاختبار: {cert.finalScore}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
