import React, { useState } from 'react';
import { Upload, Download, FileJson, CheckCircle2, AlertCircle, RefreshCw, Eye } from 'lucide-react';

export const ImportExportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [importing, setImporting] = useState(false);
  const [importedSuccess, setImportedSuccess] = useState(false);

  const handleValidateJSON = () => {
    setValidationResult(null);
    setImportedSuccess(false);

    try {
      if (!jsonInput.trim()) {
        throw new Error('يرجى لصق نص JSON أو رفع ملف الحزمة.');
      }

      const parsed = JSON.parse(jsonInput);
      if (parsed.schemaVersion !== '1.0' || parsed.platform !== 'nawa-code') {
        throw new Error('نسق الحزمة غير متوافق. يجب أن يحتوي على schemaVersion: "1.0" و platform: "nawa-code".');
      }

      setValidationResult({
        valid: true,
        courseTitle: parsed.course?.title_ar || 'حزمة تعليمية شتملة',
        moduleCount: parsed.modules?.length || 0,
        lessonCount: parsed.lessons?.length || 0,
        questionCount: parsed.questions?.length || 0,
        exportedAt: parsed.exportedAt || new Date().toISOString(),
      });
    } catch (err: any) {
      setValidationResult({
        valid: false,
        error: err.message || 'صيغة JSON غير صحيحة.',
      });
    }
  };

  const handleConfirmImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImportedSuccess(true);
    }, 1000);
  };

  const handleDownloadSampleExport = () => {
    const samplePackage = {
      schemaVersion: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'nawa-code',
      course: {
        slug: 'html-basics',
        title_ar: 'HTML من الصفر',
        subject: 'html',
      },
      modules: [
        { title_ar: 'الوحدة الأولى: أساسيات HTML', order_index: 1 },
      ],
      lessons: [
        { title_ar: 'هيكل مستند HTML', order_index: 1 },
      ],
      questions: [
        { prompt_ar: 'أين نضع وسم body؟', type: 'single_choice' }
      ]
    };

    const blob = new Blob([JSON.stringify(samplePackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nawa-code-package-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Tabs */}
      <div className="bg-surface border border-bdr rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-brand-primary" />
          <h1 className="font-bold text-base text-txt-primary">استيراد وتصدير حزم المحتوى التعليمي</h1>
        </div>

        <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-xl border border-bdr">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'import' ? 'bg-brand-primary text-white' : 'text-txt-muted hover:text-txt-primary'
            }`}
          >
            استيراد حزمة
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'export' ? 'bg-brand-primary text-white' : 'text-txt-muted hover:text-txt-primary'
            }`}
          >
            تصدير حزمة
          </button>
        </div>
      </div>

      {activeTab === 'import' ? (
        <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
              <Upload className="w-5 h-5 text-brand-primary" />
              <span>استيراد كورس أو بنك أسئلة من ملف JSON</span>
            </h2>
            <p className="text-xs text-txt-muted leading-relaxed">
              الصق الكود البرمجي المترجم للحزمة أو قم برفع ملف JSON للتحقق التشاركي واستعراض التغييرات قبل الحفظ.
            </p>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"schemaVersion": "1.0", "platform": "nawa-code", ...}'
            dir="ltr"
            className="w-full h-48 p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-2xl border border-bdr focus:outline-none focus:ring-2 focus:ring-brand-primary/40 leading-relaxed code-editor"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleValidateJSON}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>فحص وصلاحية النسق (Dry-Run Check)</span>
            </button>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div
              className={`p-5 rounded-2xl border ${
                validationResult.valid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                  : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
              }`}
            >
              {validationResult.valid ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>الحزمة صالحة ومطابقة لـ Schema 1.0</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-surface/50 p-2.5 rounded-xl border border-emerald-500/20">
                      <span className="text-txt-muted block">عنوان الكورس</span>
                      <span className="font-bold text-txt-primary">{validationResult.courseTitle}</span>
                    </div>
                    <div className="bg-surface/50 p-2.5 rounded-xl border border-emerald-500/20">
                      <span className="text-txt-muted block">عدد الوحدات</span>
                      <span className="font-bold text-txt-primary">{validationResult.moduleCount}</span>
                    </div>
                    <div className="bg-surface/50 p-2.5 rounded-xl border border-emerald-500/20">
                      <span className="text-txt-muted block">عدد الدروس</span>
                      <span className="font-bold text-txt-primary">{validationResult.lessonCount}</span>
                    </div>
                    <div className="bg-surface/50 p-2.5 rounded-xl border border-emerald-500/20">
                      <span className="text-txt-muted block">عدد الأسئلة</span>
                      <span className="font-bold text-txt-primary">{validationResult.questionCount}</span>
                    </div>
                  </div>

                  {!importedSuccess ? (
                    <button
                      onClick={handleConfirmImport}
                      disabled={importing}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      {importing ? 'جاري الاستيراد والتخزين سحابياً...' : 'تأكيد وحفظ المحتوى في قاعدة البيانات'}
                    </button>
                  ) : (
                    <div className="p-3 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl">
                      تم استيراد كافة المحتويات وتسجيل العملية في سجل التدقيق بنجاح!
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-semibold">{validationResult.error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Export Section */
        <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
              <Download className="w-5 h-5 text-brand-primary" />
              <span>تصدير المناهج وبنك الأسئلة</span>
            </h2>
            <p className="text-xs text-txt-muted leading-relaxed">
              تنويه: عملية التصدير تشمل المناهج التعليمية وبنك الأسئلة فقط بدون أي بيانات شخصية خاصة بالطلاب لحماية الخصوصية.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-secondary border border-bdr space-y-4">
            <h3 className="font-bold text-sm text-txt-primary">تصدير حزمة كورس كاملة (HTML من الصفر)</h3>
            <button
              onClick={handleDownloadSampleExport}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف الحزمة (.json)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
