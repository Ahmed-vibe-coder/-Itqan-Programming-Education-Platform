import React, { useState } from 'react';
import {
  X,
  FileJson,
  Sparkles,
  Copy,
  Check,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AIQuestionImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsImported: (newQuestions: any[]) => void;
}

export const AI_PROMPT_TEMPLATE = `أنت خبير في بناء المناهج والأسئلة التفاعلية لمنصة "إتقان - Itqan" لتعليم البرمجة للأطفال والناشئين (10-15 سنة).
المطلوب منك إعداد قائمة أسئلة برمجية في لغات (HTML, CSS, JavaScript) بصيغة JSON دقيقة ومطابقة تماماً للهيكل التالي دون كتابة أي نصوص خارج مصفوفة JSON:

[
  {
    "type": "mcq",
    "prompt_ar": "ما الوسم المخصص لإضافة صورة في صفحة HTML؟",
    "supporting_text_ar": "اختر الإجابة الصحيحة الوحيدة",
    "code_snippet": "<img src='logo.png' alt='Logo'>",
    "options": [
      { "id": "a", "text": "<img>" },
      { "id": "b", "text": "<a>" },
      { "id": "c", "text": "<p>" },
      { "id": "d", "text": "<div>" }
    ],
    "correct_answer": { "option_id": "a" },
    "explanation_ar": "الوسم <img> هو الوسم الذاتي المستخدم لإدراج الصور في HTML.",
    "points": 10,
    "difficulty": "easy",
    "course": "HTML"
  },
  {
    "type": "true_false",
    "prompt_ar": "يجب وضع محتوى الصفحة الظاهر للمستخدم داخل وسم body.",
    "options": [
      { "id": "true", "text": "صح" },
      { "id": "false", "text": "خطأ" }
    ],
    "correct_answer": { "value": true },
    "explanation_ar": "جميع العناصر المرئية للمستخدم توضع داخل body.",
    "points": 10,
    "difficulty": "easy",
    "course": "HTML"
  },
  {
    "type": "ordering",
    "prompt_ar": "رتّب أجزاء مستند HTML من الخارج إلى الداخل:",
    "options": [
      { "id": "1", "text": "<html>" },
      { "id": "2", "text": "<body>" },
      { "id": "3", "text": "<h1>" }
    ],
    "correct_answer": { "order": ["1", "2", "3"] },
    "explanation_ar": "عنصر html يغلف الصفحة، ثم body، ثم العناصر بداخلها.",
    "points": 15,
    "difficulty": "medium",
    "course": "HTML"
  }
]

شروط هامة:
1. "type" يجب أن يكون أحد الأنواع التالية فقط: "mcq", "true_false", "ordering", "code_output", "fill_blank".
2. "difficulty" تكون: "easy", "medium", "hard".
3. الإجابة بالعربية الفصحى البسيطة والمشجعة للأطفال.
4. أخرج مصفوفة JSON المباشرة فقط بدون أي مقدمات أو شروحات جانبية.`;

export const SAMPLE_JSON_TEMPLATE = [
  {
    type: "mcq",
    prompt_ar: "ما الوسم المخصص لإنشاء رابط تشعبي لصفحة أخرى؟",
    supporting_text_ar: "اختر الإجابة الصحيحة",
    code_snippet: "<a href='https://itqan.edu'>زيارة الموقع</a>",
    options: [
      { id: "a", text: "<a>" },
      { id: "b", text: "<link>" },
      { id: "c", text: "<button>" },
      { id: "d", text: "<nav>" }
    ],
    correct_answer: { option_id: "a" },
    explanation_ar: "استخدم الوسم <a> مع خاصية href لربط الصفحات.",
    points: 10,
    difficulty: "easy",
    course: "HTML"
  },
  {
    type: "mcq",
    prompt_ar: "أي خاصية في CSS تُستخدم لتغيير لون خلفية العنصر؟",
    supporting_text_ar: "اختر الخاصية المناسبة",
    code_snippet: "body { background-color: #0070f3; }",
    options: [
      { id: "a", text: "color" },
      { id: "b", text: "background-color" },
      { id: "c", text: "border-color" },
      { id: "d", text: "fill" }
    ],
    correct_answer: { option_id: "b" },
    explanation_ar: "خاصية background-color هي المسؤولة عن لون الخلفية.",
    points: 10,
    difficulty: "easy",
    course: "CSS"
  },
  {
    type: "true_false",
    prompt_ar: "في لغة JavaScript، الكلمة المفتاحية const تُستخدم لتعريف متغير يمكن تغيير قيمته لاحقاً.",
    options: [
      { id: "true", text: "صح" },
      { id: "false", text: "خطأ" }
    ],
    correct_answer: { value: false },
    explanation_ar: "المتغيرات المعرفة بـ const تكون ثوابت لا يمكن إعادة إسناد قيمة جديدة لها.",
    points: 15,
    difficulty: "medium",
    course: "JS"
  }
];

export const AIQuestionImportModal: React.FC<AIQuestionImportModalProps> = ({
  isOpen,
  onClose,
  onQuestionsImported
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'import'>('prompt');
  const [jsonInput, setJsonInput] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadTemplate = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "itqan_question_template.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      validateAndParseJSON(content);
    };
    reader.readAsText(file);
  };

  const validateAndParseJSON = (text: string) => {
    setValidationError(null);
    setParsedQuestions([]);

    if (!text.trim()) return;

    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        setValidationError('يجب أن يحتوي ملف JSON على مصفوفة أسئلة [...]');
        return;
      }

      const validList: any[] = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (!item.prompt_ar) {
          setValidationError(`السؤال رقم ${i + 1} لا يحتوي على نص السؤال (prompt_ar)`);
          return;
        }
        if (!item.type) {
          setValidationError(`السؤال رقم ${i + 1} لا يحتوي على نوع السؤال (type)`);
          return;
        }
        if (!item.correct_answer) {
          setValidationError(`السؤال رقم ${i + 1} لا يحتوي على الإجابة الصحيحة (correct_answer)`);
          return;
        }

        validList.push({
          id: item.id || `q-imported-${Date.now()}-${i}`,
          type: item.type || 'mcq',
          prompt_ar: item.prompt_ar,
          supporting_text_ar: item.supporting_text_ar || null,
          code_snippet: item.code_snippet || null,
          options: item.options || [],
          correct_answer: item.correct_answer,
          explanation_ar: item.explanation_ar || '',
          points: item.points || 10,
          difficulty: item.difficulty || 'medium',
          status: 'published',
          course: item.course || 'HTML',
          version: 1,
          created_at: new Date().toISOString()
        });
      }

      setParsedQuestions(validList);
    } catch (e: any) {
      setValidationError(`خطأ في تصفح صيغة JSON: ${e.message}`);
    }
  };

  const handleExecuteImport = async () => {
    if (parsedQuestions.length === 0) return;
    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured()) {
        const insertPayload = parsedQuestions.map(q => ({
          type: q.type,
          prompt_ar: q.prompt_ar,
          supporting_text_ar: q.supporting_text_ar,
          code_snippet: q.code_snippet,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation_ar: q.explanation_ar,
          points: q.points,
          difficulty: q.difficulty,
          status: q.status
        }));

        const { data, error } = await supabase.from('questions').insert(insertPayload).select();
        if (error) throw error;

        if (data) {
          onQuestionsImported(data);
        } else {
          onQuestionsImported(parsedQuestions);
        }
      } else {
        onQuestionsImported(parsedQuestions);
      }

      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error('Batch question import error:', err);
      setValidationError(`فشل الاستيراد في قاعدة البيانات: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-surface border border-bdr w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-bdr flex items-center justify-between bg-bg/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-txt-primary">مركز إنشاء واستيراد الأسئلة بالذكاء الاصطناعي</h2>
              <p className="text-xs text-txt-muted">حوّل أي ملف أو إجابة من ChatGPT/Gemini إلى أسئلة تفاعلية جاهزة في منصتك فوراً.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-txt-muted hover:text-txt-primary hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-bdr bg-surface text-xs font-bold">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'prompt'
                ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                : 'border-transparent text-txt-muted hover:text-txt-primary'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. قالب الموجه وتوجيه الذكاء الاصطناعي (AI Prompt & Template)</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'import'
                ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                : 'border-transparent text-txt-muted hover:text-txt-primary'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>2. استيراد ملف الأسئلة (JSON Import) {parsedQuestions.length > 0 && `(${parsedQuestions.length})`}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'prompt' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>كيف تعمل هذه الخطوة؟</span>
                </div>
                <p>
                  انسخ الموجه البرمجي (Prompt) أدناه، وضع فيه مواضيع الأسئلة التي تريدها، ثم أرسله إلى **ChatGPT** أو **Claude** أو **Gemini**.
                  سيعطيك الذكاء الاصطناعي ملف أسئلة منسق. خذه واصقله في التبويب الثاني ليتم إنشاء الأسئلة فوراً بموقعك!
                </p>
              </div>

              {/* Prompt Text Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-txt-primary flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-brand-primary" />
                    <span>الموجه البرمجي لـ AI (Copy & Paste to ChatGPT):</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadTemplate}
                      className="px-3 py-1.5 bg-surface-hover hover:bg-bdr text-txt-primary text-xs font-bold rounded-lg border border-bdr flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل قالب JSON تجريبي</span>
                    </button>
                    <button
                      onClick={handleCopyPrompt}
                      className="px-3.5 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-all"
                    >
                      {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt ? 'تم النسخ!' : 'نسخ الموجه البرمجي'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  readOnly
                  value={AI_PROMPT_TEMPLATE}
                  className="w-full h-64 p-4 bg-bg border border-bdr rounded-xl font-mono text-xs text-txt-primary leading-relaxed focus:outline-none focus:border-brand-primary resize-none dir-rtl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('import')}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <span>الانتقال لاستيراد الأسئلة</span>
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-5">
              {/* File Upload Zone */}
              <div className="p-6 border-2 border-dashed border-bdr rounded-2xl bg-bg/40 text-center space-y-3 hover:border-brand-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
                  <FileJson className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-txt-primary">قم برفع ملف JSON الأسئلة</h3>
                  <p className="text-xs text-txt-muted mt-1">أو يمكنك لصق كود JSON مباشرة بالصندوق بالأسفل</p>
                </div>
                <div>
                  <label className="cursor-pointer px-4 py-2 bg-surface hover:bg-surface-hover border border-bdr rounded-xl text-xs font-bold text-txt-primary inline-flex items-center gap-2 transition-all">
                    <Upload className="w-4 h-4 text-brand-primary" />
                    <span>تصفح الملفات (.json)</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* JSON Textarea Paste */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-txt-primary flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-brand-primary" />
                  <span>أو الصق كود JSON من الذكاء الاصطناعي مباشرة هنا:</span>
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    validateAndParseJSON(e.target.value);
                  }}
                  placeholder="[ { &quot;type&quot;: &quot;mcq&quot;, &quot;prompt_ar&quot;: &quot;...&quot;, &quot;options&quot;: [...], &quot;correct_answer&quot;: {...} } ]"
                  className="w-full h-44 p-4 bg-bg border border-bdr rounded-xl font-mono text-xs text-txt-primary leading-relaxed focus:outline-none focus:border-brand-primary resize-none dir-ltr"
                />
              </div>

              {/* Error Message */}
              {validationError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Parsed Preview Table */}
              {parsedQuestions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        تم التحقق من صيغة {parsedQuestions.length} سؤال بنجاح وجاهزة للإضافة!
                      </span>
                    </div>
                  </div>

                  <div className="border border-bdr rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-bg text-txt-muted font-bold sticky top-0 border-b border-bdr">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">نوع السؤال</th>
                          <th className="p-3">نص السؤال</th>
                          <th className="p-3">الصعوبة</th>
                          <th className="p-3">النقاط</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bdr bg-surface">
                        {parsedQuestions.map((q, idx) => (
                          <tr key={idx} className="hover:bg-bg/50">
                            <td className="p-3 font-mono">{idx + 1}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-md font-bold">
                                {q.type}
                              </span>
                            </td>
                            <td className="p-3 text-txt-primary max-w-xs truncate">{q.prompt_ar}</td>
                            <td className="p-3">{q.difficulty}</td>
                            <td className="p-3 font-bold">{q.points} ن</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-bdr">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-surface hover:bg-surface-hover border border-bdr text-txt-muted text-xs font-bold rounded-xl transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={parsedQuestions.length === 0 || isSubmitting}
                  onClick={handleExecuteImport}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>جاري الإضافة لقاعدة البيانات...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اعتماد واستيراد الـ ({parsedQuestions.length}) سؤال الآن</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
